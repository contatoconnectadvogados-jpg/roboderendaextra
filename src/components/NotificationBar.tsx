import { CheckCircle2, Bot } from "lucide-react";

const items = [
  { icon: Bot, text: "🤖 Robô Automático Ativado", color: "text-primary" },
  { icon: CheckCircle2, text: "✅ Parabéns, venda aprovada — R$ 197,90", color: "text-success" },
  { icon: Bot, text: "🤖 Robô Automático Ativado", color: "text-primary" },
  { icon: CheckCircle2, text: "✅ Parabéns, venda aprovada — R$ 197,90", color: "text-success" },
  { icon: Bot, text: "🤖 Robô Automático Ativado", color: "text-primary" },
  { icon: CheckCircle2, text: "✅ Parabéns, venda aprovada — R$ 197,90", color: "text-success" },
];

export function NotificationBar() {
  const loop = [...items, ...items];
  return (
    <div className="w-full overflow-hidden border-y border-border bg-white py-2">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {loop.map((it, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-medium">
            <it.icon className={`h-4 w-4 ${it.color}`} />
            <span className="text-foreground/80">{it.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
