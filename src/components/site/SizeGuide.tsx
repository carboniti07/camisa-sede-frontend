import { useState } from "react";
import { tamanhos } from "@/lib/site-config";

export function SizeGuide() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--petrol)] hover:underline">
        Guia de tamanhos
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--navy)]/50 p-4 backdrop-blur" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-[var(--navy)]/10 bg-white p-6 shadow-elevated" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl font-semibold tracking-tight text-[var(--navy)]">Guia de tamanhos</h3>
            <p className="mt-1 text-sm text-muted-foreground">Tabela temporária — será substituída pela tabela oficial.</p>
            <div className="mt-5 overflow-hidden rounded-xl border border-[var(--navy)]/10">
              <table className="w-full text-sm">
                <thead className="bg-[var(--mist)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--petrol)]">
                  <tr><th className="p-3 text-left">Tamanho</th><th className="p-3 text-left">Largura (cm)</th><th className="p-3 text-left">Comprimento (cm)</th></tr>
                </thead>
                <tbody>
                  {tamanhos.map((t, i) => (
                    <tr key={t} className="border-t border-[var(--navy)]/8">
                      <td className="p-3 font-display font-semibold text-[var(--navy)]">{t}</td>
                      <td className="p-3 text-muted-foreground">{46 + i * 3}</td>
                      <td className="p-3 text-muted-foreground">{64 + i * 2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setOpen(false)} className="mt-5 w-full rounded-full border border-[var(--navy)]/12 bg-white py-2.5 text-sm font-medium text-[var(--navy)] hover:bg-[var(--mist)]">Fechar</button>
          </div>
        </div>
      )}
    </>
  );
}
