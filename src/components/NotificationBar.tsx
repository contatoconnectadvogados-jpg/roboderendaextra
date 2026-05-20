import { CheckCircle2 } from "lucide-react";

function Notification() {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-black px-5 py-2.5 ring-1 ring-[oklch(0.82_0.16_88/0.5)] shadow-[0_0_20px_oklch(0.82_0.16_88/0.25)]">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[oklch(0.82_0.16_88/0.15)] ring-1 ring-[oklch(0.82_0.16_88/0.6)]">
        <CheckCircle2 className="h-5 w-5 text-gold" />
      </div>
      <div className="leading-tight">
        <p className="text-[13px] font-bold uppercase tracking-wide text-gold">
          Parabéns, venda aprovada
        </p>
        <p className="text-base font-extrabold text-gold">R$ 197,90</p>
      </div>
    </div>
  );
}

export function NotificationBar() {
  const items = Array.from({ length: 8 });
  return (
    <div className="w-full bg-white py-4 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-2xl border border-black/80 bg-black p-3">
          <div className="flex items-center gap-2 px-2 pb-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.2_155)] shadow-[0_0_8px_oklch(0.78_0.2_155)]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/80">
              Notificações de Vendas ao vivo
            </span>
          </div>
          <div className="overflow-hidden">
            <div className="flex w-max animate-marquee gap-4 whitespace-nowrap">
              {[...items, ...items].map((_, i) => (
                <Notification key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
