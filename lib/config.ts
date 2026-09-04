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

/** Dados do anunciante — exigidos pela revisão do Meta e pela LGPD. */
export const EMPRESA = {
  razaoSocial: "BIA SERRA ACHADOS",
  nomeFantasia: "Bia Serra Achados",
  cnpj: "00.000.000/0001-00", // TODO: substituir pelo CNPJ real
  endereco: "Belo Horizonte, MG", // TODO: substituir pelo endereço completo
  email: "contato@biaserra.com.br", // TODO: substituir pelo e-mail real de contato/DPO
} as const;
