import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export type Testimonial = {
  name: string;
  role: string;
  result: string;
  text: string;
  avatarUrl?: string;
};

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);
  const scrollTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);

  useEffect(() => {
    if (!embla) return;
    setSnaps(embla.scrollSnapList());
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
    const auto = setInterval(() => embla.scrollNext(), 5500);
    return () => {
      embla.off("select", onSelect);
      clearInterval(auto);
    };
  }, [embla]);

  useEffect(() => {
    embla?.reInit();
  }, [embla, items]);

  return (
    <div className="relative mt-14">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {items.map((it, i) => {
            const initials = it.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("");
            return (
              <div
                key={`${it.name}-${i}`}
                className="min-w-0 flex-[0_0_100%] px-2 sm:flex-[0_0_85%] sm:px-3 md:flex-[0_0_50%] lg:flex-[0_0_50%]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="glass group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl p-5 transition-shadow hover:shadow-[var(--shadow-glow-purple)] sm:p-6"
                >
                  <div className="flex items-start gap-3">
                    {it.avatarUrl ? (
                      <img
                        src={it.avatarUrl}
                        alt={it.name}
                        loading="lazy"
                        className="h-12 w-12 flex-shrink-0 rounded-full object-cover ring-1 ring-white/15"
                      />
                    ) : (
                      <div
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ background: "var(--gradient-primary)" }}
                      >
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground sm:text-base">
                        {it.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{it.role}</p>
                      <div className="mt-1 flex items-center gap-0.5">
                        {[...Array(5)].map((_, k) => (
                          <Star key={k} className="h-3.5 w-3.5 fill-gold text-gold" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/85 sm:text-[15px]">
                    {it.text}
                  </p>

                  <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                    <TrendingUp className="h-3 w-3" /> {it.result}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          aria-label="Anterior"
          onClick={scrollPrev}
          className="glass flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex items-center gap-1.5">
          {snaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Ir para depoimento ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === selected
                  ? "w-6 bg-gradient-to-r from-[oklch(0.65_0.27_300)] to-[oklch(0.74_0.22_50)]"
                  : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
        <button
          aria-label="Próximo"
          onClick={scrollNext}
          className="glass flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      </div>
    </div>
  );
}
