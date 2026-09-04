import Image from "next/image";
import { CtaButton } from "./CtaButton";
import { PriceFlip } from "./PriceFlip";

/**
 * Herói: pintado na hora, sem reveal. LCP aqui é dinheiro — nada de esconder
 * o título nem a imagem atrás de animação. O motion entra da dobra pra baixo.
 */
export function Hero() {
  return (
    <section className="mx-auto w-full max-w-lg px-5 pt-8 pb-4">
      <h1 className="text-[1.7rem] leading-[1.05] text-ameixa min-[400px]:text-[2rem] sm:text-5xl">
        um grupo de mulher avisando mulher{" "}
        <span className="text-framboesa">antes do preço subir</span>
      </h1>

      <p className="mt-4 text-lg text-ameixa/80">
        moda e acessório garimpados um por um. você entra de graça e recebe o
        achado do dia no whatsapp.
      </p>

      <div className="mt-5">
        <PriceFlip />
      </div>

      <div className="mt-5">
        <CtaButton source="hero">quero entrar no grupo</CtaButton>
        <p className="mt-2 text-center text-xs text-ameixa/55">
          é grátis. o link abre direto no seu whatsapp.
        </p>
      </div>

      <div className="relative mt-8">
        <div
          aria-hidden="true"
          className="absolute -inset-3 -z-10 rounded-[2rem] bg-framboesa/10"
        />
        <Image
          src="/bia-hero.jpg"
          alt="Bia Serra abraçando bolsas coloridas — coral, amarela e vermelha — e um óculos de sol"
          width={1045}
          height={1400}
          priority
          fetchPriority="high"
          sizes="(max-width: 512px) 92vw, 480px"
          className="h-auto w-full rounded-[1.75rem] object-cover"
        />
      </div>
    </section>
  );
}
