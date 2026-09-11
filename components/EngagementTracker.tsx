"use client";

import { useEffect } from "react";
import { fireViewContent } from "@/lib/track";

/**
 * Dispara `ViewContent` quando o visitante de fato engaja — 5 segundos na
 * página OU 25% de rolagem, o que vier primeiro.
 *
 * Por que existe: entre "carregou a página" e "clicou no botão" não havia
 * nenhum sinal. Sem evento intermediário, o Meta não tem como aprender quem
 * vale a pena impactar enquanto o volume de `Contact` é baixo demais pra
 * otimizar (precisa de ~50/semana). `ViewContent` tem volume de sobra.
 */
export function EngagementTracker() {
  useEffect(() => {
    let fired = false;
    let timer = 0;

    const onScroll = () => {
      const doc = document.documentElement;
      const visto = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (visto >= 0.25) fire();
    };

    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    }

    function fire() {
      if (fired) return;
      fired = true;
      cleanup();
      fireViewContent();
    }

    timer = window.setTimeout(fire, 5000);
    window.addEventListener("scroll", onScroll, { passive: true });

    return cleanup;
  }, []);

  return null;
}
