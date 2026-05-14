import ShirtViewer from "./ShirtViewer";

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
          <div className="w-full max-w-[330px] sm:max-w-[360px] md:max-w-[520px]">
            <ShirtViewer />
          </div>
        </div>
      </div>
    </section>
  );
}