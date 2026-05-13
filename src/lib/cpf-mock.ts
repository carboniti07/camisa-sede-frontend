// Arquivo legado mantido apenas para compatibilidade.
// A consulta real de CPF agora é feita pelo backend separado em src/services/umadrurApi.ts.

export type JovemCadastro = {
  id: string;
  nome: string;
  cpf: string;
  congregacao: string;
  telefone: string;
  sexo?: string;
};

export async function buscarPorCpf(): Promise<JovemCadastro | null> {
  return null;
}
