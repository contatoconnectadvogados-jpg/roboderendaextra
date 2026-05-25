import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function getDeadline(): number {
  if (typeof window === "undefined") return Date.now() + 3 * 3600_000;
  const key = "rv_countdown_deadline";
  const existing = localStorage.getItem(key);
  if (existing) {
    const t = Number(existing);
    if (t > Date.now()) return t;
  }
  const next = Date.now() + 3 * 3600_000; // 3h window
  localStorage.setItem(key, String(next));
  return next;
}

export function CountdownTimer() {
  const [deadline, setDeadline] = useState<number>(() => getDeadline());
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (now >= deadline) {
      localStorage.removeItem("rv_countdown_deadline");
      setDeadline(getDeadline());
    }
  }, [now, deadline]);

  const diff = Math.max(0, deadline - now);
  const h = Math.floor(diff / 3600_000);
  const m = Math.floor((diff % 3600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  const pad = (n: number) => n.toString().padStart(2, "0");

  const cells = [
    { v: pad(h), l: "horas" },
    { v: pad(m), l: "min" },
    { v: pad(s), l: "seg" },
  ];

  return (
    <div className="mt-5 flex items-center justify-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3">
      <Clock className="h-5 w-5 flex-shrink-0 animate-pulse text-destructive" />
      <span className="text-xs font-bold uppercase tracking-wider text-destructive">
        Oferta termina em
      </span>
      <div className="flex items-center gap-1.5">
        {cells.map((c, i) => (
          <div key={c.l} className="flex items-center gap-1.5">
            <div className="rounded-md bg-background/60 px-2 py-1 text-center ring-1 ring-white/10">
              <span className="font-mono text-base font-extrabold text-foreground tabular-nums md:text-lg">
                {c.v}
              </span>
              <span className="ml-1 text-[9px] font-semibold uppercase text-muted-foreground">
                {c.l}
              </span>
            </div>
            {i < cells.length - 1 && (
              <span className="font-bold text-destructive">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
