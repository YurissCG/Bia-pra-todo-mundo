"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { fireContactPixel, newEventId } from "@/lib/track";

/**
 * Vai pro WhatsApp pela rota /entrar (que dispara o `Contact` no servidor e
 * redireciona).
 *
 * Duas decisões que vieram do primeiro dia de campanha:
 *  - SEM `target="_blank"`: o navegador embutido do Instagram/Facebook trata
 *    aba nova de forma instável — às vezes abre em branco, às vezes ignora.
 *    Mesma aba é o padrão confiável pra click-to-WhatsApp.
 *  - O `eid` entra no href depois da hidratação. Se o JS não rodar, o link
 *    continua funcionando e o servidor gera o próprio id — nunca se perde
 *    um clique por causa de JS.
 */
export function CtaButton({
  children,
  source,
  className = "",
}: {
  children: React.ReactNode;
  source: string;
  className?: string;
}) {
  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    setEventId(newEventId());
  }, []);

  const href = eventId
    ? `/entrar?src=${encodeURIComponent(source)}&eid=${encodeURIComponent(eventId)}`
    : `/entrar?src=${encodeURIComponent(source)}`;

  return (
    <a
      href={href}
      onClick={() => {
        if (eventId) fireContactPixel(eventId, source);
      }}
      className={`flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-2xl bg-wa px-6 py-4 text-lg font-bold text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform duration-150 ease-brand hover:brightness-105 active:scale-[0.98] ${className}`}
    >
      <WhatsAppIcon className="h-6 w-6 shrink-0" />
      <span>{children}</span>
    </a>
  );
}
