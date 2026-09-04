import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { sendContactToCapi } from "@/lib/meta";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  eventId?: string;
  eventSourceUrl?: string;
  fbc?: string;
  fbp?: string;
};

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

function clientIpFrom(xff: string | null, realIp: string | null): string | null {
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return realIp?.trim() || null;
}

// throttle best-effort por IP (só vale dentro de uma instância quente)
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 20;
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > max;
}

/**
 * Beacon best-effort chamado no clique do CTA (ver lib/track.ts). Manda o
 * evento `Contact` pra Conversions API, deduplicado com o Pixel pelo mesmo
 * event_id. Não grava nada em banco — não tem dado pessoal aqui.
 */
export async function POST(req: Request) {
  const h = await headers();
  const ua = h.get("user-agent");
  const ip = clientIpFrom(h.get("x-forwarded-for"), h.get("x-real-ip"));

  if (ip && rateLimited(ip)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const cookieStore = await cookies();
  const fbc = str(body.fbc) || cookieStore.get("_fbc")?.value || null;
  const fbp = str(body.fbp) || cookieStore.get("_fbp")?.value || null;
  const eventId = str(body.eventId) || crypto.randomUUID();

  const result = await sendContactToCapi({
    eventId,
    eventTimeSeconds: Math.floor(Date.now() / 1000),
    eventSourceUrl: str(body.eventSourceUrl) || undefined,
    fbc: fbc || undefined,
    fbp: fbp || undefined,
    clientIp: ip || undefined,
    clientUserAgent: ua || undefined,
  });

  if (!result.ok) console.error("[track] CAPI falhou:", result.error);

  // telemetria best-effort: sempre 200, isso nunca deve virar erro visível
  return NextResponse.json({ ok: true });
}
