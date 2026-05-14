import ShirtViewer from "./ShirtViewer";

export default function ShirtShowcase() {
  return (
    <section
      id="peca"
      className="shirt-showcase-section relative w-full overflow-hidden bg-transparent"
    >
      <div className="shirt-showcase-grid mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 md:grid-cols-2 md:px-8 lg:py-20">
        <div className="shirt-showcase-copy">
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

          <div className="shirt-showcase-info mt-8 grid max-w-md grid-cols-3 gap-5 text-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">
                Edição
              </p>
              <p className="mt-2 font-semibold text-slate-950">Limitada</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">
                Tamanhos
              </p>
              <p className="mt-2 font-semibold text-slate-950">PP a G4</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">
                Pagamento
              </p>
              <p className="mt-2 font-semibold text-slate-950">Pix 3x</p>
            </div>
          </div>
        </div>

        <div className="shirt-showcase-viewer relative flex items-center justify-center bg-transparent">
          <div className="shirt-showcase-viewer-inner">
            <ShirtViewer />
          </div>
        </div>
      </div>
    </section>
  );
}