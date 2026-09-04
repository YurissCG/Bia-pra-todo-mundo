/**
 * Configuração central da LP.
 *
 * O link do grupo não é segredo (é um convite público), então ele tem um
 * fallback fixo pra página funcionar já no primeiro deploy, antes de a variável
 * de ambiente ser cadastrada na Vercel. Tudo o mais que é sensível NÃO tem
 * fallback — se faltar, o fluxo falha de propósito, com log claro.
 */

const WHATSAPP_GROUP_FALLBACK =
  "https://chat.whatsapp.com/DaiHeRk2jSUIiL24pwbfkR?mode=gi_t";

export const WHATSAPP_GROUP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL?.trim() || WHATSAPP_GROUP_FALLBACK;

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "";

/** URL pública do site. Em produção, cadastre NEXT_PUBLIC_SITE_URL na Vercel
 *  (ou o domínio próprio). O fallback serve só pro primeiro deploy. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://achados-da-bia.vercel.app")
).replace(/\/$/, "");

/**
 * Identificação do responsável.
 *
 * CNPJ e endereço foram tirados do rodapé por enquanto (ainda não há empresa
 * aberta). ATENÇÃO: o Meta pode reprovar a campanha sem identificação do
 * anunciante, e a LGPD exige um canal de contato pra pedidos de exclusão de
 * dados. Antes de escalar os anúncios, voltar com:
 *   - CNPJ e endereço (ou nome + cidade do responsável, se pessoa física)
 *   - um e-mail de contato de verdade (cadastrar NEXT_PUBLIC_CONTACT_EMAIL)
 */
export const MARCA = {
  nome: "Achados da Bia",
  responsavel: "Bia Serra Achados",
  /** cadastre NEXT_PUBLIC_CONTACT_EMAIL na Vercel; vazio = mostra fallback */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
} as const;
