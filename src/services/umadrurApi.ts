import { apiRequest } from "./apiClient";

export type JovemUmadrur = {
  id: string;
  nome: string;
  cpf: string;
  congregacao: string;
  telefone: string;
  sexo?: string;
};

export type ConsultaCpfErrorCode =
  | "CPF_NAO_ENCONTRADO"
  | "RESERVA_EXISTENTE"
  | "ERRO_CONSULTA";

export class ConsultaCpfError extends Error {
  code: ConsultaCpfErrorCode;
  cadastroUrl?: string;

  constructor(message: string, code: ConsultaCpfErrorCode, cadastroUrl?: string) {
    super(message);
    this.name = "ConsultaCpfError";
    this.code = code;
    this.cadastroUrl = cadastroUrl;
  }
}

type ConsultaCpfResponse = {
  encontrado: boolean;
  jovem?: JovemUmadrur;
  message?: string;
  code?: ConsultaCpfErrorCode;
  cadastroUrl?: string;
};

export async function buscarJovemPorCpf(cpf: string): Promise<JovemUmadrur> {
  const digits = cpf.replace(/\D/g, "");

  if (digits.length !== 11) {
    throw new ConsultaCpfError(
      "Informe um CPF válido com 11 números.",
      "ERRO_CONSULTA"
    );
  }

  try {
    const result = await apiRequest<ConsultaCpfResponse>("/api/consultar-cpf", {
      method: "POST",
      body: JSON.stringify({ cpf: digits }),
    });

    if (!result.encontrado || !result.jovem) {
      throw new ConsultaCpfError(
        result.message ||
          "Não encontramos seu CPF no cadastro da UMADRUR. Faça seu cadastro e tente novamente.",
        result.code || "CPF_NAO_ENCONTRADO",
        result.cadastroUrl
      );
    }

    return result.jovem;
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Não foi possível consultar o CPF agora.";

    if (message.toLowerCase().includes("já existe uma reserva")) {
      throw new ConsultaCpfError(message, "RESERVA_EXISTENTE");
    }

    if (
      message.toLowerCase().includes("não encontramos") ||
      message.toLowerCase().includes("cadastro da umadrur")
    ) {
      throw new ConsultaCpfError(
        message,
        "CPF_NAO_ENCONTRADO",
        "https://cadastroumadrur.adbrr.com.br"
      );
    }

    throw new ConsultaCpfError(message, "ERRO_CONSULTA");
  }
}