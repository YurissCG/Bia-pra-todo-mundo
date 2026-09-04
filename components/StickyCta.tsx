"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { WHATSAPP_GROUP_URL } from "@/lib/config";
import { fireContactEvent } from "@/lib/track";

/**
 * CTA fixo na base — só no mobile, e só depois que o usuário passa do
 * primeiro terço da página. Some no desktop (md:hidden).
 */
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrolled = window.scrollY + window.innerHeight;
        const third = document.documentElement.scrollHeight / 3;
        const nearBottom =
          window.scrollY + window.innerHeight >
          document.documentElement.scrollHeight - 220;
        setVisible(scrolled > third && !nearBottom);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <a
        href={WHATSAPP_GROUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => fireContactEvent("sticky")}
        className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-wa px-6 py-4 text-lg font-bold text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform duration-150 active:scale-[0.98] min-h-[56px]"
      >
        <WhatsAppIcon className="h-6 w-6 shrink-0" />
        <span>entrar no grupo</span>
      </a>
    </div>
  );
}
