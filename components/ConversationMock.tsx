import Image from "next/image";
import { Reveal } from "./Reveal";

function BiaBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-end gap-2">
      <Image
        src="/bia-avatar.jpg"
        alt=""
        width={384}
        height={384}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
      <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-[15px] leading-snug text-ameixa shadow-sm">
        {children}
      </div>
    </div>
  );
}

function MemberBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[70%] rounded-2xl rounded-br-md bg-wa/15 px-3.5 py-2.5 text-[15px] leading-snug text-ameixa">
        {children}
      </div>
    </div>
  );
}

export function ConversationMock() {
  return (
    <section className="mx-auto w-full max-w-lg px-5 py-12">
      <Reveal>
        <h2 className="text-[1.65rem] leading-[1.08] text-ameixa min-[400px]:text-[2rem] sm:text-4xl">
          enquanto você paga preço cheio,{" "}
          <span className="text-framboesa">o grupo já foi avisado</span>
        </h2>
      </Reveal>
      <Reveal delay={80}>
        <p className="mt-3 text-lg text-ameixa/80">
          alguém tem que ficar de olho no preço todo dia. essa alguém é a Bia.
        </p>
      </Reveal>

      <Reveal delay={120} className="mt-6">
        <div className="rounded-[1.5rem] bg-creme p-4">
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-wide text-ameixa/45">
            assim funciona o grupo — exemplo ilustrativo
          </p>
          <div className="space-y-2.5">
            <BiaBubble>
              achei essa bolsa por <strong>R$ 76</strong>. nota 4.8, 3 mil
              vendas. a mesma tá <strong>142</strong> na vitrine 👜
            </BiaBubble>
            <BiaBubble>
              olha a foto do comentário, não a do anúncio — o couro é mais fosco
              que parece
            </BiaBubble>
            <MemberBubble>peguei 🙌</MemberBubble>
            <BiaBubble>
              esse cinto aqui eu <strong>reprovei</strong>: verniz que descola.
              deixa passar.
            </BiaBubble>
          </div>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <p className="mt-4 text-sm text-ameixa/60">
          ninguém aqui tá te vendendo nada. a gente só divide o que acha.
        </p>
      </Reveal>
    </section>
  );
}
