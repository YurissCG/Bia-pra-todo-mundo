import { TopBar } from "@/components/TopBar";
import { Hero } from "@/components/Hero";
import { ConversationMock } from "@/components/ConversationMock";
import { HowItWorks } from "@/components/HowItWorks";
import { SocialProof } from "@/components/SocialProof";
import { Footer } from "@/components/Footer";
import { CtaButton } from "@/components/CtaButton";
import { StickyCta } from "@/components/StickyCta";
import { LeadForm } from "@/components/LeadForm";
import { Reveal } from "@/components/Reveal";

export default function Page() {
  return (
    <>
      <TopBar />

      <main>
        <Hero />

        <ConversationMock />

        {/* CTA 2 */}
        <section className="bg-coral px-5 py-12">
          <div className="mx-auto w-full max-w-lg text-center">
            <Reveal>
              <h2 className="text-[1.6rem] leading-[1.08] text-ameixa min-[400px]:text-[2rem] sm:text-4xl">
                é de graça e é de mulher pra mulher
              </h2>
            </Reveal>
            <Reveal delay={70}>
              <p className="mx-auto mt-3 max-w-sm text-ameixa/80">
                se você entrar, entra e traz uma amiga. o grupo não tem limite de
                vagas — quanto mais gente de olho, melhor pra todo mundo.
              </p>
            </Reveal>
            <Reveal delay={140} className="mx-auto mt-6 max-w-sm">
              <CtaButton source="cta2">entrar no grupo</CtaButton>
            </Reveal>
          </div>
        </section>

        <HowItWorks />

        {/* Prova social — oculta até existir print real (ver SocialProof.tsx) */}
        <SocialProof />

        {/* CTA 3 */}
        <section className="bg-framboesa px-5 py-16">
          <div className="mx-auto w-full max-w-lg text-center">
            <Reveal>
              <h2 className="text-[1.8rem] leading-[1.06] text-white min-[400px]:text-[2.2rem] sm:text-5xl">
                pronto pra parar de pagar preço cheio?
              </h2>
            </Reveal>
            <Reveal delay={70}>
              <p className="mt-3 text-white/85">
                enquanto tem gente pagando 142 nessa bolsa, quem tava no grupo
                pagou 76. entra agora — é de graça.
              </p>
            </Reveal>
            <Reveal delay={140} className="mx-auto mt-6 max-w-sm">
              <CtaButton source="cta3">quero entrar no grupo</CtaButton>
              <p className="mt-2 text-center text-xs text-white/75">
                grátis · sem spam · o link do grupo abre na hora
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />

      <StickyCta />
      <LeadForm />
    </>
  );
}
