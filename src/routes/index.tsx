import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Store, Package, Smartphone, MessageCircle, Star, Check, X,
  ArrowRight, Sparkles, Zap, Target, Shield, Clock, TrendingUp,
  ChevronDown, Bot, Heart, Users,
} from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { NotificationBar } from "@/components/NotificationBar";
import { DashboardMock } from "@/components/DashboardMock";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "RoboVendas.IA — Robô de Vendas Automáticas com IA para Vida Real" },
      { name: "description", content: "O primeiro robô de vendas com IA focado em resultados reais. Transforme cliques em campanhas profissionais sem promessas vazias. Estabilidade e lucro de verdade." },
    ],
  }),
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <NotificationBar />
      <ComparisonSection />
      <HowItWorks />
      <Manifesto />
      <ForWhom />
      <Benefits />
      <FAQ />
      <Pricing />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-foreground/90">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            A verdade sobre anúncios online que ninguém te conta
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            O Primeiro Robô de Vendas Automáticas e IA Focado na{" "}
            <span className="text-gradient">Vida Real</span>.
          </h1>
          <p className="mt-3 text-xl font-semibold text-foreground/80">
            Sem milhões da noite para o dia. Apenas estabilidade e lucro.
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Se você cansou das promessas de "fique rico fácil" e só quer saber como ganhar dinheiro de verdade,
            conheça a ferramenta que transforma cliques simples em campanhas profissionais de alta conversão.
            Para negócios físicos, produtos digitais ou WhatsApp.
          </p>

          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            href="#preco"
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-4 text-base font-bold text-cta-foreground shadow-[var(--shadow-cta)]"
            style={{ background: "var(--gradient-cta)" }}
          >
            Quero Simplificar Minhas Vendas Agora
            <ArrowRight className="h-5 w-5" />
          </motion.a>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-sm italic text-muted-foreground">
              "Finalmente algo que não exige que eu seja um especialista em tráfego."
            </p>
          </div>

          <StatsBlock />
        </motion.div>

        <DashboardMock />
      </div>
    </section>
  );
}

function StatsBlock() {
  const stats = [
    { v: "+12k", l: "Usuários ativos", c: "from-[oklch(0.65_0.27_300)] to-[oklch(0.7_0.22_240)]" },
    { v: "R$ 38M", l: "Em vendas geradas", c: "from-[oklch(0.78_0.2_155)] to-[oklch(0.82_0.16_200)]" },
    { v: "4.9★", l: "Avaliação média", c: "from-[oklch(0.74_0.22_50)] to-[oklch(0.82_0.16_88)]" },
  ];
  return (
    <div className="glass mt-8 grid max-w-md grid-cols-3 gap-3 rounded-2xl p-4">
      {stats.map((s) => (
        <div key={s.l} className="rounded-xl bg-white/[0.03] p-3 text-center ring-1 ring-white/5">
          <p className={`bg-gradient-to-br ${s.c} bg-clip-text text-2xl font-extrabold text-transparent`}>
            {s.v}
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{s.l}</p>
        </div>
      ))}
    </div>
  );
}

function ComparisonSection() {
  const rows = [
    { old: "Painéis confusos com centenas de botões", neu: "Interface limpa: preencha, clique e pronto" },
    { old: "Risco alto de perder dinheiro testando", neu: "Estrutura validada — você foca no seu negócio" },
    { old: "Meses estudando público, pixel e métricas", neu: "O sistema traduz tudo em segundos" },
    { old: "Falsa promessa de milhões na primeira semana", neu: "Crescimento real: foco em R$ 10k–15k mensais" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold md:text-4xl">
          A Diferença Entre o Mercado e o <span className="text-gradient">Nosso Robô</span>
        </h2>
        <p className="mt-3 text-muted-foreground">Veja por que pessoas comuns estão migrando dos gerenciadores complexos.</p>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <motion.div {...fadeUp} className="glass rounded-2xl p-7">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-destructive/15 px-3 py-1 text-xs font-semibold text-destructive">
            <X className="h-3.5 w-3.5" /> O Jeito Antigo
          </div>
          <h3 className="text-lg font-semibold text-foreground/90">Gerenciadores Complexos</h3>
          <ul className="mt-5 space-y-4">
            {rows.map((r, i) => (
              <li key={i} className="flex gap-3">
                <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <span className="text-sm text-muted-foreground">{r.old}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="glass relative rounded-2xl p-7 shadow-[var(--shadow-glow-purple)]"
          style={{ borderImage: "linear-gradient(135deg, oklch(0.78 0.2 155), oklch(0.65 0.27 300)) 1" }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-success/40" />
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
            <Check className="h-3.5 w-3.5" /> Nossa Solução
          </div>
          <h3 className="text-lg font-semibold text-foreground">O Seu Novo Robô de Vendas</h3>
          <ul className="mt-5 space-y-4">
            {rows.map((r, i) => (
              <li key={i} className="flex gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                <span className="text-sm font-medium text-foreground">{r.neu}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Target, n: "01", t: "O Comando", d: "Acesse seu painel, escolha o que quer vender (físico, digital, serviço local ou WhatsApp) e nos diga seu objetivo." },
    { icon: Bot, n: "02", t: "A IA Trabalha", d: "Nosso sistema recebe o comando. Sem código, sem pixel, sem briga com Facebook Ads. O robô absorve seu pedido." },
    { icon: Zap, n: "03", t: "Vendas no Piloto Automático", d: "O anúncio entra no ar gerenciado por IA + expertise nos bastidores. Você só acompanha os clientes chegando." },
  ];
  return (
    <section id="como-funciona" className="relative py-24">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Como fazer dinheiro na internet virou questão de <span className="text-gradient">3 cliques</span>
          </h2>
          <p className="mt-3 text-muted-foreground">A complexidade fica no nosso lado. A simplicidade fica no seu.</p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              {...fadeUp}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass group relative rounded-2xl p-7 transition-shadow hover:shadow-[var(--shadow-glow-purple)]"
            >
              <span className="absolute right-6 top-6 text-6xl font-extrabold text-white/5">{s.n}</span>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-110"
                style={{ background: "var(--gradient-primary)" }}
              >
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-foreground">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="relative overflow-hidden py-24">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, oklch(0.4 0.22 300 / 0.5), transparent 45%), radial-gradient(circle at 80% 70%, oklch(0.4 0.2 50 / 0.4), transparent 50%)",
        }}
      />
      <motion.div {...fadeUp} className="relative mx-auto max-w-3xl px-6 text-center">
        <span className="text-7xl leading-none text-gradient">"</span>
        <h2 className="-mt-6 text-3xl font-extrabold md:text-4xl">
          Chega de Sensacionalismo. Vamos Falar de Como Ganhar Dinheiro de Forma{" "}
          <span className="text-gradient">Digna</span>.
        </h2>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-foreground/80">
          <p>
            A internet está cheia de "gurus" prometendo que você vai comprar uma Ferrari no mês que vem.
            <strong className="text-foreground"> Nós não.</strong> Nosso Robô de Vendas foi criado para pessoas normais
            que querem sair do sufoco, deixar a CLT para trás e ter liberdade de trabalhar de onde quiserem.
          </p>
          <p>
            Acreditamos em construir estabilidade. Com tempo e dedicação usando nossa IA, alcançar
            <strong className="text-gradient"> R$ 10.000 a R$ 15.000 por mês</strong> não é conto de fadas — é matemática pura.
            É sobre ter uma renda extra que vira renda principal. É sobre ter paz.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><Heart className="h-4 w-4 text-cta" /> Feito para pessoas reais</span>
          <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-cta" /> Sem promessas vazias</span>
          <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-cta" /> Crescimento sustentável</span>
        </div>
      </motion.div>
    </section>
  );
}

function ForWhom() {
  const cards = [
    { icon: Store, t: "Negócios Físicos", d: "Lojas, clínicas e restaurantes que precisam atrair clientes da sua região todos os dias." },
    { icon: Package, t: "E-commerce / Dropshipping", d: "Venda produtos escaláveis sem precisar entender de bloqueios, BM ou contas comerciais." },
    { icon: Smartphone, t: "Produtos Digitais", d: "Otimize o tráfego para suas páginas de vendas de infoprodutos de forma contínua." },
    { icon: MessageCircle, t: "Vendas pelo WhatsApp", d: "Quer o telefone tocando com gente interessada? O robô envia o público certo direto pro chat." },
  ];
  return (
    <section id="para-quem" className="mx-auto max-w-7xl px-6 py-24">
      <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold md:text-4xl">
          Para quem é esta <span className="text-gradient">ferramenta?</span>
        </h2>
        <p className="mt-3 text-muted-foreground">Se você vende algo, o robô trabalha para você.</p>
      </motion.div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.t}
            {...fadeUp}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -8, rotate: -0.5 }}
            className="glass group rounded-2xl p-6 transition-all hover:shadow-[var(--shadow-glow-cyan)]"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-cta-foreground transition-transform group-hover:scale-110"
              style={{ background: "var(--gradient-cta)" }}
            >
              <c.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground">{c.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: Clock, t: "Configuração em 5 minutos", d: "Sem cursos, sem semanas de estudo." },
    { icon: Shield, t: "Você controla seu orçamento", d: "Comece com pouco, escale com confiança." },
    { icon: Users, t: "Suporte humano premium", d: "Gente de verdade respondendo seu chat." },
    { icon: TrendingUp, t: "Otimização contínua por IA", d: "Os anúncios melhoram sozinhos a cada hora." },
  ];
  return (
    <section className="relative py-24">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Tudo o que você precisa. <span className="text-gradient">Nada do que não precisa.</span>
          </h2>
        </motion.div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.div
              key={it.t}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-6"
            >
              <it.icon className="h-7 w-7 text-gold" />
              <h3 className="mt-4 font-bold text-foreground">{it.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{it.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Como ganhar dinheiro com esse Robô se eu não tenho experiência?", a: "A plataforma foi criada exatamente para iniciantes. Você só precisa ter um produto ou serviço e seguir os passos simples na tela. A complexidade do tráfego fica por conta do sistema." },
    { q: "É seguro colocar meu dinheiro nisso?", a: "Sim. Você tem total controle sobre o orçamento que deseja investir nos anúncios. Nós apenas automatizamos e simplificamos a criação e otimização para que você pare de perder tempo." },
    { q: "Em quanto tempo vou saber como fazer dinheiro de verdade?", a: "Fugimos de falsas promessas. Os resultados dependem do seu nicho e produto, mas nossa ferramenta elimina a curva de aprendizado de meses de gestão de tráfego, acelerando seus resultados reais desde a primeira semana." },
    { q: "Preciso ter site ou loja online?", a: "Não. O robô funciona com links de WhatsApp, páginas de venda, perfis sociais ou qualquer destino que você queira receber tráfego qualificado." },
    { q: "Posso cancelar quando quiser?", a: "Sim. Sem fidelidade, sem letras miúdas. Cancela com 1 clique direto no painel." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <motion.div {...fadeUp} className="text-center">
        <h2 className="text-3xl font-extrabold md:text-4xl">
          Perguntas <span className="text-gradient">Frequentes</span>
        </h2>
        <p className="mt-3 text-muted-foreground">Tirando as dúvidas mais comuns antes de você começar.</p>
      </motion.div>
      <div className="mt-10 space-y-3">
        {faqs.map((f, i) => (
          <motion.div
            key={i}
            {...fadeUp}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass overflow-hidden rounded-xl"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/5"
            >
              <span className="font-semibold text-foreground">{f.q}</span>
              <ChevronDown className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            <motion.div
              initial={false}
              animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const features = [
    "Acesso ao Painel Simplificado",
    "Inteligência para Negócios Locais, Digitais e WhatsApp",
    "Suporte Premium Humanizado",
    "Otimização automática por IA 24/7",
    "Treinamento em vídeo passo a passo",
    "Cancelamento fácil a qualquer momento",
  ];
  return (
    <section id="preco" className="relative py-24">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, oklch(0.35 0.2 300 / 0.4), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6">
        <motion.div {...fadeUp} className="text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Dê o primeiro passo para a sua{" "}
            <span className="text-gradient">estabilidade financeira</span> hoje.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Não pague milhares para agências nem sofra tentando aprender sozinho.
            Tenha gestão de tráfego profissional escondida atrás dos cliques mais simples que você já viu.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="glass relative mt-12 overflow-hidden rounded-3xl p-8 shadow-[var(--shadow-elegant)] md:p-10"
        >
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-[oklch(0.65_0.27_300/0.5)]" />
          <div
            className="absolute right-0 top-0 rounded-bl-2xl px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-cta-foreground"
            style={{ background: "var(--gradient-cta)" }}
          >
            ★ Plano Principal
          </div>

          <h3 className="text-2xl font-extrabold text-foreground">Robô de Vendas Completo</h3>
          <p className="mt-1 text-sm text-muted-foreground">Acesso vitalício à plataforma e atualizações.</p>

          {/* Price anchoring */}
          <div className="my-7 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-destructive/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-destructive">
                -80%
              </span>
              <span className="text-base text-muted-foreground line-through">De R$ 997,00</span>
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gold">
              Taxa de Implementação Inicial
            </p>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-sm text-muted-foreground">por apenas</span>
              <span className="text-5xl font-extrabold text-gradient md:text-6xl">R$ 197,80</span>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3">
              <Sparkles className="h-4 w-4 text-success" />
              <p className="text-sm text-foreground">
                + Mensalidade de{" "}
                <strong className="text-success">R$ 49,90</strong> nos meses seguintes
              </p>
            </div>
          </div>

          <ul className="space-y-3.5">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-success/15 ring-1 ring-success/40">
                  <Check className="h-3.5 w-3.5 text-success" />
                </div>
                <span className="text-sm text-foreground/90">{f}</span>
              </li>
            ))}
          </ul>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-extrabold text-success-foreground animate-pulse-glow"
            style={{ background: "var(--gradient-success)" }}
          >
            Quero Acessar o Robô e Começar Hoje
            <ArrowRight className="h-5 w-5" />
          </motion.a>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            🔒 Compra 100% Segura • ⚡ Acesso Imediato • ✓ Cancelamento Fácil
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg shadow-[var(--shadow-glow-purple)]"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Bot className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-foreground">
            RoboVendas<span className="text-gradient">.IA</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 RoboVendas.IA — Construindo estabilidade financeira de verdade.</p>
      </div>
    </footer>
  );
}
