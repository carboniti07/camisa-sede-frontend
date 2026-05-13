// 🔧 Informações públicas da campanha.
// Dados sensíveis ficam somente no backend.
export const siteConfig = {
  campaignId: "camisa_sede",
  campaignName: "Camisa Congresso da Sede",
  whatsappSecretaria: "5511957879934",
  pixKey: "lisy.pachecodurval@gmail.com",
  pixReceiverName: "Lisy",
  congregacaoFixa: "001 RUDGE RAMOS / SEDE",
  cadastroUmadrurUrl: "https://cadastroumadrur.adbrr.com.br",
  pixCity: "SAO BERNARDO DO CAMPO",
  valorCamisa: 60,
  maxPorReserva: 1,
  datasParcelasPix: ["20/05", "20/06", "05/07"],
  instagramUrl: "https://www.instagram.com/carboni._/",
  linkedinUrl: "https://www.linkedin.com/in/matheus-carboni-332a97304/",
  whatsappUrl: "https://wa.me/5511994551544",
  evento: "Congresso da Sede AD Brás Rudge Ramos",
  tema: "Profundidade",
  versiculo: "Efésios 5:18",
  frase: "Mas enchei-vos do Espírito Santo",
};

export const tamanhos = ["PP", "P", "M", "G", "GG", "G1", "G2", "G3", "G4"] as const;
export type Tamanho = (typeof tamanhos)[number];

export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const maskCPF = (v: string) =>
  v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

export const cpfMasked = (cpf: string) => {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.***.***-${d.slice(9)}`;
};