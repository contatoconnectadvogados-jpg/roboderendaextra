import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Quote, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export type Testimonial = {
  name: string;
  role: string;
  result: string;
  text: string;
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

  return (
    <div className="relative mt-14">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {items.map((it, i) => (
            <div
              key={`${it.name}-${i}`}
              className="min-w-0 flex-[0_0_100%] px-2 sm:flex-[0_0_85%] sm:px-3 md:flex-[0_0_50%] lg:flex-[0_0_50%]"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl p-6 transition-shadow hover:shadow-[var(--shadow-glow-purple)] sm:p-7"
              >
                <Quote className="absolute right-5 top-5 h-10 w-10 text-white/5" />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/85 sm:text-base">
                  "{it.text}"
                </p>
                <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  <TrendingUp className="h-3 w-3" /> {it.result}
                </div>
                <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {it.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">{it.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{it.role}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
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
                i === selected ? "w-6 bg-gradient-to-r from-[oklch(0.65_0.27_300)] to-[oklch(0.74_0.22_50)]" : "w-2 bg-white/20"
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
