import { cookies, headers } from "next/headers";

/**
 * Sinais de pareamento que dá pra ler do próprio request — os únicos que
 * existem, já que a página não coleta nome nem telefone.
 */
export type RequestSignals = {
  fbc: string | null;
  fbp: string | null;
  clientIp: string | null;
  clientUserAgent: string | null;
};

export async function readRequestSignals(): Promise<RequestSignals> {
  const h = await headers();
  const c = await cookies();
  const xff = h.get("x-forwarded-for");
  const ip =
    xff?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || null;

  return {
    fbc: c.get("_fbc")?.value || null,
    fbp: c.get("_fbp")?.value || null,
    clientIp: ip,
    clientUserAgent: h.get("user-agent"),
  };
}
