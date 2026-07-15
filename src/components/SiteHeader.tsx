import { Bot } from "lucide-react";
import { CheckoutButton } from "@/components/CheckoutButton";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[oklch(0.65_0.27_300)] to-[oklch(0.7_0.22_240)] shadow-[var(--shadow-glow-purple)]">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="truncate text-sm font-bold text-foreground sm:text-lg" translate="no">
            RoboVendas<span className="text-gradient">.IA</span>
          </span>
        </div>
        <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#como-funciona" className="transition-colors hover:text-foreground">Como funciona</a>
          <a href="#para-quem" className="transition-colors hover:text-foreground">Para quem é</a>
          <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
          <a href="#preco" className="transition-colors hover:text-foreground">Preço</a>
        </nav>
        <div className="flex-shrink-0">
          <CheckoutButton size="md" variant="cta" label="header" className="!w-auto whitespace-nowrap">
            <span className="hidden sm:inline">Começar agora</span>
            <span className="sm:hidden">Começar</span>
          </CheckoutButton>
        </div>
      </div>
    </header>

  );
}
