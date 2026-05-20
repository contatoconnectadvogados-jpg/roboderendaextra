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
      <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-[oklch(0.65_0.27_300/0.35)] via-[oklch(0.7_0.22_240/0.25)] to-[oklch(0.74_0.22_50/0.3)] blur-3xl" />
      <div className="glass relative rounded-3xl p-6 shadow-[var(--shadow-elegant)]">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg shadow-[var(--shadow-glow-purple)]"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Painel IA</p>
              <p className="text-xs text-muted-foreground">Campanha #001</p>
            </div>
          </div>
          <span className="rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            ● Online
          </span>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" /> Vendas hoje
            </div>
            <p className="mt-1 text-2xl font-bold text-gradient">R$ 4.280</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap className="h-3 w-3" /> Cliques
            </div>
            <p className="mt-1 text-2xl font-bold text-gradient">1.247</p>
          </div>
        </div>

        <div className="mb-5 h-24 rounded-xl border border-white/10 bg-gradient-to-tr from-[oklch(0.65_0.27_300/0.12)] to-[oklch(0.74_0.22_50/0.15)] p-3">
          <svg viewBox="0 0 200 60" className="h-full w-full">
            <defs>
              <linearGradient id="lineGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="oklch(0.65 0.27 300)" />
                <stop offset="100%" stopColor="oklch(0.82 0.16 200)" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="2.8"
              strokeLinecap="round"
              points="0,50 25,42 50,38 75,30 100,28 125,18 150,22 175,12 200,8"
            />
            <polyline
              fill="none"
              stroke="oklch(0.78 0.2 155)"
              strokeWidth="1.8"
              strokeDasharray="3 3"
              points="0,55 25,50 50,46 75,40 100,36 125,28 150,30 175,22 200,18"
            />
          </svg>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-success-foreground animate-pulse-glow"
          style={{ background: "var(--gradient-success)" }}
        >
          <Play className="h-4 w-4 fill-current" />
          Ativar Anúncio
        </motion.button>
      </div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="glass absolute -right-6 -top-6 hidden rounded-xl px-4 py-3 md:block"
      >
        <p className="text-xs text-muted-foreground">Conversão</p>
        <p className="text-lg font-bold text-success">+248%</p>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="glass absolute -left-6 -bottom-6 hidden rounded-xl px-4 py-3 md:block"
      >
        <p className="text-xs text-muted-foreground">ROI</p>
        <p className="text-lg font-bold text-gradient">4.8x</p>
      </motion.div>
    </motion.div>
  );
}
