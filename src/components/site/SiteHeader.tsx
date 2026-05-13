import { Link } from "@tanstack/react-router";
import anchor from "@/assets/brand/anchor.png";

export function SiteHeader({ onOpenFaq, onReservar }: { onOpenFaq: () => void; onReservar: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--navy)]/8 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link to="/" className="group flex items-center gap-3.5">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,oklch(0.78_0.13_220/0.25),transparent_70%)] opacity-0 transition group-hover:opacity-100" />
            <img src={anchor} alt="" className="relative h-9 w-9 object-contain" />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--petrol)]/80">
              Congresso da Sede · 2026
            </div>
            <div className="font-display text-[15px] font-semibold tracking-tight text-[var(--navy)]">
              Camisa Oficial · Profundidade
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenFaq}
            className="hidden rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--navy)]/65 transition hover:text-[var(--navy)] sm:inline-flex"
          >
            Dúvidas
          </button>
          <button
            onClick={onReservar}
            className="rounded-full bg-[var(--navy)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-soft transition hover:bg-[var(--petrol)] hover:shadow-elevated"
          >
            Reservar
          </button>
        </div>
      </div>
    </header>
  );
}
