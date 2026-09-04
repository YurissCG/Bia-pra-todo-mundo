/**
 * Validação e normalização de nome e telefone brasileiro.
 * Sem dependências — roda no servidor (Route Handler) e também no cliente
 * (feedback do formulário antes do POST).
 */

// DDDs válidos no Brasil (Anatel). Fora desta lista = telefone inválido.
const DDDS_VALIDOS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export type PhoneResult =
  | { ok: true; e164Digits: string; ddd: number }
  | { ok: false; reason: string };

/**
 * Aceita qualquer formato digitado ("(31) 99999-9999", "+55 31 9 9999 9999",
 * "31999999999"). Devolve só dígitos com prefixo 55 e sem "+".
 * Regra: 10 (fixo) ou 11 (celular) dígitos após o DDD, com DDD válido.
 */
export function normalizePhone(raw: string): PhoneResult {
  let digits = (raw || "").replace(/\D/g, "");

  // remove prefixo internacional 55 se veio junto
  if (digits.length > 11 && digits.startsWith("55")) {
    digits = digits.slice(2);
  }

  if (digits.length !== 10 && digits.length !== 11) {
    return { ok: false, reason: "O WhatsApp precisa ter DDD + número (10 ou 11 dígitos)." };
  }

  const ddd = Number(digits.slice(0, 2));
  if (!DDDS_VALIDOS.has(ddd)) {
    return { ok: false, reason: "DDD inválido. Confere o começo do número." };
  }

  // celular: 11 dígitos, o 3º dígito precisa ser 9
  if (digits.length === 11 && digits[2] !== "9") {
    return { ok: false, reason: "Número de celular inválido." };
  }

  // rejeita sequências óbvias (todos os dígitos do número iguais)
  const numero = digits.slice(2);
  if (/^(\d)\1+$/.test(numero)) {
    return { ok: false, reason: "Esse número não parece real." };
  }

  return { ok: true, e164Digits: `55${digits}`, ddd };
}

export type NameResult = { ok: true; value: string } | { ok: false; reason: string };

/** Nome exibível: trim + colapsa espaços. Mínimo 2 caracteres. */
export function cleanName(raw: string): NameResult {
  const value = (raw || "").replace(/\s+/g, " ").trim();
  if (value.length < 2) {
    return { ok: false, reason: "Digita seu nome, pelo menos 2 letras." };
  }
  if (value.length > 80) {
    return { ok: false, reason: "Nome muito longo." };
  }
  if (!/[\p{L}]/u.test(value)) {
    return { ok: false, reason: "Digita um nome válido." };
  }
  return { ok: true, value };
}

/**
 * Normalização para hash do Meta: minúsculo, sem acento, sem espaço nas pontas.
 * O Meta recomenda enviar só o primeiro nome em `fn`.
 */
export function normalizeForHash(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function firstName(fullName: string): string {
  return normalizeForHash(fullName).split(" ")[0] || "";
}
