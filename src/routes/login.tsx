import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { login } from "@/services/authApi";
import anchor from "@/assets/brand/anchor.png";
import { Loader2, Lock, Mail } from "lucide-react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, password);
      navigate({ to: "/admin" });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--mist)] px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 rounded-3xl border border-[var(--navy)]/8 bg-white p-7 shadow-soft sm:p-9">
        <div className="flex items-center gap-3">
          <img src={anchor} alt="" className="h-12 w-12" />
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--petrol)]">Área administrativa</div>
            <div className="font-display text-lg font-semibold text-[var(--navy)]">Congresso da Sede</div>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--navy)]">E-mail</label>
          <div className="flex items-center gap-2 rounded-xl border border-[var(--navy)]/12 bg-white px-3 focus-within:border-[var(--petrol)]">
            <Mail className="h-4 w-4 text-[var(--navy)]/50" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border-0 bg-transparent py-3 text-sm outline-none" placeholder="seu@email.com" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--navy)]">Senha</label>
          <div className="flex items-center gap-2 rounded-xl border border-[var(--navy)]/12 bg-white px-3 focus-within:border-[var(--petrol)]">
            <Lock className="h-4 w-4 text-[var(--navy)]/50" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border-0 bg-transparent py-3 text-sm outline-none" placeholder="••••••••" />
          </div>
        </div>
        {err && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--navy)] py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-[var(--petrol)] disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Entrar
        </button>
        <p className="text-center text-[11px] text-muted-foreground">
          Acesso restrito · <Link to="/" className="text-[var(--petrol)] hover:underline">voltar ao site</Link>
        </p>
      </form>
    </div>
  );
}
