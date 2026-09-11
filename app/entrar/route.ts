import { NextResponse, after } from "next/server";
import { sendEventToCapi } from "@/lib/meta";
import { readRequestSignals } from "@/lib/request-signals";
import { WHATSAPP_GROUP_URL } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Porta de saída pro WhatsApp — e a única forma de o evento `Contact` ser
 * confiável.
 *
 * Por que não linkar direto pro chat.whatsapp.com: se o React não hidratar
 * (navegador embutido do Instagram/Facebook é instável), o `onClick` nunca
 * roda e o clique não é contabilizado — a pessoa entra no grupo e o Meta não
 * fica sabendo. Aqui o evento sai do servidor, então dispara mesmo sem JS,
 * com Pixel bloqueado ou com a aba fechando no meio da navegação.
 *
 * O `after()` manda a CAPI depois da resposta: o redirect sai na hora, sem
 * esperar o Meta responder.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const eventId = url.searchParams.get("eid")?.trim() || crypto.randomUUID();
  const source = url.searchParams.get("src")?.trim() || "desconhecido";

  const signals = await readRequestSignals();

  after(async () => {
    const result = await sendEventToCapi("Contact", {
      eventId,
      eventTimeSeconds: Math.floor(Date.now() / 1000),
      eventSourceUrl: url.origin + "/",
      contentName: source,
      fbc: signals.fbc || undefined,
      fbp: signals.fbp || undefined,
      clientIp: signals.clientIp || undefined,
      clientUserAgent: signals.clientUserAgent || undefined,
    });
    if (!result.ok) console.error("[entrar] CAPI falhou:", result.error);
  });

  // no-store: redirect cacheado pularia o rastreamento
  return NextResponse.redirect(WHATSAPP_GROUP_URL, {
    status: 302,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
