import type { Tamanho } from "./site-config";

export type ReservaStatus =
  | "pendente"
  | "comprovante-enviado"
  | "confirmado"
  | "cancelado"
  // legacy compat
  | "aguardando"
  | "pago"
  | "entregue";

export type Reserva = {
  id: string;
  createdAt: string;
  nome: string;
  cpf: string;
  congregacao: string;
  telefone: string;
  sexo?: string;
  tamanho: Tamanho;
  quantidade: number;
  formaPagamento: "pix-vista" | "pix-parcelado";
  valorTotal: number;
  valorParcela?: number;
  status: ReservaStatus;
  comprovanteUrl?: string; // legacy (primeiro anexo)
  comprovantes?: Anexo[];
};

export type Anexo = {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
};

const KEY = "reservas-camisa-congresso";

export function getReservas(): Reserva[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveReserva(r: Reserva) {
  const all = getReservas();
  all.unshift(r);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function updateStatus(id: string, status: ReservaStatus) {
  const all = getReservas().map((r) => (r.id === id ? { ...r, status } : r));
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function updateReserva(id: string, patch: Partial<Reserva>) {
  const all = getReservas().map((r) => (r.id === id ? { ...r, ...patch } : r));
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function getReservaById(id: string): Reserva | undefined {
  return getReservas().find((r) => r.id === id);
}

export function newId() {
  return `R-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
