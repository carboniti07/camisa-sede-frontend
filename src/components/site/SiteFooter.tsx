import anchor from "@/assets/brand/anchor.png";
import adLogo from "@/assets/brand/ad-bras-logo.png";
import { siteConfig } from "@/lib/site-config";

function IconInstagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
function IconLinkedIn(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3V9.5zm6.5 0h3.84v1.57h.06c.54-1 1.86-2.07 3.83-2.07 4.1 0 4.86 2.7 4.86 6.21V21h-4v-5.04c0-1.2-.02-2.74-1.67-2.74-1.67 0-1.92 1.3-1.92 2.65V21h-4V9.5z" />
    </svg>
  );
}
function IconWhatsapp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.05 4.91A9.92 9.92 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.45 1.32 4.95L2 22l5.25-1.38A9.95 9.95 0 0 0 12 22h.01C17.52 22 22 17.52 22 12c0-2.65-1.03-5.14-2.95-7.09zM12 20.13a8.13 8.13 0 0 1-4.14-1.13l-.3-.18-3.12.82.83-3.04-.19-.31A8.12 8.12 0 0 1 3.87 12 8.13 8.13 0 1 1 12 20.13zm4.46-6.06c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.42-1.34-1.66-.14-.24-.02-.36.1-.48.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.46-.4-.4-.54-.4l-.46-.02c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.64.58.24 1.02.38 1.38.5.58.18 1.1.16 1.52.1.46-.06 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-[var(--navy)] text-white">
      {/* Ornamentação mínima e realmente transparente */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--cyan-glow)]/50 to-transparent" />
        <div className="absolute -left-32 -bottom-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,oklch(0.62_0.14_230/0.18),transparent_65%)]" />
        <div className="absolute -right-24 -top-24 h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,oklch(0.78_0.13_220/0.14),transparent_65%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20">
        {/* Topo: assinatura editorial */}
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3.5">
              <img src={anchor} alt="" className="h-11 w-11 sm:h-12 sm:w-12" />
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--cyan-glow)]/85">
                  Camisa Oficial
                </div>
                <div className="font-display text-lg font-semibold tracking-tight sm:text-xl">
                  Congresso da Sede 2026
                </div>
              </div>
            </div>
            <p className="font-script mt-6 text-2xl leading-tight text-[var(--cyan-glow)] sm:text-3xl">
              {siteConfig.frase}
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/45">
              {siteConfig.versiculo} · Tema {siteConfig.tema}
            </p>
          </div>

          <div className="md:col-span-5 md:text-right">
            <div className="flex md:justify-end">
              <img
                src={adLogo}
                alt="AD Brás Rudge Ramos"
                className="h-12 w-auto opacity-90 sm:h-14"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-5 border-t border-white/10 pt-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-[11px] sm:tracking-[0.22em]">
            © {new Date().getFullYear()} AD Brás Rudge Ramos · Todos os direitos reservados
          </p>

          <div className="flex flex-col items-center gap-3 md:items-end">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-[11px]">
              Desenvolvido por{" "}
              <span className="font-semibold tracking-[0.32em] text-[var(--cyan-glow)]">Carboni</span>
            </p>
            <div className="flex gap-2">
              {[
                { Icon: IconInstagram, href: siteConfig.instagramUrl, label: "Instagram" },
                { Icon: IconLinkedIn, href: siteConfig.linkedinUrl, label: "LinkedIn" },
                { Icon: IconWhatsapp, href: siteConfig.whatsappUrl, label: "WhatsApp" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/85 transition hover:-translate-y-0.5 hover:border-[var(--cyan-glow)]/60 hover:bg-white/5 hover:text-[var(--cyan-glow)]"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
