import { siteConfig, formatBRL } from "@/lib/site-config";
import waveFlow from "@/assets/brand/wave-flow.png";
import splash from "@/assets/brand/splash.png";
import waveLine from "@/assets/brand/wave-line.png";
import star from "@/assets/brand/star.png";
import anchor from "@/assets/brand/anchor.png";
import profundidadeArt from "@/assets/brand/profundidade.png";
import { ArrowRight, ChevronDown } from "lucide-react";

export function Hero({ onReservar }: { onReservar: () => void }) {
  function scrollToPeca(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    const peca = document.getElementById("peca");

    if (!peca) return;

    peca.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-14%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.82_0.10_220/0.18),transparent_60%)] md:h-[820px] md:w-[820px]" />

        <img
          src={splash}
          alt=""
          className="absolute -left-28 top-16 hidden w-[32%] max-w-[460px] opacity-[0.08] mix-blend-multiply sm:block"
        />

        <img
          src={waveFlow}
          alt=""
          className="absolute -right-32 top-28 hidden w-[40%] max-w-[600px] opacity-[0.09] mix-blend-multiply sm:block"
        />

        <img
          src={anchor}
          alt=""
          className="absolute right-[-10%] bottom-[8%] w-[42%] max-w-[260px] opacity-[0.045] sm:right-[-3%] sm:w-[22%] sm:max-w-[300px]"
        />

        <img
          src={waveLine}
          alt=""
          className="absolute left-[-8%] bottom-[13%] w-[58%] max-w-[320px] opacity-[0.10] mix-blend-multiply sm:left-[4%] sm:w-[26%] sm:max-w-[400px] sm:opacity-[0.14]"
        />

        <img
          src={star}
          alt=""
          className="absolute right-[12%] top-[18%] h-5 w-5 opacity-20 sm:h-7 sm:w-7 sm:opacity-25"
        />

        <img
          src={star}
          alt=""
          className="absolute left-[12%] top-[34%] hidden h-4 w-4 opacity-20 sm:block"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 md:pb-28 md:pt-24">
        <div className="flex items-center justify-center gap-2 text-[8px] font-semibold uppercase tracking-[0.22em] text-[var(--petrol)]/80 sm:gap-3 sm:text-[10px] sm:tracking-[0.4em]">
          <span className="hidden h-px w-8 bg-[var(--petrol)]/30 sm:block" />

          <span className="whitespace-nowrap">
            Edição limitada · {siteConfig.versiculo}
          </span>

          <span className="hidden h-px w-8 bg-[var(--petrol)]/30 sm:block" />
        </div>

        <div className="mt-5 text-center sm:mt-7">
          <p className="font-script text-[2rem] leading-none text-[var(--ocean)] sm:text-4xl md:text-5xl">
            Mas enchei-vos do Espírito Santo
          </p>

          <h1 className="relative mx-auto mt-5 flex max-w-[1120px] justify-center sm:mt-6">
            <span className="sr-only">Profundidade</span>

            <img
              src={profundidadeArt}
              alt="Profundidade"
              className="w-full max-w-[1080px] select-none object-contain mix-blend-multiply"
              draggable={false}
            />
          </h1>

          <div className="mx-auto mt-4 flex max-w-md items-center justify-center gap-2 sm:mt-6 sm:gap-3">
            <span className="hidden h-px w-12 bg-[var(--navy)]/20 sm:block" />

            <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[var(--navy)]/60 sm:text-[10px] sm:tracking-[0.35em]">
              Camisa Oficial · Congresso da Sede
            </span>

            <span className="hidden h-px w-12 bg-[var(--navy)]/20 sm:block" />
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl items-end gap-8 sm:mt-14 md:grid-cols-3">
          <div className="text-left md:order-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              A campanha
            </div>

            <p className="mt-3 text-[15px] leading-relaxed text-[var(--navy)]/75">
              A peça oficial da juventude da Sede AD Brás Rudge Ramos para viver o congresso com identidade. Tiragem limitada, design exclusivo.
            </p>
          </div>

          <div className="md:order-2 md:text-center">
            <button
              type="button"
              onClick={onReservar}
              className="group relative inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[var(--navy)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-elevated transition hover:bg-[var(--petrol)] hover:shadow-glow sm:w-auto sm:px-8"
            >
              <span className="absolute inset-0 rounded-full bg-[var(--cyan-glow)]/0 transition group-hover:bg-[var(--cyan-glow)]/15" />

              <span className="relative">Reservar agora</span>

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

            <div className="mt-1 font-display text-4xl font-semibold tracking-tight text-[var(--navy)] sm:text-5xl">
              {formatBRL(siteConfig.valorCamisa)}
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              À vista ou 3x no Pix
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center sm:mt-20">
          <a
            href="#peca"
            onClick={scrollToPeca}
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