import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { listarReservas } from "@/services/reservasApi";
import { isAuthenticated, logout as authLogout } from "@/services/authApi";
import type { Reserva } from "@/lib/reservas";
import { siteConfig, formatBRL } from "@/lib/site-config";
import anchor from "@/assets/brand/anchor.png";
import { LogOut, ArrowRight, Shirt, Wallet, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

function AdminDashboard() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isAuthenticated()) {
      navigate({ to: "/login" });
      return;
    }
    listarReservas().then(setReservas);
  }, [navigate]);

  const stats = useMemo(() => {
    const total = reservas.length;
    const camisas = reservas.reduce((s, r) => s + r.quantidade, 0);
    const valor = reservas.reduce((s, r) => s + r.valorTotal, 0);
    const pago = reservas.filter((r) => r.status === "confirmado" || r.status === "pago" || r.status === "entregue").reduce((s, r) => s + r.valorTotal, 0);
    const pendente = valor - pago;
    const porTamanho: Record<string, number> = {};
    reservas.forEach((r) => {
      porTamanho[r.tamanho] = (porTamanho[r.tamanho] || 0) + r.quantidade;
    });
    return { total, camisas, valor, pago, pendente, porTamanho };
  }, [reservas]);

  function logout() { authLogout(); navigate({ to: "/login" }); }

  return (
    <div className="min-h-screen bg-[var(--mist)]">
      <header className="border-b border-[var(--navy)]/8 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link to="/admin" className="flex min-w-0 items-center gap-3">
            <img src={anchor} alt="" className="h-8 w-8 sm:h-9 sm:w-9" />
            <div className="min-w-0">
              <div className="truncate font-display text-sm uppercase tracking-wide text-[var(--navy)] sm:text-base">Painel administrativo</div>
              <div className="truncate text-[9px] uppercase tracking-[0.25em] text-[var(--petrol)] sm:text-[10px]">{siteConfig.evento}</div>
            </div>
          </Link>
          <button onClick={logout} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--navy)]/15 bg-white px-3 py-1.5 text-xs font-medium text-[var(--navy)] hover:border-[var(--petrol)]/40">
            <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Shirt} label="Reservas" value={stats.total} />
          <Stat icon={Shirt} label="Total de camisas" value={stats.camisas} />
          <Stat icon={Wallet} label="Total vendido" value={formatBRL(stats.valor)} />
          <Stat icon={CheckCircle2} label="Total pago" value={formatBRL(stats.pago)} accent />
          <Stat icon={Clock} label="Total pendente" value={formatBRL(stats.pendente)} />
        </div>

        <Panel title="Reservas por tamanho">
          {Object.keys(stats.porTamanho).length === 0 ? (
            <Empty />
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
              {Object.entries(stats.porTamanho).map(([t, n]) => (
                <div key={t} className="rounded-xl bg-[var(--mist)] px-3 py-3 text-center">
                  <div className="font-display text-base font-semibold text-[var(--navy)]">{t}</div>
                  <div className="text-xs text-[var(--petrol)]">{n}</div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Últimas reservas">
          {reservas.length === 0 ? (
            <Empty />
          ) : (
            <ul className="divide-y divide-[var(--navy)]/8">
              {reservas.slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-[var(--navy)]">{r.nome}</div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      Tam {r.tamanho} · {formatBRL(r.valorTotal)}
                    </div>
                  </div>
                  <Link to="/admin/reservas/$id" params={{ id: r.id }} className="rounded-md bg-[var(--navy)] px-2.5 py-1 text-[11px] text-white hover:bg-[var(--petrol)]">
                    Abrir
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Link to="/admin/reservas" className="inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-[var(--petrol)]">
          Ver todas as reservas <ArrowRight className="h-4 w-4" />
        </Link>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-[var(--navy)]/8 bg-white p-4 shadow-soft">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className={`mt-1 font-display text-2xl font-semibold ${accent ? "text-[var(--petrol)]" : "text-[var(--navy)]"}`}>{value}</div>
    </div>
  );
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--navy)]/8 bg-white p-5 shadow-soft">
      <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--petrol)]">{title}</h3>
      {children}
    </div>
  );
}
function Empty() {
  return <div className="rounded-xl bg-[var(--mist)] p-4 text-center text-xs text-muted-foreground">Sem dados ainda.</div>;
}
