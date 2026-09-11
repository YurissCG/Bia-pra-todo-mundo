/**
 * Eventos do navegador (Pixel) — a metade "browser" da redundância.
 *
 * Divisão de responsabilidade:
 *  - `Contact`: o servidor é a fonte da verdade (rota /entrar, que dispara a
 *    CAPI e redireciona). Aqui só o Pixel, com o MESMO event_id da URL, pra
 *    deduplicar. Se o JS falhar, o servidor cobre sozinho.
 *  - `ViewContent`: só existe no navegador (é sinal de engajamento), então
 *    dispara Pixel + manda pra CAPI via /api/track.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function newEventId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const hit = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
  return hit ? decodeURIComponent(hit.split("=").slice(1).join("=")) : null;
}

/** Clique no CTA: Pixel + tag no Clarity. A CAPI é feita pela rota /entrar. */
export function fireContactPixel(eventId: string, source: string) {
  if (typeof window === "undefined") return;

  try {
    window.fbq?.("track", "Contact", { content_name: source }, { eventID: eventId });
  } catch {
    /* Pixel bloqueado — a rota /entrar cobre pelo servidor */
  }

  try {
    // marca a sessão no Clarity com qual CTA converteu (hero/cta2/cta3/sticky)
    window.clarity?.("set", "cta_source", source);
    window.clarity?.("event", "cta_click");
  } catch {
    /* Clarity pode não estar carregado — não é crítico */
  }
}

/** Engajamento real na página (5s ou 25% de rolagem): Pixel + CAPI. */
export function fireViewContent() {
  if (typeof window === "undefined") return;
  const eventId = newEventId();

  try {
    window.fbq?.("track", "ViewContent", {}, { eventID: eventId });
  } catch {
    /* a chamada pra CAPI abaixo ainda cobre */
  }

  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName: "ViewContent",
        eventId,
        eventSourceUrl: window.location.href,
        fbc: readCookie("_fbc"),
        fbp: readCookie("_fbp"),
      }),
    }).catch(() => {});
  } catch {
    /* melhor esforço */
  }
}
