import { Shirt, Waves, BookOpen, Wallet } from "lucide-react";

const items = [
  {
    icon: Shirt,
    title: "Camisa oficial",
    text: "Identidade visual exclusiva, edição limitada do congresso.",
    n: "01",
  },
  {
    icon: Waves,
    title: "Tema Profundidade",
    text: "Mas enchei-vos do Espírito Santo.",
    n: "02",
  },
  {
    icon: BookOpen,
    title: "Efésios 5:18",
    text: "Referência bíblica que inspira toda a campanha.",
    n: "03",
  },
  {
    icon: Wallet,
    title: "Pix facilitado",
    text: "À vista ou parcelado em 3 datas planejadas.",
    n: "04",
  },
];

export function Highlights() {
  return (
    <section id="destaques" className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--petrol)]">
            Sobre a campanha
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--navy)] sm:text-4xl">
            Quatro razões para vestir <span className="text-gradient-ocean">Profundidade</span>.
          </h2>
        </div>
        <div className="hidden h-[1px] flex-1 bg-gradient-to-r from-[var(--navy)]/15 via-[var(--navy)]/8 to-transparent md:block" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text, n }) => (
          <article
            key={title}
            className="group relative overflow-hidden rounded-3xl border border-[var(--navy)]/10 bg-white/80 p-7 shadow-soft backdrop-blur-sm transition hover:-translate-y-1 hover:border-[var(--petrol)]/30 hover:shadow-elevated"
          >
            <span className="absolute -right-2 -top-2 font-display text-7xl font-bold text-[var(--navy)]/[0.04]">
              {n}
            </span>
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--navy)] to-[var(--petrol)] text-white shadow-soft">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <h3 className="relative mt-6 font-display text-xl font-semibold tracking-tight text-[var(--navy)]">
              {title}
            </h3>
            <p className="relative mt-2 text-sm leading-relaxed text-[var(--navy)]/65">{text}</p>
            <span className="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-[var(--petrol)] to-[var(--cyan-glow)] transition-transform duration-500 group-hover:scale-x-100" />
          </article>
        ))}
      </div>
    </section>
  );
}
