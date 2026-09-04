import type { Metadata } from "next";
import Link from "next/link";
import { MARCA } from "@/lib/config";

export const metadata: Metadata = {
  title: "Política de Privacidade — Achados da Bia",
  description:
    "O que esta página coleta, para quê, com quem compartilha e como você entra em contato.",
};

const ATUALIZADO_EM = "4 de setembro de 2026";

function Contato() {
  if (MARCA.email) {
    return (
      <a href={`mailto:${MARCA.email}`} className="text-framboesa underline">
        {MARCA.email}
      </a>
    );
  }
  return <span>o próprio grupo do WhatsApp</span>;
}

export default function PrivacidadePage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-12">
      <Link href="/" className="text-sm font-semibold text-framboesa underline">
        ← voltar
      </Link>

      <h1 className="mt-4 text-3xl text-ameixa sm:text-4xl">
        política de privacidade
      </h1>
      <p className="mt-2 text-sm text-ameixa/55">
        Última atualização: {ATUALIZADO_EM}
      </p>

      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-ameixa/85">
        <section>
          <h2 className="mb-2 text-xl text-ameixa">1. quem é o responsável</h2>
          <p>
            Esta página é operada pelo responsável pela operação{" "}
            <strong>{MARCA.responsavel}</strong>. Para qualquer assunto
            relacionado a esta política, fale com a gente por <Contato />.
          </p>
          <p className="mt-2">
            A &ldquo;Bia Serra&rdquo; é uma personagem criada com inteligência
            artificial. O tratamento descrito aqui é feito por uma pessoa real
            responsável pela operação.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl text-ameixa">2. o que esta página coleta</h2>
          <p>
            Esta página <strong>não tem formulário</strong> — o botão leva direto
            pra uma conversa no WhatsApp, fora do nosso site. A gente não pede
            nem grava seu nome ou telefone aqui.
          </p>
          <p className="mt-2">O que é coletado automaticamente ao visitar:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              <strong>Endereço IP</strong> e <strong>identificador do navegador</strong>{" "}
              (user-agent).
            </li>
            <li>
              <strong>Cookies de publicidade do Meta</strong> (<code>_fbc</code> e{" "}
              <code>_fbp</code>) e o parâmetro <code>fbclid</code> da URL, quando você
              chega por um anúncio.
            </li>
            <li>Endereço da página visitada e horário do acesso.</li>
          </ul>
          <p className="mt-2">
            Se você entra no grupo do WhatsApp pelo botão, o seu número fica
            visível pra Bia e pros outros membros dentro do próprio WhatsApp — isso
            é regido pelos termos e pela política de privacidade do WhatsApp, não
            por esta página.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl text-ameixa">3. para que a gente usa</h2>
          <p>
            Só pra medir e otimizar os anúncios que trouxeram você até aqui — saber
            que alguém clicou no botão do WhatsApp, sem saber quem. Isso é feito
            enviando ao Meta um evento de clique (&ldquo;Contact&rdquo;), pelo
            Pixel e pela Conversions API.
          </p>
          <p className="mt-2">
            <strong>Base legal (LGPD):</strong> legítimo interesse em medir e
            melhorar os anúncios (art. 7º, IX). Como não há dado que identifique
            você diretamente, o tratamento é limitado ao mínimo necessário pra essa
            medição.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl text-ameixa">
            4. com quem a gente compartilha
          </h2>
          <p>
            <strong>Meta Platforms, Inc.</strong> (Facebook/Instagram): recebe o
            evento de clique, IP, user-agent e os cookies <code>_fbc</code>/
            <code>_fbp</code>, só pra medição de anúncio — nada disso identifica
            você pelo nome. A gente não vende dado nenhum. O Meta pode processar
            essas informações fora do Brasil, com as salvaguardas previstas na
            LGPD.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl text-ameixa">5. cookies</h2>
          <p>
            O Pixel do Meta grava os cookies <code>_fbc</code> e <code>_fbp</code>{" "}
            no seu navegador pra atribuição de anúncio. Você pode bloquear ou
            apagar cookies nas configurações do navegador; isso não impede o acesso
            à página nem a entrada no grupo.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl text-ameixa">6. seus direitos</h2>
          <p>
            Mesmo sem cadastro nesta página, você pode pedir informações sobre o
            que foi coletado no seu acesso, ou pedir a remoção de dados vinculados
            a você (por exemplo, se identificar seu IP num log). É só entrar em
            contato por <Contato />. Dúvidas sobre o que é feito com o seu número
            depois que você entra no grupo — isso é conversa direta com a Bia, pelo
            próprio WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl text-ameixa">7. links de afiliado</h2>
          <p>
            As ofertas divulgadas no grupo usam links de afiliado. Se você compra
            por um desses links, podemos receber uma comissão da loja, sem custo
            adicional para você.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl text-ameixa">8. mudanças nesta política</h2>
          <p>
            Se algo mudar — por exemplo, se voltarmos a ter formulário de cadastro
            — a gente atualiza esta página e a data no topo.
          </p>
        </section>
      </div>

      <Link
        href="/"
        className="mt-10 inline-block text-sm font-semibold text-framboesa underline"
      >
        ← voltar para a página
      </Link>
    </main>
  );
}
