import { apiRequest } from "./apiClient";
import type { Reserva, ReservaStatus } from "@/lib/reservas";

export type ReservaPayload = {
  jovemId?: string;
  nome: string;
  cpf: string;
  telefone: string;
  congregacao: string;
  sexo?: string;
  tamanho: Reserva["tamanho"];
  quantidade: number;
  formaPagamento: Reserva["formaPagamento"];
  valorTotal: number;
  valorParcela?: number;
};

export async function listarReservas(): Promise<Reserva[]> {
  return apiRequest<Reserva[]>("/api/admin/reservas");
}

export async function buscarReserva(id: string): Promise<Reserva | undefined> {
  return apiRequest<Reserva>(`/api/admin/reservas/${id}`);
}

export async function criarReservaCamisa(payload: ReservaPayload): Promise<Reserva> {
  return apiRequest<Reserva>("/api/reservas", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function confirmarPagamento(id: string): Promise<void> {
  await apiRequest(`/api/admin/reservas/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "confirmado" }),
  });
}

export async function marcarPendente(id: string): Promise<void> {
  await apiRequest(`/api/admin/reservas/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "pendente" }),
  });
}

export async function cancelarReserva(id: string): Promise<void> {
  await apiRequest(`/api/admin/reservas/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "cancelado" }),
  });
}

export async function anexarComprovante(id: string, arquivo: File): Promise<string> {
  const formData = new FormData();
  formData.append("comprovante", arquivo);

  const result = await apiRequest<{ url: string }>(`/api/admin/reservas/${id}/comprovantes`, {
    method: "POST",
    body: formData,
  });

  return result.url;
}

export async function removerComprovante(id: string, anexoId: string): Promise<void> {
  await apiRequest(`/api/admin/reservas/${id}/comprovantes/${anexoId}`, {
    method: "DELETE",
  });
}

export type { Reserva, ReservaStatus };
