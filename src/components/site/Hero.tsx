import { siteConfig, formatBRL } from "@/lib/site-config";
import waveFlow from "@/assets/brand/wave-flow.png";
import splash from "@/assets/brand/splash.png";
import waveLine from "@/assets/brand/wave-line.png";
import star from "@/assets/brand/star.png";
import anchor from "@/assets/brand/anchor.png";
import profundidadeArt from "@/assets/brand/profundidade.png";
import { ArrowRight, ChevronDown } from "lucide-react";

export function Hero({ onReservar }: { onReservar: () => void }) {
  return (
    <section className="relative overflow-hidden">
      {/* Camadas decorativas — distribuídas com equilíbrio, baixa opacidade */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10%] h-[820px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.82_0.10_220/0.22),transparent_60%)]" />
        <img src={splash} alt="" className="absolute -left-24 top-12 w-[32%] max-w-[460px] opacity-[0.08] mix-blend-multiply" />
        <img src={waveFlow} alt="" className="absolute -right-28 top-28 w-[40%] max-w-[600px] opacity-[0.09] mix-blend-multiply" />
        <img src={anchor} alt="" className="absolute right-[-3%] bottom-[6%] w-[22%] max-w-[300px] opacity-[0.06]" />
        <img src={waveLine} alt="" className="absolute left-[4%] bottom-[12%] w-[26%] max-w-[400px] opacity-[0.14] mix-blend-multiply" />
        <img src={star} alt="" className="absolute right-[14%] top-[16%] h-7 w-7 opacity-25" />
        <img src={star} alt="" className="absolute left-[12%] top-[34%] h-4 w-4 opacity-20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 md:pb-32 md:pt-24">
        {/* Editorial overline */}
        <div className="flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--petrol)]/80 animate-rise">
          <span className="h-px w-8 bg-[var(--petrol)]/30" />
          Edição Limitada · {siteConfig.versiculo}
          <span className="h-px w-8 bg-[var(--petrol)]/30" />
        </div>

        {/* Centered editorial composition */}
        <div className="mt-7 text-center animate-rise" style={{ animationDelay: "100ms" }}>
          <p className="font-script text-3xl text-[var(--ocean)] sm:text-4xl md:text-5xl">
            Mas enchei-vos do Espírito Santo
          </p>

          <h1 className="relative mt-6 flex justify-center">
            <span className="sr-only">Profundidade</span>
            <img
              src={profundidadeArt}
              alt="Profundidade"
              className="w-full max-w-[1100px] select-none mix-blend-multiply"
              draggable={false}
            />
          </h1>

          <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-3">
            <span className="h-px w-12 bg-[var(--navy)]/20" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--navy)]/60">
              Camisa Oficial · Congresso da Sede
            </span>
            <span className="h-px w-12 bg-[var(--navy)]/20" />
          </div>
        </div>

        {/* Editorial supporting block */}
        <div className="mx-auto mt-14 grid max-w-5xl items-end gap-10 md:grid-cols-3 animate-rise" style={{ animationDelay: "240ms" }}>
          <div className="text-left md:order-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              A Campanha
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--navy)]/75">
              A peça oficial da juventude da Sede AD Brás Rudge Ramos para viver o congresso com
              identidade. Tiragem limitada, design exclusivo.
            </p>
          </div>

          <div className="md:order-2 md:text-center">
            <button
              onClick={onReservar}
              className="group relative inline-flex items-center gap-2.5 rounded-full bg-[var(--navy)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-elevated transition hover:bg-[var(--petrol)] hover:shadow-glow"
            >
              <span className="absolute inset-0 rounded-full bg-[var(--cyan-glow)]/0 transition group-hover:bg-[var(--cyan-glow)]/15" />
              Reservar agora
              <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
            <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Reserva por CPF · Pix
            </div>
          </div>

          <div className="text-left md:order-3 md:text-right">
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              A partir de
            </div>
            <div className="mt-1 font-display text-5xl font-semibold tracking-tight text-[var(--navy)]">
              {formatBRL(siteConfig.valorCamisa)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">À vista ou 3x no Pix</div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="mt-20 flex justify-center">
          <a
            href="#vitrine"
            className="group flex flex-col items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--navy)]/45 transition hover:text-[var(--petrol)]"
          >
            Conheça a peça
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
