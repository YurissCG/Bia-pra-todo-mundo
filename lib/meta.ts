/**
 * Conversions API do Meta — envio do evento `Lead` pelo servidor.
 *
 * Princípio (ver CLAUDE.md): o mesmo evento `Lead`, com o mesmo `event_id`,
 * sai pelo Pixel (navegador) e por aqui (servidor). O Meta deduplica.
 *
 * Regra de ouro do EMQ: NUNCA enviar campo vazio ou placeholder.
 * Omitir é melhor que mandar string vazia — campo vazio derruba o pareamento.
 */

import { createHash } from "node:crypto";
import { normalizeForHash } from "./validation";

// v26.0 é a atual em set/2026 (v23 e anteriores já saíram do ar).
// Trocar por env quando o Meta lançar uma nova.
const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION?.trim() || "v26.0";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Só adiciona a chave se o valor existir de verdade. */
function put(obj: Record<string, unknown>, key: string, value: unknown) {
  if (value === undefined || value === null) return;
  if (typeof value === "string" && value.trim() === "") return;
  obj[key] = value;
}

export type CapiLeadInput = {
  eventId: string;
  eventTimeSeconds: number;
  eventSourceUrl?: string;
  /** telefone já normalizado: dígitos com prefixo 55 */
  phoneDigits: string;
  /** primeiro nome já normalizado (minúsculo, sem acento) */
  firstNameNormalized: string;
  /** id do lead no banco — vira external_id hasheado */
  leadId: string;
  fbc?: string;
  fbp?: string;
  clientIp?: string;
  clientUserAgent?: string;
};

export type CapiResult =
  | { ok: true; fbtraceId?: string; eventsReceived?: number }
  | { ok: false; error: string };

export async function sendLeadToCapi(input: CapiLeadInput): Promise<CapiResult> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const token = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  const testCode = process.env.META_TEST_EVENT_CODE?.trim();

  if (!pixelId || !token) {
    return { ok: false, error: "META_PIXEL_ID ou META_CAPI_ACCESS_TOKEN ausente" };
  }

  const userData: Record<string, unknown> = {};
  // dados hasheados (SHA-256 hex)
  put(userData, "ph", [sha256(input.phoneDigits)]);
  if (input.firstNameNormalized) {
    put(userData, "fn", [sha256(input.firstNameNormalized)]);
  }
  put(userData, "external_id", [sha256(input.leadId)]);
  // dados crus — NÃO hashear
  put(userData, "fbc", input.fbc);
  put(userData, "fbp", input.fbp);
  put(userData, "client_ip_address", input.clientIp);
  put(userData, "client_user_agent", input.clientUserAgent);

  const eventData: Record<string, unknown> = {
    event_name: "Lead",
    event_time: input.eventTimeSeconds,
    event_id: input.eventId,
    action_source: "website",
    user_data: userData,
  };
  put(eventData, "event_source_url", input.eventSourceUrl);

  const payload: Record<string, unknown> = { data: [eventData] };
  if (testCode) payload.test_event_code = testCode;

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(
    token,
  )}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // não deixa a chamada travar o response pro usuário
      signal: AbortSignal.timeout(4000),
    });

    const json = (await res.json()) as {
      events_received?: number;
      fbtrace_id?: string;
      error?: { message?: string };
    };

    if (!res.ok || json.error) {
      return { ok: false, error: json.error?.message || `HTTP ${res.status}` };
    }
    return {
      ok: true,
      fbtraceId: json.fbtrace_id,
      eventsReceived: json.events_received,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "falha de rede na CAPI",
    };
  }
}

export { sha256, normalizeForHash };
