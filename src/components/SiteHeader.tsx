import { Bot } from "lucide-react";
import { motion } from "framer-motion";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[oklch(0.65_0.27_300)] to-[oklch(0.7_0.22_240)] shadow-[var(--shadow-glow-purple)]">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">
            RoboVendas<span className="text-gradient">.IA</span>
          </span>
        </div>
        <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#como-funciona" className="transition-colors hover:text-foreground">Como funciona</a>
          <a href="#para-quem" className="transition-colors hover:text-foreground">Para quem é</a>
          <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
          <a href="#preco" className="transition-colors hover:text-foreground">Preço</a>
        </nav>
        <motion.a
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          href="#preco"
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-cta-foreground shadow-[var(--shadow-cta)]"
          style={{ background: "var(--gradient-cta)" }}
        >
          Começar agora
        </motion.a>
      </div>
    </header>
  );
}
