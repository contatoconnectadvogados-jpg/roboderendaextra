import { Bot } from "lucide-react";
import { motion } from "framer-motion";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-primary">RoboVendas<span className="text-cta">.IA</span></span>
        </div>
        <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#como-funciona" className="hover:text-primary transition-colors">Como funciona</a>
          <a href="#para-quem" className="hover:text-primary transition-colors">Para quem é</a>
          <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          <a href="#preco" className="hover:text-primary transition-colors">Preço</a>
        </nav>
        <motion.a
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          href="#preco"
          className="rounded-lg bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground shadow-[var(--shadow-cta)]"
        >
          Começar agora
        </motion.a>
      </div>
    </header>
  );
}
