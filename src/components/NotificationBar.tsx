import roboAtivado from "@/assets/notif-robo-ativado.png";
import vendaAprovada from "@/assets/notif-venda-aprovada.png";
import roboLiberado from "@/assets/notif-robo-liberado.jpeg";

type Item = { src: string; alt: string };

export function NotificationBar({
  items,
  size = "lg",
}: {
  items?: Item[];
  size?: "sm" | "lg";
}) {
  const list: Item[] = items ?? [
    { src: roboAtivado, alt: "Robô de Vendas Automático Ativado" },
    { src: vendaAprovada, alt: "Venda Aprovada — Valor: R$ 197,98" },
  ];
  const loop = [...list, ...list, ...list, ...list];

  const sizeClasses =
    size === "sm"
      ? "h-12 w-auto sm:h-14 md:h-16"
      : "h-16 w-auto sm:h-20 md:h-24 lg:h-28";

  return (
    <div className="w-full overflow-hidden py-4">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-4 sm:gap-6">
            {loop.map((it, i) => (
              <img
                key={i}
                src={it.src}
                alt={it.alt}
                className={`${sizeClasses} flex-shrink-0 rounded-2xl border border-white/15 shadow-[0_0_0_1px_oklch(0.7_0.1_280/0.08),0_10px_30px_-15px_oklch(0_0_0/0.6)]`}
                draggable={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopNotificationBar() {
  return (
    <NotificationBar
      size="sm"
      items={[{ src: roboLiberado, alt: "Robô liberado com sucesso. Ativar agora!" }]}
    />
  );
}
