import type { Metadata } from "next";
import Link from "next/link";
import { MARCA } from "@/lib/config";

export const metadata: Metadata = {
  title: "Política de Privacidade — Achados da Bia",
  description:
    "O que a gente coleta, para quê, com quem compartilha e como você pede exclusão dos seus dados.",
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
            Esta página e o grupo de WhatsApp &ldquo;Achados da Bia&rdquo; são
            operados pelo responsável pela operação{" "}
            <strong>{MARCA.responsavel}</strong>. Para qualquer assunto
            relacionado aos seus dados, fale com a gente por <Contato />.
          </p>
          <p className="mt-2">
            A &ldquo;Bia Serra&rdquo; é uma personagem criada com inteligência
            artificial. O tratamento dos seus dados descrito aqui é feito por uma
            pessoa real responsável pela operação.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl text-ameixa">2. o que a gente coleta</h2>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Nome</strong> e <strong>número de WhatsApp</strong>, que
              você digita no formulário.
            </li>
            <li>
              <strong>Data e hora do seu consentimento</strong>, registradas
              junto com o cadastro.
            </li>
            <li>
              <strong>Dados técnicos do acesso</strong>: endereço IP,
              identificador do navegador (user-agent), endereço da página e
              parâmetros da campanha (UTMs), além dos identificadores de
              publicidade do Meta (cookies <code>_fbc</code> e <code>_fbp</code>,
              e o parâmetro <code>fbclid</code> da URL).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-xl text-ameixa">3. para que a gente usa</h2>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              Enviar o link do grupo e as ofertas garimpadas pelo WhatsApp.
            </li>
            <li>
              Medir e otimizar os anúncios que trouxeram você até aqui, inclusive
              enviando ao Meta o evento de cadastro (&ldquo;Lead&rdquo;).
            </li>
            <li>
              Evitar fraude e uso abusivo do formulário.
            </li>
          </ul>
          <p className="mt-2">
            <strong>Base legal (LGPD):</strong> o seu consentimento (art. 7º, I) e
            o legítimo interesse em divulgar e melhorar nossos anúncios (art. 7º,
            IX). Você pode retirar o consentimento a qualquer momento.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl text-ameixa">
            4. com quem a gente compartilha
          </h2>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Meta Platforms, Inc.</strong> (Facebook/Instagram): para
              medição e otimização de anúncios, recebe o evento de cadastro. Os
              dados que identificam você (WhatsApp e primeiro nome) são enviados{" "}
              <strong>criptografados com hash SHA-256</strong> — o Meta não recebe
              o seu número em texto puro. IP e user-agent são enviados para
              pareamento, conforme a documentação da Conversions API do Meta.
            </li>
            <li>
              <strong>Supabase</strong> (infraestrutura de banco de dados) e{" "}
              <strong>Vercel</strong> (hospedagem): armazenam os dados em nosso
              nome, como operadores.
            </li>
          </ul>
          <p className="mt-2">
            A gente não vende os seus dados. Parte desses parceiros pode
            armazenar dados fora do Brasil (por exemplo, nos Estados Unidos), com
            as salvaguardas previstas na LGPD.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl text-ameixa">5. por quanto tempo guarda</h2>
          <p>
            Guardamos o seu cadastro enquanto você fizer parte do grupo ou tiver
            interesse em receber as ofertas, e por até <strong>24 meses</strong>{" "}
            após o seu último contato ou a sua saída do grupo. O registro de
            consentimento é mantido pelo período necessário para cumprir
            obrigações legais. Depois disso, os dados são apagados ou
            anonimizados.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl text-ameixa">6. seus direitos</h2>
          <p>
            Você pode pedir acesso, correção, portabilidade, informação sobre
            compartilhamento e, principalmente,{" "}
            <strong>exclusão dos seus dados</strong> e{" "}
            <strong>retirada do consentimento</strong>. É só entrar em contato por{" "}
            <Contato /> com o assunto &ldquo;meus dados&rdquo;. A gente responde
            em até 15 dias. Sair do grupo do WhatsApp também interrompe o envio
            das mensagens, mas não apaga o cadastro — para isso, use o contato
            acima.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl text-ameixa">7. cookies</h2>
          <p>
            Usamos o Pixel do Meta, que grava os cookies <code>_fbc</code> e{" "}
            <code>_fbp</code> no seu navegador para atribuição de anúncios. Você
            pode bloquear ou apagar cookies nas configurações do navegador; isso
            não impede o cadastro no grupo.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl text-ameixa">8. links de afiliado</h2>
          <p>
            As ofertas divulgadas no grupo usam links de afiliado. Se você compra
            por um desses links, podemos receber uma comissão da loja, sem custo
            adicional para você. Isso não muda o tratamento dos seus dados
            descrito aqui.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl text-ameixa">9. mudanças nesta política</h2>
          <p>
            Se algo mudar, a gente atualiza esta página e a data no topo. Em
            mudança relevante, avisamos pelo grupo.
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
