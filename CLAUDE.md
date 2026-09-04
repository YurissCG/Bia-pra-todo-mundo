# Bia Serra — Landing Page de captura

> ## ⚠️ Amendment — 4 de setembro de 2026
>
> **Decisão do dono do projeto, em conversa, revertendo a arquitetura abaixo:**
> o formulário de captura (nome + WhatsApp) foi **removido**. O botão de CTA
> agora abre o WhatsApp direto — prioriza velocidade/conversão sobre a lista de
> contatos própria descrita logo abaixo em "A LP não é vaidade".
>
> Consequência assumida: **não existe mais lista de contatos** (se o número do
> grupo cair, não tem backup de quem entrou) e o Meta não recebe mais o evento
> `Lead` pareado com telefone/nome hasheados. O que existe agora: `PageView`
> (carregamento) e `Contact` (clique no CTA) via Pixel **e** Conversions API,
> deduplicados pelo mesmo `event_id` — sem dado pessoal, só `fbc`/`fbp`/IP/UA.
> Ver [`lib/track.ts`](./lib/track.ts), [`lib/meta.ts`](./lib/meta.ts) e
> [`app/api/track/route.ts`](./app/api/track/route.ts).
>
> Todo o resto deste documento — a seção "Rastreamento Meta", o "Fluxo completo
> de um lead", o item 9 da "Estrutura da página" (formulário), Supabase, LGPD de
> formulário — **descreve a arquitetura antiga e não está mais em vigor**. Fica
> registrado como histórico e caminho de volta: o código removido está nos
> commits do GitHub anteriores a essa data, caso um dia valha reconsiderar (por
> exemplo, se o custo por lead subir demais sem qualificação nenhuma).
>
> Se for reescrever este `CLAUDE.md` do zero, é essa versão — sem formulário —
> que deve virar a fonte da verdade.

## O que é este projeto

Landing page de uma tela que recebe tráfego pago do Meta, captura nome e WhatsApp,
e só então entrega o link do grupo do WhatsApp.

**A LP não é vaidade — é o que faz a audiência ser nossa.** Se o anúncio mandasse
direto pro convite do grupo, no dia em que o número do WhatsApp cair a audiência
inteira some junto. A lista capturada aqui é a única cópia que sobrevive.

Persona: **Bia Serra** (`@biaserra.achados`) — garimpa moda e acessórios, tom de
amiga, não de vendedora. Ela é uma personagem declarada, gerada por IA. **Nunca
escrever copy que afirme experiência de compra pessoal dela** ("comprei e amei",
"testei e aprovei"). Ela filtra, confere avaliação e reprova — não testa.

---

## Leia antes de escrever qualquer copy

Dois documentos em `docs/` definem a mensagem da página. **Leia os dois antes de
escrever um único título.**

- **`docs/marca-bia-serra.md`** — quem é a Bia, o que ela faz e o que ela nunca
  faz, e a voz dela com exemplos de "assim não / assim sim". Toda frase da LP
  passa por essas regras.
- **`docs/estreia-da-bia.md`** — os oito criativos da campanha que trazem o
  tráfego. A LP precisa **dar continuidade à promessa do anúncio**: quem clicou
  em "enquanto tem gente pagando 142 nessa bolsa" tem que reencontrar essa frase
  na página. Promessa que muda entre o anúncio e a LP é a maior fonte de perda de
  conversão que existe. O documento traz uma lista de frases já aprovadas para
  reuso literal.

O teste dos estáticos 02 contra 04 decide qual headline lidera a página: vitrine
de preços (entra por desconto) ou "de mulher pra mulher" (entra por pertencimento).
Enquanto não houver resultado, construir com as duas variantes prontas para troca.

---

## Stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS**
- **Vercel** (deploy)
- **Supabase** (armazenamento de leads)

O App Router não é preferência de estilo: precisamos de **Route Handler no
servidor** para a Conversions API. Sem servidor, não dá pra enviar IP, user-agent
e dados hasheados — e é exatamente isso que sustenta a qualidade do sinal.

Se preferir trocar Supabase por outro destino, o único arquivo a mexer é
`lib/leads.ts`. O resto não sabe onde o lead é gravado.

---

## Mobile-first — não negociável

Praticamente 100% do tráfego vem de anúncio do Instagram e Facebook no celular.
Desktop é exceção e só precisa não estar quebrado.

Regras:

1. **Escreva o CSS para 360px primeiro.** Só depois adicione `sm:` e `md:`.
   Nunca o contrário.
2. **Nenhum scroll horizontal, nunca.** Teste em 320px de largura.
3. **Alvo de toque mínimo 48×48px.** Botão de CTA ocupa a largura toda com
   `py-4` no mínimo.
4. **Fonte base 16px.** Abaixo disso o iOS dá zoom sozinho em campo de formulário
   e quebra o layout.
5. **CTA fixo na base no mobile** (`fixed bottom-0`) depois que o usuário passa
   do primeiro terço da página. Some no desktop.
6. **Imagem do hero com `priority`** e dimensões explícitas, para não haver
   layout shift. CLS alto encarece o anúncio.
7. **Nada de biblioteca de animação.** Peso de página é custo por clique.
8. **Formulário em bottom sheet no mobile**, modal centralizado no desktop.

Meta de performance: LCP abaixo de 2,5s em 4G. Se passar disso, o Meta cobra mais
caro pelo mesmo clique — velocidade aqui é dinheiro, não capricho.

---

## Identidade visual

Paleta **revisada** (a paleta antiga de areia/madeira/café foi descartada por ser
apagada demais para resposta direta):

```
framboesa   #E8215B   cor principal — botões, destaques, fundos de bloco
coral       #FF6B35   acento quente, segundo plano de destaque
creme       #FFF4E8   fundo de respiro
ameixa      #2D1526   texto
verde-wa    #25D366   exclusivamente botões que levam ao WhatsApp
branco      #FFFFFF   fundo principal
```

Regra de cor: **framboesa e coral existem para gritar.** Não suavize, não use
opacidade baixa, não crie versões pastéis. Fundo branco ou creme; a cor entra em
blocos sólidos e no botão.

Tipografia: uma grotesca pesada para títulos (peso 800–900, tracking negativo) e
uma sans neutra para corpo. Títulos em caixa baixa, curtos, quebrando em 2–3
linhas. Nada de serifada.

Botão de CTA: verde WhatsApp, texto branco, largura total, cantos arredondados,
com ícone do WhatsApp à esquerda.

---

## Estrutura da página, na ordem

1. **Barra superior fina** (verde WhatsApp) — "Grupo gratuito no WhatsApp"
2. **Headline** grande + subheadline curta
3. **CTA 1**
4. **Foto da Bia** abraçando as bolsas coloridas (recorte PNG, fundo transparente)
5. **"Enquanto você paga preço cheio…"** — mockup de conversa do grupo mostrando
   o que rola lá dentro
6. **CTA 2**
7. **Como funciona** — três passos curtos (entra · recebe · economiza)
8. **Prova social** — prints reais de membros. **Deixar esta seção oculta até
   existir print de verdade.** Não inventar depoimento nem número.
9. **CTA 3** + formulário
10. **Rodapé** — CNPJ, endereço, política de privacidade, aviso de link de afiliado

### Regras de copy

- Segunda pessoa sempre: "você não precisa pagar 142 numa bolsa que sai por 76".
- Todo preço citado precisa ser real e conferível.
- **Nenhum número inventado.** Nada de "mais de 1 milhão de pessoas" enquanto não
  for verdade. Contagem de membros só aparece quando for real e puxada do banco.
- Sem escassez falsa: nada de "vagas limitadas" num grupo que não tem limite.
- O rodapé precisa dizer que o grupo usa links de afiliado.

---

## Rastreamento Meta — a parte crítica

### O princípio

Mais **tipos** de evento não melhoram a otimização. O que melhora é:

1. **Volume do evento otimizado** — o Meta precisa de ~50 conversões por semana
   por conjunto de anúncios para sair da fase de aprendizado.
2. **Qualidade do pareamento (EMQ)** — o quanto o Meta consegue ligar o evento a
   uma pessoa real. Meta de EMQ para evento de Lead: **7,0 ou mais**.
3. **Redundância do mesmo evento** — enviar o *mesmo* evento pelo Pixel e pela
   Conversions API, deduplicado. É isso que sobrevive a bloqueador de anúncio e
   às restrições de rastreamento do iOS.

O terceiro item é o grão de verdade no "quanto mais evento, melhor". Não é mais
tipo de evento — é o mesmo evento por dois caminhos.

### Eventos

| Evento | Pixel | CAPI | Quando |
|---|---|---|---|
| `PageView` | sim | não | carregamento da página |
| `Lead` | sim | sim | **só depois** do backend validar e gravar o lead |

`Lead` é o evento de otimização da campanha. Dispare-o **apenas após validação no
servidor** — nunca em clique de botão ou abertura de formulário. Evento disparado
cedo demais ensina o Meta a buscar gente que clica e não converte.

### Deduplicação

Mesmo `event_name` e mesmo `event_id` nos dois canais. O `event_id` nasce no
navegador, viaja no corpo do POST e é reusado no servidor.

### Fluxo completo de um lead

```
1. Visitante chega pelo anúncio:  /?fbclid=ABC123

2. No carregamento:
   - se houver fbclid na URL e não houver cookie _fbc, criar:
     _fbc = fb.1.<timestamp_ms>.<fbclid>     (365 dias)
   - o Pixel cria o _fbp sozinho
   - Pixel dispara PageView

3. Usuário preenche nome + WhatsApp e envia

4. No cliente:
   const eventId = crypto.randomUUID()
   fbq('track', 'Lead', {}, { eventID: eventId })
   POST /api/lead {
     nome, telefone, eventId,
     fbc: cookie _fbc, fbp: cookie _fbp,
     eventSourceUrl: window.location.href
   }

5. No servidor (app/api/lead/route.ts):
   - validar telefone brasileiro (10 ou 11 dígitos + DDD válido) e nome (2+ chars)
   - normalizar telefone: só dígitos, prefixo 55, sem "+"
   - normalizar nome: minúsculo, sem acento, sem espaço nas pontas
   - hashear com SHA-256 (hex): telefone, primeiro nome, external_id
   - NÃO hashear: fbc, fbp, client_ip_address, client_user_agent
   - ip  = header 'x-forwarded-for' (primeiro da lista)
   - ua  = header 'user-agent'
   - gravar o lead no Supabase
   - POST para a Conversions API com o MESMO event_name e event_id

6. Cliente recebe 200 e redireciona para NEXT_PUBLIC_WHATSAPP_GROUP_URL
```

### Payload da Conversions API

```
POST https://graph.facebook.com/v21.0/<PIXEL_ID>/events
     ?access_token=<META_CAPI_ACCESS_TOKEN>

{
  "data": [{
    "event_name": "Lead",
    "event_time": <unix seconds>,
    "event_id": "<mesmo do pixel>",
    "event_source_url": "<url da LP>",
    "action_source": "website",
    "user_data": {
      "ph": ["<sha256 do telefone normalizado>"],
      "fn": ["<sha256 do primeiro nome normalizado>"],
      "external_id": ["<sha256 do id do lead>"],
      "fbc": "<cru, sem hash>",
      "fbp": "<cru, sem hash>",
      "client_ip_address": "<cru>",
      "client_user_agent": "<cru>"
    }
  }],
  "test_event_code": "<só em desenvolvimento>"
}
```

**Nunca envie campo vazio ou placeholder.** Omitir é melhor que mandar string
vazia — campo vazio derruba o EMQ.

### Por que pedimos o telefone e não o e-mail

Telefone hasheado (`ph`) é um dos parâmetros de maior peso no pareamento, e é o
dado que a gente realmente precisa depois (o membro está no WhatsApp, não no
e-mail). Um campo só, o mais valioso — cada campo extra derruba a conversão do
formulário.

### Ordem de importância dos parâmetros de pareamento

`fbc` > `fbp` > `ph` > `fn` > `external_id` > geo

O `fbc` é o mais forte de todos e é o mais fácil de perder: se o `fbclid` não for
capturado no primeiro carregamento, some para sempre. Capture antes de qualquer
outra coisa.

### Como verificar

1. Gerenciador de Eventos → Testar Eventos → usar `test_event_code` em dev.
2. Confirmar que o `Lead` aparece **uma vez só**, com origem "Navegador e Servidor".
   Se aparecer duas vezes, a deduplicação falhou — confira o `event_id`.
3. Após alguns dias com tráfego real, checar o **Event Match Quality** do evento
   `Lead`. Abaixo de 6, investigar qual parâmetro está faltando.

---

## Variáveis de ambiente

```
NEXT_PUBLIC_META_PIXEL_ID=
META_CAPI_ACCESS_TOKEN=
META_TEST_EVENT_CODE=              # apenas em desenvolvimento
NEXT_PUBLIC_WHATSAPP_GROUP_URL=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

`META_CAPI_ACCESS_TOKEN` e `SUPABASE_SERVICE_ROLE_KEY` são **secretos** e só
podem ser lidos no servidor. Jamais prefixar com `NEXT_PUBLIC_`.

---

## LGPD — obrigatório, não opcional

Estamos coletando telefone de pessoa física e enviando dado hasheado para o Meta.

- Checkbox de consentimento **não pré-marcado** no formulário, com texto claro:
  aceita receber promoções no WhatsApp e concorda com a política de privacidade.
- Página `/privacidade` com: o que é coletado, para quê, com quem é compartilhado
  (Meta), por quanto tempo, e como pedir exclusão.
- Rodapé com CNPJ e endereço. O Meta exige identificação do anunciante, e página
  sem isso trava na revisão do anúncio.
- Guardar data/hora do consentimento junto do lead no banco.

---

## Deploy

```
1. git init && git add -A && git commit
2. criar repositório no GitHub e dar push
3. Vercel → Import Project → selecionar o repositório
4. cadastrar todas as variáveis de ambiente no painel da Vercel
5. deploy
6. apontar domínio próprio (não usar *.vercel.app em anúncio —
   domínio genérico prejudica a revisão e a confiança)
```

## Auditoria técnica

Depois do deploy, rodar a skill de SEO instalada no projeto:

```
/plugin marketplace add AgriciDaniel/claude-seo
/plugin install claude-seo@agricidaniel-claude-seo
/seo technical <url da LP>
```

Atenção ao escopo: para uma LP de tráfego pago, o que importa nessa auditoria é
**Core Web Vitals e SEO técnico** — velocidade, CLS, imagem, render. A parte de
conteúdo e busca orgânica é irrelevante aqui, porque ninguém vai chegar nessa
página pelo Google. Página lenta encarece clique; é por isso que rodamos.

---

## Definição de pronto

- [ ] Abre em 360px sem scroll horizontal
- [ ] LCP abaixo de 2,5s em 4G simulado
- [ ] `_fbc` criado corretamente a partir do `fbclid`
- [ ] `Lead` aparece uma única vez no Testar Eventos, como "Navegador e Servidor"
- [ ] Lead gravado no Supabase com data/hora do consentimento
- [ ] Redirecionamento para o grupo funciona depois do envio
- [ ] Página de privacidade no ar e linkada no rodapé
- [ ] CNPJ e endereço no rodapé
- [ ] Nenhum número ou depoimento inventado na página
