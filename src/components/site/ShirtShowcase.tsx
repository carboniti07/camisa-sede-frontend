import ShirtViewer from "./ShirtViewer";
import frame01 from "@/assets/camisa/360/frame-01.png";

export default function ShirtShowcase() {
  return (
    <section
      id="peca"
      className="relative w-full overflow-hidden bg-transparent"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 md:grid-cols-2 md:px-8 lg:py-20">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-700">
            A peça
          </p>

          <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Mais que uma camisa. Uma identidade.
          </h2>

          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
            Inspirada no tema oficial do Congresso da Sede, a camisa Profundidade traduz a fé que mergulha em uma
            composição moderna, jovem e exclusiva.
          </p>

          <div className="mt-8 grid max-w-md grid-cols-3 gap-4 text-sm sm:gap-5">
            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-slate-500 sm:text-[10px] sm:tracking-[0.35em]">
                Edição
              </p>
              <p className="mt-2 font-semibold text-slate-950">Limitada</p>
            </div>

            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-slate-500 sm:text-[10px] sm:tracking-[0.35em]">
                Tamanhos
              </p>
              <p className="mt-2 font-semibold text-slate-950">PP a G4</p>
            </div>

            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:text-[10px] sm:tracking-[0.35em]">
                Pagamento
              </p>
              <p className="mt-2 font-semibold text-slate-950">Pix 3x</p>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[300px] items-center justify-center bg-transparent md:min-h-[420px]">
          {/* Mobile: imagem fixa para não estourar o layout */}
          <div className="relative mx-auto block aspect-square w-full max-w-[330px] md:hidden">
            <div
              className="pointer-events-none absolute inset-[12%] z-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(0, 142, 180, 0.18) 0%, rgba(0, 142, 180, 0.08) 38%, transparent 68%)",
                filter: "blur(28px)",
              }}
            />

            <img
              src={frame01}
              alt="Camisa oficial do Congresso da Sede"
              loading="lazy"
              decoding="async"
              draggable={false}
              className="relative z-10 h-full w-full select-none object-contain"
            />

            <div
              className="pointer-events-none absolute bottom-[8%] left-1/2 z-0 h-[18px] w-[48%] -translate-x-1/2 rounded-full"
              style={{
                background: "rgba(3, 24, 44, 0.18)",
                filter: "blur(18px)",
              }}
            />
          </div>

          {/* Desktop/tablet: mantém o 360 girando */}
          <div className="hidden w-full max-w-[520px] md:block">
            <ShirtViewer />
          </div>
        </div>
      </div>
    </section>
  );
}