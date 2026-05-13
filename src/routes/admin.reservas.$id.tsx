import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  buscarReserva,
  confirmarPagamento,
  marcarPendente,
  cancelarReserva,
  anexarComprovante,
  removerComprovante,
} from "@/services/reservasApi";
import { isAuthenticated } from "@/services/authApi";
import type { Reserva, Anexo } from "@/lib/reservas";
import { siteConfig, formatBRL, cpfMasked } from "@/lib/site-config";
import anchor from "@/assets/brand/anchor.png";
import {
  ArrowLeft,
  MessageCircle,
  Copy,
  Paperclip,
  CheckCircle2,
  Clock,
  XCircle,
  Pencil,
  Save,
  X,
  FileText,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { StatusBadge } from "./admin.reservas.index";

export const Route = createFileRoute("/admin/reservas/$id")({ component: AdminReservaDetalhe });

function AdminReservaDetalhe() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isAuthenticated()) { navigate({ to: "/login" }); return; }
    buscarReserva(id).then((r) => setReserva(r ?? null));
  }, [id, navigate]);

  if (!reserva) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--mist)] p-6 text-center">
        <div>
          <p className="text-sm text-muted-foreground">Reserva não encontrada.</p>
          <Link to="/admin/reservas" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-4 py-2 text-sm text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar
          </Link>
        </div>
      </div>
    );
  }

  async function refresh() {
    const r = await buscarReserva(id);
    setReserva(r ?? null);
  }

  // Anexos (normaliza legado comprovanteUrl)
  const anexos: Anexo[] =
    reserva.comprovantes ??
    (reserva.comprovanteUrl
      ? [{
          id: "legacy",
          name: "comprovante",
          url: reserva.comprovanteUrl,
          type: reserva.comprovanteUrl.startsWith("data:application/pdf") ? "application/pdf" : "image/*",
          uploadedAt: reserva.createdAt,
        }]
      : []);
  const podeAnexar = anexos.length < 3;

  const wa = reserva.telefone.replace(/\D/g, "");
  const waNumber = wa.length === 11 ? `55${wa}` : wa;
  const mensagemPronta = `Olá ${reserva.nome.split(" ")[0]}, paz do Senhor! Falo da Secretaria do ${siteConfig.evento} sobre sua reserva da camisa oficial (Tam ${reserva.tamanho} · ${formatBRL(reserva.valorTotal)}).`;

  function copyMsg() {
    navigator.clipboard.writeText(mensagemPronta);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function onAttach(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await anexarComprovante(reserva!.id, file);
      await refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const confirmado = reserva.status === "confirmado";

  return (
    <div className="min-h-screen bg-[var(--mist)]">
      <header className="border-b border-[var(--navy)]/8 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link to="/admin/reservas" className="inline-flex items-center gap-1.5 rounded-full border border-[var(--navy)]/15 bg-white px-3 py-1.5 text-xs font-medium text-[var(--navy)] hover:border-[var(--petrol)]/40">
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <img src={anchor} alt="" className="h-7 w-7" />
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--petrol)]">Reserva</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:px-6 sm:py-10">
        {/* Cabeçalho */}
        <div className="rounded-2xl border border-[var(--navy)]/8 bg-white p-5 shadow-soft sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--petrol)]">#{reserva.id}</div>
              <h1 className="mt-1 font-display text-2xl font-semibold text-[var(--navy)] sm:text-3xl">{reserva.nome}</h1>
              <div className="mt-1 text-sm text-muted-foreground">{siteConfig.congregacaoFixa}</div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge s={reserva.status} />
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  title="Editar reserva"
                  aria-label="Editar reserva"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--navy)]/15 bg-white text-[var(--navy)] transition hover:border-[var(--petrol)]/40 hover:bg-[var(--mist)]"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(false)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--navy)]/15 bg-white px-3 py-1.5 text-xs font-medium text-[var(--navy)] hover:bg-[var(--mist)]"
                >
                  <X className="h-3.5 w-3.5" /> Sair da edição
                </button>
              )}
            </div>
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <Field label="CPF" value={cpfMasked(reserva.cpf)} />
            <Field label="Telefone" value={reserva.telefone} />
            <Field label="Tamanho" value={reserva.tamanho} />
            <Field label="Quantidade" value={String(reserva.quantidade)} />
            <Field label="Pagamento" value={reserva.formaPagamento === "pix-vista" ? "Pix à vista" : "Pix parcelado (3x)"} />
            <Field label="Total" value={formatBRL(reserva.valorTotal)} accent />
            {reserva.valorParcela && <Field label="Parcela" value={formatBRL(reserva.valorParcela)} />}
            <Field label="Criada em" value={new Date(reserva.createdAt).toLocaleString("pt-BR")} />
          </dl>
        </div>

        {/* Anexos */}
        <div className="rounded-2xl border border-[var(--navy)]/8 bg-white p-5 shadow-soft sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--petrol)]">Comprovantes</h2>
            <span className="text-xs text-muted-foreground">{anexos.length} de 3</span>
          </div>

          {anexos.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Nenhum comprovante anexado.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {anexos.map((a) => {
                const isImg = a.type?.startsWith("image/") || /^data:image\//.test(a.url);
                return (
                  <li key={a.id} className="flex items-center gap-3 rounded-xl border border-[var(--navy)]/10 bg-[var(--mist)]/40 p-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                      {isImg ? <img src={a.url} alt="" className="h-full w-full object-cover" /> : <FileText className="h-5 w-5 text-[var(--navy)]/60" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-[var(--navy)]">{a.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {new Date(a.uploadedAt).toLocaleString("pt-BR")}
                      </div>
                    </div>
                    <a href={a.url} target="_blank" rel="noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--navy)]/12 bg-white text-[var(--navy)] hover:bg-[var(--mist)]" title="Abrir">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    {editMode && a.id !== "legacy" && (
                      <button
                        onClick={async () => { await removerComprovante(reserva.id, a.id); refresh(); }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/25 bg-white text-red-600 hover:bg-red-50"
                        title="Remover"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {editMode && (
            <div className="mt-4">
              <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={onAttach} />
              <button
                disabled={!podeAnexar}
                onClick={() => fileRef.current?.click()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--navy)]/25 bg-[var(--mist)]/40 px-4 py-3 text-sm font-medium text-[var(--navy)] transition hover:border-[var(--petrol)]/50 hover:bg-[var(--mist)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <Paperclip className="h-4 w-4" />
                {podeAnexar ? "Anexar comprovante" : "Limite de 3 anexos atingido"}
              </button>
            </div>
          )}
        </div>

        {/* Ações — apenas em modo edição */}
        {editMode && (
          <div className="rounded-2xl border border-[var(--navy)]/8 bg-white p-5 shadow-soft sm:p-7">
            <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--petrol)]">Ações</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                disabled={confirmado}
                onClick={async () => { await confirmarPagamento(reserva.id); setEditMode(false); refresh(); }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" /> Confirmar pagamento
              </button>
              <button
                onClick={async () => { await marcarPendente(reserva.id); refresh(); }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--navy)]/15 bg-white px-4 py-3 text-sm font-semibold text-[var(--navy)] hover:bg-[var(--mist)]"
              >
                <Clock className="h-4 w-4" /> Marcar pendente
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--navy)]/90 sm:col-span-2"
              >
                <Save className="h-4 w-4" /> Salvar e sair da edição
              </button>
              <button
                onClick={async () => { if (confirm("Cancelar esta reserva?")) { await cancelarReserva(reserva.id); setEditMode(false); refresh(); } }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-white px-4 py-2.5 text-xs font-medium text-red-600/80 hover:bg-red-50 sm:col-span-2"
              >
                <XCircle className="h-3.5 w-3.5" /> Cancelar reserva
              </button>
            </div>
          </div>
        )}

        {/* Pix + WhatsApp (sempre visível) */}
        <div className="rounded-2xl border border-[var(--navy)]/8 bg-white p-5 shadow-soft sm:p-7">
          <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--petrol)]">Pagamento Pix</h2>
          <div className="rounded-xl border border-[var(--navy)]/8 bg-[var(--mist)]/60 p-3 text-sm">
            <div className="text-[var(--navy)]">Chave: <span className="font-medium">{siteConfig.pixKey}</span></div>
            <div className="text-[var(--navy)]">Recebedor: <span className="font-medium">{siteConfig.pixReceiverName}</span></div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(mensagemPronta)}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white hover:opacity-90">
              <MessageCircle className="h-4 w-4" /> Abrir WhatsApp
            </a>
            <button onClick={copyMsg} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--navy)]/15 bg-white px-4 py-3 text-sm font-semibold text-[var(--navy)] hover:bg-[var(--mist)]">
              <Copy className="h-4 w-4" /> {copied ? "Copiado!" : "Copiar mensagem"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-[var(--navy)]/8 bg-[var(--mist)]/50 p-3">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</dt>
      <dd className={`mt-0.5 font-medium ${accent ? "font-display text-lg text-[var(--petrol)]" : "text-sm text-[var(--navy)]"}`}>{value}</dd>
    </div>
  );
}
