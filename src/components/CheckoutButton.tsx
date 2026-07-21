import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { type ReactNode } from "react";
import { useSiteConfig } from "@/lib/site-config";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Variant = "cta" | "success";
type Size = "md" | "lg";

export function CheckoutButton({
  children,
  variant = "cta",
  size = "lg",
  label,
  className,
  pulse = false,
  scrollTo,
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  label: string;
  className?: string;
  pulse?: boolean;
  scrollTo?: string;
}) {
  const { checkoutUrl } = useSiteConfig();
  const sizeClasses =
    size === "lg" ? "px-7 py-4 text-base" : "px-5 py-2.5 text-sm";
  const bg =
    variant === "success" ? "var(--gradient-success)" : "var(--gradient-cta)";
  const fg =
    variant === "success" ? "text-success-foreground" : "text-cta-foreground";
  const shadow =
    variant === "success" ? "" : "shadow-[var(--shadow-cta)]";
  const commonClasses = cn(
    "group inline-flex w-full items-center justify-center gap-2 rounded-xl text-center font-bold leading-tight transition-shadow",
    sizeClasses,
    fg,
    shadow,
    pulse && "animate-pulse-glow",
    className,
  );

  if (scrollTo) {
    return (
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={(e) => {
          e.preventDefault();
          track({ type: "click", label });
          const el = document.querySelector(scrollTo);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className={commonClasses}
        style={{ background: bg }}
      >
        <span className="min-w-0 text-center leading-tight">{children}</span>
        <ArrowRight className="h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-1" />
      </motion.button>
    );
  }

  return (
    <motion.a
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      href={checkoutUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        track({ type: "checkout_click", label });
      }}
      className={commonClasses}
      style={{ background: bg }}
    >
      <span className="min-w-0 text-center leading-tight">{children}</span>
      <ArrowRight className="h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-1" />
    </motion.a>
  );
}
