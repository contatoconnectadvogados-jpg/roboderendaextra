import roboAtivado from "@/assets/notif-robo-ativado.png";
import vendaAprovada from "@/assets/notif-venda-aprovada.png";

export function NotificationBar() {
  const items = [
    { src: roboAtivado, alt: "Robô de Vendas Automático Ativado" },
    { src: vendaAprovada, alt: "Venda Aprovada — Valor: R$ 197,98" },
  ];
  const loop = [...items, ...items, ...items, ...items];

  return (
    <div className="w-full overflow-hidden py-6">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-4 sm:gap-6">
            {loop.map((it, i) => (
              <img
                key={i}
                src={it.src}
                alt={it.alt}
                className="h-16 w-auto flex-shrink-0 sm:h-20 md:h-24 lg:h-28"
                draggable={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
