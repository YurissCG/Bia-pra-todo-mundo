/**
 * Conversions API do Meta — envio do evento `Contact` pelo servidor.
 *
 * Sem formulário, não tem telefone nem nome pra hashear — o pareamento aqui
 * é só com fbc/fbp/ip/user-agent (mais fraco que um Lead com `ph`, mas ainda
 * assim é o que sustenta a redundância Pixel+CAPI que o Meta recomenda).
 *
 * Regra de ouro do EMQ: NUNCA enviar campo vazio ou placeholder.
 * Omitir é melhor que mandar string vazia.
 */

// v26.0 é a atual em set/2026. Trocar por env quando o Meta lançar uma nova.
const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION?.trim() || "v26.0";

/** Só adiciona a chave se o valor existir de verdade. */
function put(obj: Record<string, unknown>, key: string, value: unknown) {
  if (value === undefined || value === null) return;
  if (typeof value === "string" && value.trim() === "") return;
  obj[key] = value;
}

export type CapiEventInput = {
  eventId: string;
  eventTimeSeconds: number;
  eventSourceUrl?: string;
  fbc?: string;
  fbp?: string;
  clientIp?: string;
  clientUserAgent?: string;
};

export type CapiResult =
  | { ok: true; fbtraceId?: string; eventsReceived?: number }
  | { ok: false; error: string };

export async function sendContactToCapi(input: CapiEventInput): Promise<CapiResult> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const token = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  const testCode = process.env.META_TEST_EVENT_CODE?.trim();

  if (!pixelId || !token) {
    return { ok: false, error: "NEXT_PUBLIC_META_PIXEL_ID ou META_CAPI_ACCESS_TOKEN ausente" };
  }

  const userData: Record<string, unknown> = {};
  put(userData, "fbc", input.fbc);
  put(userData, "fbp", input.fbp);
  put(userData, "client_ip_address", input.clientIp);
  put(userData, "client_user_agent", input.clientUserAgent);

  const eventData: Record<string, unknown> = {
    event_name: "Contact",
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
    return { ok: true, fbtraceId: json.fbtrace_id, eventsReceived: json.events_received };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "falha de rede na CAPI",
    };
  }
}
