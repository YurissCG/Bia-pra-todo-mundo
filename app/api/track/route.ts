import { NextResponse } from "next/server";
import { sendEventToCapi, type CapiEventName } from "@/lib/meta";
import { readRequestSignals } from "@/lib/request-signals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  eventName?: string;
  eventId?: string;
  eventSourceUrl?: string;
  fbc?: string;
  fbp?: string;
};

const PERMITIDOS: CapiEventName[] = ["ViewContent"];

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

// throttle best-effort por IP (só vale dentro de uma instância quente)
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 20;
}

/**
 * Beacon do navegador pra CAPI. Hoje só serve o `ViewContent` — o `Contact`
 * passa pela rota /entrar, que é server-side e não depende de JS.
 */
export async function POST(req: Request) {
  const signals = await readRequestSignals();

  if (signals.clientIp && rateLimited(signals.clientIp)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const eventName = str(body.eventName) as CapiEventName | null;
  if (!eventName || !PERMITIDOS.includes(eventName)) {
    return NextResponse.json({ ok: false, error: "evento não permitido" }, { status: 400 });
  }

  const result = await sendEventToCapi(eventName, {
    eventId: str(body.eventId) || crypto.randomUUID(),
    eventTimeSeconds: Math.floor(Date.now() / 1000),
    eventSourceUrl: str(body.eventSourceUrl) || undefined,
    fbc: str(body.fbc) || signals.fbc || undefined,
    fbp: str(body.fbp) || signals.fbp || undefined,
    clientIp: signals.clientIp || undefined,
    clientUserAgent: signals.clientUserAgent || undefined,
  });

  if (!result.ok) console.error("[track] CAPI falhou:", result.error);

  // telemetria best-effort: sempre 200, nunca vira erro visível
  return NextResponse.json({ ok: true });
}
