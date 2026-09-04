/**
 * Disparo do evento `Contact` quando o visitante clica pra ir pro WhatsApp.
 *
 * Não existe mais formulário nem captura de nome/telefone (decisão de
 * 4/set/2026 — ver amendment no topo do CLAUDE.md), então não tem `Lead`
 * pareado com hash de telefone/nome. O que dá pra fazer, e que o Meta
 * recomenda mesmo sem dado pessoal, é mandar o MESMO evento por dois
 * caminhos — Pixel (navegador) e Conversions API (servidor) — com o mesmo
 * `event_id`, pra sobreviver a bloqueador de anúncio e ao iOS.
 *
 * Nunca atrasa a navegação: o clique já abre o WhatsApp; isso aqui é
 * melhor esforço, com `keepalive` pra sobreviver mesmo que a aba mude.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const hit = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
  return hit ? decodeURIComponent(hit.split("=").slice(1).join("=")) : null;
}

function newEventId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function fireContactEvent(source: string) {
  if (typeof window === "undefined") return;
  const eventId = newEventId();

  try {
    window.fbq?.("track", "Contact", { content_name: source }, { eventID: eventId });
  } catch {
    /* pixel bloqueado — a chamada pra CAPI abaixo ainda cobre */
  }

  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventId,
        eventSourceUrl: window.location.href,
        fbc: readCookie("_fbc"),
        fbp: readCookie("_fbp"),
      }),
    }).catch(() => {});
  } catch {
    /* melhor esforço — nunca trava o clique */
  }
}
