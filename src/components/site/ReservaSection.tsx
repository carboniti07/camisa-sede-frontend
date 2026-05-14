import { useMemo, useState } from "react";
import {
  siteConfig,
  tamanhos,
  formatBRL,
  maskCPF,
  cpfMasked,
  type Tamanho,
} from "@/lib/site-config";
import {
  buscarJovemPorCpf,
  ConsultaCpfError,
  type JovemUmadrur as JovemCadastro,
} from "@/services/umadrurApi";
import { criarReservaCamisa, type Reserva } from "@/services/reservasApi";
import { SizeGuide } from "./SizeGuide";
import camisaFrente from "@/assets/camisa/360/frame-01.png";
import {
  Check,
  Loader2,
  Search,
  ArrowRight,
  Copy,
  MessageCircle,
  AlertTriangle,
  Minus,
  Plus,
} from "lucide-react";

type Step = "produto" | "cpf" | "confirmar" | "sucesso";
type Pgto = "pix-vista" | "pix-parcelado";
type ErroTipo = "cadastro" | "reserva-existente" | "conexao" | null;

const LIMITE_CAMISAS_POR_CPF = 20;
const CADASTRO_UMADRUR_URL = "https://cadastroumadrur.adbrr.com.br";

export function ReservaSection() {
  const [step, setStep] = useState<Step>("produto");
  const [tamanho, setTamanho] = useState<Tamanho>("M");
  const [qtd, setQtd] = useState(1);
  const [pgto, setPgto] = useState<Pgto>("pix-vista");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [erroTipo, setErroTipo] = useState<ErroTipo>(null);
  const [jovem, setJovem] = useState<JovemCadastro | null>(null);
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [copied, setCopied] = useState(false);
  const [lgpd, setLgpd] = useState(false);

  const total = useMemo(() => qtd * siteConfig.valorCamisa, [qtd]);
  const parcela = useMemo(() => total / 3, [total]);

  function limparErro() {
    setErro(null);
    setErroTipo(null);
  }

  function aumentarQtd() {
    setQtd((atual) => Math.min(LIMITE_CAMISAS_POR_CPF, atual + 1));
  }

  function diminuirQtd() {
    setQtd((atual) => Math.max(1, atual - 1));
  }

  async function handleBuscar() {
    limparErro();

    const cpfLimpo = cpf.replace(/\D/g, "");

    if (cpfLimpo.length !== 11) {
      setErro("Informe um CPF válido com 11 números.");
      setErroTipo(null);
      return;
    }

    setLoading(true);

    try {
      const j = await buscarJovemPorCpf(cpfLimpo);

      if (!j) {
        setJovem(null);
        setErro(
          "Não localizamos esse CPF no cadastro da UMADRUR. Faça seu cadastro antes de continuar."
        );
        setErroTipo("cadastro");
        return;
      }

      setJovem(j);
      limparErro();
    } catch (err) {
      if (err instanceof ConsultaCpfError) {
        setErro(err.message);

        if (err.code === "CPF_NAO_ENCONTRADO") {
          setErroTipo("cadastro");
        } else if (err.code === "RESERVA_EXISTENTE") {
          setErroTipo("reserva-existente");
        } else {
          setErroTipo(null);
        }

        return;
      }

      setErro(
        "Não foi possível conectar ao servidor da reserva. Verifique se o backend está ativo e se a URL da API está configurada corretamente."
      );
      setErroTipo("conexao");
    } finally {
      setLoading(false);
    }
  }

  async function handleFinalizar() {
    if (!jovem || !lgpd) return;

    limparErro();
    setLoading(true);

    try {
      const r = await criarReservaCamisa({
        nome: jovem.nome,
        cpf: jovem.cpf,
        congregacao: siteConfig.congregacaoFixa,
        telefone: jovem.telefone,
        sexo: jovem.sexo,
        tamanho,
        quantidade: qtd,
        formaPagamento: pgto,
        valorTotal: total,
        valorParcela: pgto === "pix-parcelado" ? parcela : undefined,
      });

      setReserva(r);
      setStep("sucesso");
    } catch (err) {
      const message =
        (err as Error).message || "Não foi possível finalizar a reserva.";

      setErro(message);

      if (message.toLowerCase().includes("já existe uma reserva")) {
        setErroTipo("reserva-existente");
      } else {
        setErroTipo(null);
      }
    } finally {
      setLoading(false);
    }
  }

  function copyPix() {
    navigator.clipboard.writeText(siteConfig.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function resetarFluxo() {
    setStep("produto");
    setTamanho("M");
    setQtd(1);
    setPgto("pix-vista");
    setCpf("");
    setJovem(null);
    setReserva(null);
    setErro(null);
    setErroTipo(null);
    setLgpd(false);
    setCopied(false);
  }

  const waMsg = (forma: Pgto) => {
    const r = reserva!;

    const base = `Olá, paz do Senhor!
Acabei de fazer a reserva da camisa oficial do Congresso da Sede AD Brás Rudge Ramos.

Nome: ${r.nome}
Congregação: ${siteConfig.congregacaoFixa}
Telefone: ${r.telefone}
Tamanho: ${r.tamanho}
Quantidade: ${r.quantidade}
Valor total: ${formatBRL(r.valorTotal)}
Forma de pagamento: ${forma === "pix-vista" ? "Pix à vista" : "Pix parcelado"}
Pix: ${siteConfig.pixKey} (${siteConfig.pixReceiverName})

`;

    const tail =
      forma === "pix-vista"
        ? "Estou enviando o comprovante para confirmação da minha reserva."
        : `Gostaria de combinar o pagamento parcelado da minha reserva.\n\nDatas informadas:\n${siteConfig.datasParcelasPix.join("\n")}`;

    return encodeURIComponent(base + tail);
  };

  const cpfErrorWhatsAppMessage =
    erroTipo === "reserva-existente"
      ? "Olá, paz do Senhor!\nJá existe uma reserva ativa no meu CPF para a camisa oficial do Congresso da Sede AD Brás Rudge Ramos. Gostaria de falar com a Secretaria para verificar ou alterar minha reserva."
      : erroTipo === "cadastro"
        ? "Olá, paz do Senhor!\nEstou tentando reservar a camisa oficial do Congresso da Sede AD Brás Rudge Ramos, mas meu CPF não foi localizado no cadastro da UMADRUR. Poderia me ajudar?"
        : "Olá, paz do Senhor!\nEstou tentando reservar a camisa oficial do Congresso da Sede AD Brás Rudge Ramos, mas tive dificuldade no sistema. Poderia me ajudar?";

  const stepIndex = ["produto", "cpf", "confirmar", "sucesso"].indexOf(step);

  return (
    <section id="reserva" className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 max-w-2xl">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--petrol)]">
          Reserva
        </span>

        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-[var(--navy)] sm:text-5xl">
          Garanta a sua camisa
        </h2>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Escolha o tamanho, a quantidade e a forma de pagamento. Depois informe seu CPF para localizar seu cadastro.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative">
          <div className="sticky top-24">
            <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-visible">
              <div
                className="pointer-events-none absolute inset-[12%] z-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(0, 142, 180, 0.18) 0%, rgba(0, 142, 180, 0.08) 38%, transparent 68%)",
                  filter: "blur(28px)",
                }}
              />

              <img
                src={camisaFrente}
                alt="Camisa oficial do Congresso da Sede"
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

            <div className="mx-auto mt-8 max-w-xs text-center">
              <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Camisa Oficial · Edição 2026
              </div>

              <div className="mt-1 font-display text-lg font-semibold text-[var(--navy)]">
                Profundidade · {formatBRL(siteConfig.valorCamisa)}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--navy)]/8 bg-white p-6 shadow-soft sm:p-9">
          <div className="mb-9 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em]">
            {["Camisa", "CPF", "Confirmar", "Pagamento"].map((label, i) => {
              const active = i === stepIndex;
              const done = stepIndex > i;

              return (
                <div key={label} className="flex flex-1 items-center gap-2">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] transition ${
                      active
                        ? "bg-[var(--navy)] text-white"
                        : done
                          ? "bg-[var(--ocean)]/15 text-[var(--petrol)]"
                          : "bg-[var(--navy)]/8 text-[var(--navy)]/50"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>

                  <span
                    className={`hidden sm:inline ${
                      active ? "text-[var(--navy)]" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>

                  {i < 3 && (
                    <span
                      className={`mx-1 h-px flex-1 ${
                        done ? "bg-[var(--ocean)]/40" : "bg-[var(--navy)]/10"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {step === "produto" && (
            <div className="space-y-8 animate-rise">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--navy)]">
                    Tamanho
                  </label>

                  <SizeGuide />
                </div>

                <div className="flex flex-wrap gap-2">
                  {tamanhos.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTamanho(t)}
                      className={`min-w-[54px] rounded-xl border px-4 py-2.5 text-sm font-semibold tracking-wide transition ${
                        tamanho === t
                          ? "border-[var(--navy)] bg-[var(--navy)] text-white shadow-soft"
                          : "border-[var(--navy)]/15 bg-white text-[var(--navy)] hover:border-[var(--petrol)]/50 hover:bg-[var(--mist)]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--navy)]">
                  Quantidade
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center rounded-xl border border-[var(--navy)]/15 bg-[var(--mist)] p-1">
                    <button
                      type="button"
                      onClick={diminuirQtd}
                      disabled={qtd <= 1}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[var(--navy)] shadow-sm transition hover:bg-[var(--mist)] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <div className="flex h-9 min-w-[58px] items-center justify-center px-4 font-display text-xl font-semibold text-[var(--navy)]">
                      {qtd}
                    </div>

                    <button
                      type="button"
                      onClick={aumentarQtd}
                      disabled={qtd >= LIMITE_CAMISAS_POR_CPF}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[var(--navy)] shadow-sm transition hover:bg-[var(--mist)] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    Limite de {LIMITE_CAMISAS_POR_CPF} camisas por CPF
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--navy)]">
                  Forma de pagamento
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  {([
                    [
                      "pix-vista",
                      "Pix à vista",
                      `${formatBRL(total)} em uma transferência`,
                    ],
                    [
                      "pix-parcelado",
                      "Pix parcelado",
                      `3x de ${formatBRL(parcela)}`,
                    ],
                  ] as const).map(([val, title, sub]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setPgto(val)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        pgto === val
                          ? "border-[var(--navy)] bg-[var(--mist)] shadow-soft"
                          : "border-[var(--navy)]/12 bg-white hover:border-[var(--petrol)]/40"
                      }`}
                    >
                      <div className="font-display text-base font-semibold text-[var(--navy)]">
                        {title}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {pgto === "pix-parcelado" && (
                <div className="rounded-2xl border border-[var(--ocean)]/20 bg-[var(--ocean)]/5 p-4">
                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--petrol)]">
                    Datas das parcelas
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    {siteConfig.datasParcelasPix.map((d, i) => (
                      <div key={d} className="rounded-xl bg-white p-3 shadow-soft">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {i + 1}ª parcela
                        </div>
                        <div className="font-display text-lg font-semibold text-[var(--navy)]">
                          {d}
                        </div>
                        <div className="text-xs font-medium text-[var(--petrol)]">
                          {formatBRL(parcela)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-end justify-between gap-4 border-t border-[var(--navy)]/10 pt-6">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Total
                  </div>
                  <div className="font-display text-3xl font-semibold text-[var(--navy)]">
                    {formatBRL(total)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    limparErro();
                    setStep("cpf");
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-[var(--petrol)]"
                >
                  Continuar reserva <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === "cpf" && (
            <div className="space-y-6 animate-rise">
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-[var(--navy)]">
                  Informe seu CPF
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Localizamos seu cadastro UMADRUR para preencher seus dados automaticamente.
                </p>
              </div>

              {!jovem && (
                <>
                  <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--navy)]">
                      CPF
                    </label>

                    <div className="flex flex-wrap gap-2">
                      <input
                        value={cpf}
                        onChange={(e) => {
                          setCpf(maskCPF(e.target.value));
                          limparErro();
                        }}
                        placeholder="000.000.000-00"
                        inputMode="numeric"
                        className="min-w-0 flex-1 rounded-xl border border-[var(--navy)]/15 bg-white px-4 py-3 font-display text-lg tracking-wider text-[var(--navy)] outline-none transition focus:border-[var(--petrol)] focus:ring-4 focus:ring-[var(--ocean)]/15"
                      />

                      <button
                        type="button"
                        onClick={handleBuscar}
                        disabled={loading || cpf.replace(/\D/g, "").length !== 11}
                        className="inline-flex items-center gap-2 rounded-xl bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-[var(--petrol)] disabled:opacity-40"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                        Buscar
                      </button>
                    </div>
                  </div>

                  {erro && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-5 w-5 text-red-500" />
                        <div className="flex-1 text-sm text-red-900">
                          {erro}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            limparErro();
                            setCpf("");
                          }}
                          className="rounded-lg border border-[var(--navy)]/15 bg-white px-4 py-2 text-xs font-medium text-[var(--navy)] hover:bg-[var(--mist)]"
                        >
                          Tentar novamente
                        </button>

                        {erroTipo === "cadastro" && (
                          <a
                            href={CADASTRO_UMADRUR_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-[var(--navy)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--petrol)]"
                          >
                            Fazer cadastro na UMADRUR
                          </a>
                        )}

                        <a
                          href={`https://wa.me/${siteConfig.whatsappSecretaria}?text=${encodeURIComponent(
                            cpfErrorWhatsAppMessage
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg bg-[var(--petrol)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--navy)]"
                        >
                          Falar com a Secretaria
                        </a>
                      </div>
                    </div>
                  )}
                </>
              )}

              {jovem && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-[var(--ocean)]/25 bg-[var(--ocean)]/5 p-5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--petrol)]">
                      Encontramos seu cadastro
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Confira seus dados antes de finalizar sua reserva.
                    </p>

                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <Field label="Nome" value={jovem.nome} />
                      <Field label="Congregação" value={jovem.congregacao} />
                      <Field label="Telefone" value={jovem.telefone} />
                      {jovem.sexo && <Field label="Sexo" value={jovem.sexo} />}
                      <Field label="CPF" value={cpfMasked(jovem.cpf)} />
                    </dl>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setJovem(null);
                        limparErro();
                        setCpf("");
                      }}
                      className="rounded-full border border-[var(--navy)]/15 bg-white px-5 py-2.5 text-sm font-medium text-[var(--navy)] hover:bg-[var(--mist)]"
                    >
                      Outro CPF
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep("confirmar")}
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--petrol)]"
                    >
                      Confirmar dados <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "confirmar" && jovem && (
            <div className="space-y-6 animate-rise">
              <h3 className="font-display text-2xl font-semibold tracking-tight text-[var(--navy)]">
                Confira sua reserva
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <Card>
                  <Field label="Nome" value={jovem.nome} />
                </Card>
                <Card>
                  <Field label="Congregação" value={siteConfig.congregacaoFixa} />
                </Card>
                <Card>
                  <Field label="Telefone" value={jovem.telefone} />
                </Card>
                <Card>
                  <Field label="CPF" value={cpfMasked(jovem.cpf)} />
                </Card>
                <Card>
                  <Field label="Tamanho" value={tamanho} />
                </Card>
                <Card>
                  <Field label="Quantidade" value={String(qtd)} />
                </Card>
                <Card>
                  <Field
                    label="Pagamento"
                    value={pgto === "pix-vista" ? "Pix à vista" : "Pix parcelado"}
                  />
                </Card>
                <Card>
                  <Field
                    label="Valor unitário"
                    value={formatBRL(siteConfig.valorCamisa)}
                  />
                </Card>
              </div>

              <div className="rounded-2xl border border-[var(--ocean)]/25 bg-gradient-to-br from-[var(--ocean)]/8 to-[var(--cyan-glow)]/10 p-5">
                <div className="flex items-baseline justify-between">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--petrol)]">
                    Valor total
                  </div>
                  <div className="font-display text-3xl font-semibold text-[var(--navy)]">
                    {formatBRL(total)}
                  </div>
                </div>

                {pgto === "pix-parcelado" && (
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {siteConfig.datasParcelasPix.map((d, i) => (
                      <div key={d} className="rounded-xl bg-white p-3 shadow-soft">
                        <div className="text-[10px] font-semibold uppercase text-muted-foreground">
                          {i + 1}ª · {d}
                        </div>
                        <div className="font-display text-base font-semibold text-[var(--navy)]">
                          {formatBRL(parcela)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {erro && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-red-500" />
                    <div className="flex-1 text-sm text-red-900">
                      {erro}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`https://wa.me/${siteConfig.whatsappSecretaria}?text=${encodeURIComponent(
                        cpfErrorWhatsAppMessage
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-[var(--petrol)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--navy)]"
                    >
                      Falar com a Secretaria
                    </a>
                  </div>
                </div>
              )}

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--navy)]/12 bg-[var(--mist)]/60 p-4 text-left">
                <input
                  type="checkbox"
                  checked={lgpd}
                  onChange={(e) => setLgpd(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--navy)]"
                />
                <span className="text-[13px] leading-relaxed text-[var(--navy)]/85">
                  Declaro que autorizo o uso dos meus dados para identificação da reserva, controle de pagamento e organização da entrega da camisa do Congresso da Sede, conforme a LGPD.
                </span>
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    limparErro();
                    setStep("produto");
                  }}
                  className="rounded-full border border-[var(--navy)]/15 bg-white px-5 py-3 text-sm font-medium text-[var(--navy)] hover:bg-[var(--mist)]"
                >
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={handleFinalizar}
                  disabled={!lgpd || loading}
                  className="flex-1 rounded-full bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-[var(--petrol)] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                >
                  {loading ? "Finalizando..." : "Finalizar reserva"}
                </button>
              </div>
            </div>
          )}

          {step === "sucesso" && reserva && (
            <div id="pagamento" className="space-y-6 animate-rise">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ocean)]/15 text-[var(--petrol)]">
                  <Check className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-[var(--navy)]">
                    Reserva realizada
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {reserva.formaPagamento === "pix-vista"
                      ? "Conclua com o Pix e envie o comprovante."
                      : "Seu pagamento será via Pix parcelado nas datas abaixo."}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--navy)]/8 bg-[var(--mist)] p-5">
                <div className="flex items-baseline justify-between">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Valor total
                  </div>
                  <div className="font-display text-3xl font-semibold text-[var(--navy)]">
                    {formatBRL(reserva.valorTotal)}
                  </div>
                </div>

                {reserva.formaPagamento === "pix-parcelado" && (
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {siteConfig.datasParcelasPix.map((d, i) => (
                      <div key={d} className="rounded-xl bg-white p-3 shadow-soft">
                        <div className="text-[10px] font-semibold uppercase text-muted-foreground">
                          {i + 1}ª · {d}
                        </div>
                        <div className="font-display text-base font-semibold text-[var(--petrol)]">
                          {formatBRL(reserva.valorParcela!)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  Chave Pix
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-[var(--navy)]/12 bg-white p-3">
                  <code className="flex-1 break-all text-sm text-[var(--navy)]">
                    {siteConfig.pixKey}
                  </code>
                  <button
                    type="button"
                    onClick={copyPix}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--navy)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--petrol)]"
                  >
                    <Copy className="h-3 w-3" /> {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>

                <div className="text-xs text-muted-foreground">
                  Recebedor:{" "}
                  <span className="text-[var(--navy)]">
                    {siteConfig.pixReceiverName}
                  </span>
                </div>

                <p className="pt-2 text-xs leading-relaxed text-muted-foreground">
                  Faça o Pix usando a chave acima e envie o comprovante para a Secretaria pelo botão abaixo. Sua reserva será confirmada após a verificação do pagamento.
                </p>
              </div>

              <a
                href={`https://wa.me/${siteConfig.whatsappSecretaria}?text=${waMsg(
                  reserva.formaPagamento
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--navy)] px-5 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-[var(--petrol)]"
              >
                <MessageCircle className="h-4 w-4" />
                {reserva.formaPagamento === "pix-vista"
                  ? "Enviar comprovante"
                  : "Falar com a Secretaria"}
              </a>

              <button
                type="button"
                onClick={resetarFluxo}
                className="w-full rounded-full border border-[var(--navy)]/12 bg-white py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:bg-[var(--mist)]"
              >
                Fazer outra reserva
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-[var(--navy)]">
        {value}
      </dd>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--navy)]/8 bg-white p-3.5">
      {children}
    </div>
  );
}