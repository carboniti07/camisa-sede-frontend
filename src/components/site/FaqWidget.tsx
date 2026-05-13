import { useState } from "react";
import { LifeBuoy, X, ChevronDown, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

type Faq = { q: string; a: string };
type Group = { title: string; items: Faq[] };

const groups: Group[] = [
  {
    title: "Reserva e tamanhos",
    items: [
      {
        q: "Como escolher o tamanho ideal?",
        a: "Use a tabela de medidas no botão “Guia de tamanhos” na seção de reserva. Meça uma camisa que você já usa e confortável e compare com as medidas indicadas (PP ao G4).",
      },
      {
        q: "Preciso estar cadastrado na UMADRUR?",
        a: "Sim. A reserva é vinculada ao seu cadastro localizado pelo CPF, garantindo que cada jovem da Sede AD Brás Rudge Ramos possa garantir a sua peça.",
      },
      {
        q: "Meu CPF não foi encontrado. O que faço?",
        a: "Verifique se digitou corretamente. Se persistir, fale com a Secretaria pelo botão abaixo — confirmamos seu cadastro e seguimos com a reserva.",
      },
      {
        q: "Política de disponibilidade",
        a: "A edição é limitada e por ordem de reserva confirmada. A reserva só é garantida após a confirmação do pagamento (à vista) ou do agendamento (parcelado).",
      },
    ],
  },
  {
    title: "Pagamento",
    items: [
      {
        q: "Quais são as formas de pagamento?",
        a: "Pix à vista (em uma única transferência) ou Pix parcelado em 3 datas combinadas previamente.",
      },
      {
        q: "Como funciona o Pix parcelado?",
        a: `Você divide o valor total em 3 parcelas iguais nas datas: ${siteConfig.datasParcelasPix.join(", ")}. Cada parcela é enviada por Pix na chave informada e o comprovante deve ser enviado à secretaria.`,
      },
      {
        q: "Qual é a chave Pix e o recebedor?",
        a: `Chave: ${siteConfig.pixKey} · Recebedor: ${siteConfig.pixReceiverName}.`,
      },
      {
        q: "Prazo para pagamento",
        a: "Pix à vista: até 48h após a reserva. Pix parcelado: respeitar as 3 datas previstas. Reservas sem confirmação podem ser liberadas para outros jovens.",
      },
    ],
  },
  {
    title: "Comprovante e suporte",
    items: [
      {
        q: "Como envio o comprovante?",
        a: "Após finalizar a reserva, clique em “Enviar comprovante” — o WhatsApp da secretaria abre automaticamente com seus dados pré-preenchidos.",
      },
      {
        q: "Com quem falar em caso de dúvida?",
        a: "Fale diretamente com a Secretaria do Congresso pelo botão abaixo. Atendimento durante a semana, em horário comercial.",
      },
    ],
  },
];

export function FaqWidget({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [expanded, setExpanded] = useState<string | null>("0-0");
  const waMsg = encodeURIComponent(
    "Olá, paz do Senhor!\nGostaria de tirar uma dúvida sobre a camisa oficial do Congresso da Sede AD Brás Rudge Ramos.",
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Central de Ajuda"
        title="Central de Ajuda"
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--navy)] to-[var(--petrol)] text-white shadow-elevated transition hover:scale-105 hover:shadow-glow sm:bottom-5 sm:right-5"
      >
        <LifeBuoy className="h-5 w-5" strokeWidth={1.9} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-end bg-[var(--navy)]/30 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl border border-[var(--navy)]/10 bg-white shadow-elevated sm:max-w-lg sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center justify-between border-b border-[var(--navy)]/8 bg-gradient-to-b from-[var(--mist)] to-white px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--navy)] to-[var(--petrol)] text-white shadow-soft">
                  <LifeBuoy className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--petrol)]">
                    Central de Ajuda
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--navy)]">
                    Como podemos te ajudar?
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="rounded-full p-2 text-muted-foreground transition hover:bg-[var(--mist)] hover:text-[var(--navy)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5">
              {groups.map((g, gi) => (
                <section key={g.title}>
                  <h4 className="mb-2.5 px-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--navy)]/55">
                    {g.title}
                  </h4>
                  <div className="overflow-hidden rounded-2xl border border-[var(--navy)]/8 bg-white">
                    {g.items.map((item, ii) => {
                      const key = `${gi}-${ii}`;
                      const isOpen = expanded === key;
                      return (
                        <div
                          key={key}
                          className={`border-t border-[var(--navy)]/8 first:border-t-0 ${
                            isOpen ? "bg-[var(--mist)]/50" : ""
                          }`}
                        >
                          <button
                            onClick={() => setExpanded(isOpen ? null : key)}
                            className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-[var(--mist)]/60"
                          >
                            <span className="text-sm font-semibold text-[var(--navy)]">{item.q}</span>
                            <ChevronDown
                              className={`mt-0.5 h-4 w-4 shrink-0 text-[var(--petrol)] transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <p className="px-4 pb-4 text-[13px] leading-relaxed text-[var(--navy)]/70">
                              {item.a}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <div className="border-t border-[var(--navy)]/8 bg-white px-5 py-4">
              <a
                href={`https://wa.me/${siteConfig.whatsappSecretaria}?text=${waMsg}`}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-[var(--petrol)]"
              >
                <MessageCircle className="h-4 w-4" />
                Falar com a Secretaria
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
