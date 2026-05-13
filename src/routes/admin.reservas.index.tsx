import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { listarReservas, confirmarPagamento, marcarPendente, cancelarReserva, anexarComprovante, type Reserva } from "@/services/reservasApi";
import type { ReservaStatus } from "@/lib/reservas";
import { isAuthenticated, logout as authLogout } from "@/services/authApi";
import { siteConfig, formatBRL, cpfMasked } from "@/lib/site-config";
import anchor from "@/assets/brand/anchor.png";
import { LogOut, Eye, MessageCircle, Copy, Paperclip, CheckCircle2, Clock, XCircle } from "lucide-react";

export const Route = createFileRoute("/admin/reservas/")({ component: AdminReservas });

export const statusLabels: Record<ReservaStatus, string> = {
  pendente: "Pendente",
  "comprovante-enviado": "Comprovante enviado",
  confirmado: "Confirmado",
  cancelado: "Cancelado",
  // legacy
  aguardando: "Pendente",
  pago: "Confirmado",
  entregue: "Confirmado",
};

const statusColors: Record<ReservaStatus, string> = {
  pendente: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  "comprovante-enviado": "bg-sky-500/15 text-sky-700 border-sky-500/30",
  confirmado: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  cancelado: "bg-red-500/15 text-red-700 border-red-500/30",
  aguardando: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  pago: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  entregue: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
};

function AdminReservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCpf, setFiltroCpf] = useState("");
  const [filtroTam, setFiltroTam] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isAuthenticated()) {
      navigate({ to: "/login" });
      return;
    }
    listarReservas().then(setReservas);
  }, [navigate]);

  async function refresh() {
    setReservas(await listarReservas());
  }

  const filtradas = useMemo(() => reservas.filter((r) =>
    (!filtroNome || r.nome.toLowerCase().includes(filtroNome.toLowerCase())) &&
    (!filtroCpf || r.cpf.includes(filtroCpf.replace(/\D/g, ""))) &&
    (!filtroTam || r.tamanho === filtroTam) &&
    (!filtroStatus || r.status === filtroStatus)
  ), [reservas, filtroNome, filtroCpf, filtroTam, filtroStatus]);

  function logout() { authLogout(); navigate({ to: "/login" }); }

  return (
    <div className="min-h-screen bg-[var(--mist)]">
      <header className="border-b border-[var(--navy)]/8 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link to="/admin" className="flex min-w-0 items-center gap-3">
            <img src={anchor} alt="" className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
            <div className="min-w-0">
              <div className="truncate font-display text-sm uppercase tracking-wide text-[var(--navy)] sm:text-base">Reservas</div>
              <div className="truncate text-[9px] uppercase tracking-[0.25em] text-[var(--petrol)] sm:text-[10px]">{siteConfig.evento}</div>
            </div>
          </Link>
          <button onClick={logout} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--navy)]/15 bg-white px-3 py-1.5 text-xs font-medium text-[var(--navy)] hover:border-[var(--petrol)]/40">
            <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-10">
        <div className="rounded-2xl border border-[var(--navy)]/8 bg-white p-3 shadow-soft sm:p-4">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Input p="Nome" value={filtroNome} onChange={setFiltroNome} />
            <Input p="CPF" value={filtroCpf} onChange={setFiltroCpf} />
            <Select p="Tamanho" value={filtroTam} onChange={setFiltroTam} options={["PP","P","M","G","GG","G1","G2","G3","G4"]} />
            <Select p="Status" value={filtroStatus} onChange={setFiltroStatus} options={[
              ["pendente","Pendente"],
              ["comprovante-enviado","Comprovante enviado"],
              ["confirmado","Confirmado"],
              ["cancelado","Cancelado"],
            ]} />
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-2xl border border-[var(--navy)]/8 bg-white shadow-soft lg:block">
          <table className="w-full text-sm">
            <thead className="bg-[var(--mist)] text-xs uppercase tracking-wider text-[var(--navy)]/70">
              <tr>
                {["Nome","CPF","Tam.","Total","Pgto","Status","Data","Ações"].map(h => <th key={h} className="p-3 text-left">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Nenhuma reserva.</td></tr>}
              {filtradas.map((r) => (
                <tr key={r.id} className="border-t border-[var(--navy)]/8 hover:bg-[var(--mist)]/50">
                  <td className="p-3 font-medium text-[var(--navy)]">{r.nome}</td>
                  <td className="p-3 text-muted-foreground">{cpfMasked(r.cpf)}</td>
                  <td className="p-3 font-display">{r.tamanho}</td>
                  <td className="p-3 font-semibold text-[var(--petrol)]">{formatBRL(r.valorTotal)}</td>
                  <td className="p-3 text-xs">{r.formaPagamento === "pix-vista" ? "À vista" : "Parcelado"}</td>
                  <td className="p-3"><StatusBadge s={r.status} /></td>
                  <td className="p-3 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td className="p-3">
                    <button
                      onClick={() => navigate({ to: "/admin/reservas/$id", params: { id: r.id } })}
                      className="inline-flex items-center gap-1 rounded-md bg-[var(--navy)] px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-[var(--petrol)]"
                    >
                      <Eye className="h-3 w-3" /> Abrir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 lg:hidden">
          {filtradas.length === 0 && <div className="rounded-2xl border border-[var(--navy)]/8 bg-white p-6 text-center text-sm text-muted-foreground">Nenhuma reserva.</div>}
          {filtradas.map((r) => (
            <Link to="/admin/reservas/$id" params={{ id: r.id }} key={r.id} className="block rounded-2xl border border-[var(--navy)]/8 bg-white p-4 shadow-soft active:scale-[0.99]">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-medium text-[var(--navy)]">{r.nome}</div>
                  <div className="truncate text-xs text-muted-foreground">{siteConfig.congregacaoFixa} · {r.telefone}</div>
                </div>
                <StatusBadge s={r.status} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <Mini label="Tam." v={r.tamanho} />
                <Mini label="Pgto" v={r.formaPagamento === "pix-vista" ? "À vista" : "3x"} />
                <Mini label="Total" v={formatBRL(r.valorTotal)} accent />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

function Mini({ label, v, accent }: { label: string; v: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`font-display text-base ${accent ? "text-[var(--petrol)]" : "text-[var(--navy)]"}`}>{v}</div>
    </div>
  );
}
function Input({ p, value, onChange }: { p: string; value: string; onChange: (v: string) => void }) {
  return <input placeholder={p} value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-[var(--navy)]/12 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--petrol)]" />;
}
function Select({ p, value, onChange, options }: { p: string; value: string; onChange: (v: string) => void; options: (string | [string, string])[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-[var(--navy)]/12 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--petrol)]">
      <option value="">{p}</option>
      {options.map((o) => {
        const [v, l] = Array.isArray(o) ? o : [o, o];
        return <option key={v} value={v}>{l}</option>;
      })}
    </select>
  );
}

export function StatusBadge({ s }: { s: ReservaStatus }) {
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColors[s]}`}>{statusLabels[s]}</span>;
}

// re-export utilitários para outras telas
export { confirmarPagamento, marcarPendente, cancelarReserva, anexarComprovante };
export const _admin_icons = { Eye, MessageCircle, Copy, Paperclip, CheckCircle2, Clock, XCircle };
