import { motion } from "framer-motion";
import { Bot, TrendingUp, Zap, Play } from "lucide-react";

export function DashboardMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative"
    >
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-cta/20 blur-2xl" />
      <div className="relative rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)]">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Painel IA</p>
              <p className="text-xs text-muted-foreground">Campanha #001</p>
            </div>
          </div>
          <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">● Online</span>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-secondary p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><TrendingUp className="h-3 w-3" />Vendas hoje</div>
            <p className="mt-1 text-2xl font-bold text-primary">R$ 4.280</p>
          </div>
          <div className="rounded-xl bg-secondary p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Zap className="h-3 w-3" />Cliques</div>
            <p className="mt-1 text-2xl font-bold text-primary">1.247</p>
          </div>
        </div>

        <div className="mb-5 h-24 rounded-xl bg-gradient-to-tr from-primary/5 to-cta/10 p-3">
          <svg viewBox="0 0 200 60" className="h-full w-full">
            <polyline
              fill="none"
              stroke="oklch(0.27 0.06 256)"
              strokeWidth="2.5"
              points="0,50 25,42 50,38 75,30 100,28 125,18 150,22 175,12 200,8"
            />
            <polyline
              fill="none"
              stroke="oklch(0.7 0.16 162)"
              strokeWidth="2"
              strokeDasharray="3 3"
              points="0,55 25,50 50,46 75,40 100,36 125,28 150,30 175,22 200,18"
            />
          </svg>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-success py-3.5 font-semibold text-success-foreground shadow-[0_8px_20px_-8px_oklch(0.7_0.16_162/0.6)] animate-pulse-glow"
        >
          <Play className="h-4 w-4 fill-current" />
          Ativar Anúncio
        </motion.button>
      </div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-6 -top-6 hidden rounded-xl border border-border bg-white px-4 py-3 shadow-lg md:block"
      >
        <p className="text-xs text-muted-foreground">Conversão</p>
        <p className="text-lg font-bold text-success">+248%</p>
      </motion.div>
    </motion.div>
  );
}
