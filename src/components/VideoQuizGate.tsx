import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Check, Play, Pause } from "lucide-react";
import videoAsset from "@/assets/vsl-robovendas.mp4.asset.json";
import {
  EMPTY,
  completeGate,
  isGateCompleted,
  writeAnswers,
  type QuizAnswers,
} from "@/lib/quiz-state";
import { setStage, track } from "@/lib/analytics";

type QDef = { key: keyof Omit<QuizAnswers, "completedAt">; label: string; options: string[] };

const QUESTIONS: QDef[] = [
  {
    key: "business",
    label: "Qual desses é o seu tipo de negócio hoje?",
    options: [
      "🏪 Negócio físico (loja, clínica, salão, restaurante)",
      "💻 Produto digital / infoproduto",
      "📦 E-commerce / dropshipping",
      "💬 Vendo direto pelo WhatsApp / redes sociais",
    ],
  },
  {
    key: "ads",
    label: "Como está sua relação com anúncios hoje?",
    options: [
      "🚫 Nunca fiz anúncio nenhum",
      "😓 Já tentei, mas não deu resultado",
      "📈 Já uso anúncios, mas quero melhorar",
      "🤔 Não sei nem por onde começar",
    ],
  },
  {
    key: "goal",
    label: "Qual sua meta de renda extra com isso?",
    options: [
      "Até R$ 5.000/mês",
      "Entre R$ 5.000 e R$ 10.000/mês",
      "Acima de R$ 10.000/mês",
      "Ainda não sei, só quero começar",
    ],
  },
];

const REVEAL_AT_SEC = 55;

function defer(fn: () => void) {
  window.setTimeout(fn, 0);
}

export function VideoQuizGate({ onFinish }: { onFinish: () => void }) {
  const [visible, setVisible] = useState(false); // hidden during SSR/initial paint
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY);
  const [step, setStep] = useState(0); // number of questions revealed (0..3)
  const [transition, setTransition] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const quizAnchorRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const maxWatchedRef = useRef(0);
  const progressReportedRef = useRef(0);
  const questionRevealedRef = useRef(false);
  const finishedRef = useRef(false);
  const endedRef = useRef(false);

  // Decide whether to show gate — after mount only, to avoid SSR mismatch
  useEffect(() => {
    setChecked(true);
    if (isGateCompleted()) {
      setVisible(false);
      onFinish();
      return;
    }
    setVisible(true);
    defer(() => {
      setStage("landed");
      track({ type: "pageview", path: "/gate" });
    });
  }, [onFinish]);

  // Lock scroll while visible
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  const handleAnswer = useCallback((qIndex: number, option: string) => {
    const q = QUESTIONS[qIndex];
    const next = { ...answers, [q.key]: option };
    setAnswers(next);
    writeAnswers(next);
    setStep((prev) => Math.max(prev, qIndex + 2));
    defer(() => {
      track({
        type: "quiz_answer",
        label: q.key,
        meta: { q: qIndex + 1, answer: option },
      });
      setStage(`answered_q${qIndex + 1}`);
    });
    window.setTimeout(() => {
      const target = qIndex + 1 < QUESTIONS.length ? qIndex + 2 : qIndex + 1;
      const el = document.getElementById(`quiz-q-${target}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  }, [answers]);

  const finish = useCallback((reason: "button" | "video_end") => {
    // Single-fire guard using ref (state updates aren't synchronous)
    if (finishedRef.current) return;
    finishedRef.current = true;
    setTransition(true);
    defer(() => {
      track({
        type: "gate_complete",
        label: reason,
        meta: { watched: maxWatchedRef.current },
      });
      setStage("clicked_continue");
    });
    const finalAnswers = { ...answers, completedAt: Date.now() };
    writeAnswers(finalAnswers);
    completeGate();
    // Sequence: fade message (2.6s) → smooth scroll → then reveal site.
    setTimeout(() => {
      setVisible(false);
      defer(() => {
        setStage("reached_offer");
        track({ type: "reached_offer" });
      });
      onFinish();
      // Give the browser one frame to paint the newly-visible site, then smooth scroll.
      requestAnimationFrame(() => {
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
          window.scrollTo(0, 0);
        }
      });
    }, 2600);
  }, [answers, onFinish]);

  // Lightweight polling: avoids React state updates from the native timeupdate event.
  useEffect(() => {
    if (!visible) return;
    const tick = () => {
      const v = videoRef.current;
      if (!v || endedRef.current) return;
      const current = v.currentTime || 0;
      if (current > maxWatchedRef.current) maxWatchedRef.current = current;
      if (v.duration && progressBarRef.current) {
        progressBarRef.current.style.width = `${Math.min(100, (current / v.duration) * 100)}%`;
      }
      if (!questionRevealedRef.current && current >= REVEAL_AT_SEC) {
        questionRevealedRef.current = true;
        setStep((prev) => Math.max(prev, 1));
        window.setTimeout(() => {
          quizAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 120);
      }
      if (current - progressReportedRef.current >= 10) {
        progressReportedRef.current = current;
        defer(() => {
          track({
            type: "video_progress",
            meta: { watched: current, duration: v.duration || 0 },
          });
        });
      }
    };
    const interval = window.setInterval(tick, 500);
    tick();
    return () => window.clearInterval(interval);
  }, [visible]);

  const onSeeking = () => {
    const v = videoRef.current;
    if (!v) return;
    // Disabled once the video naturally ended, so it doesn't fight the ended event.
    if (endedRef.current) return;
    if (v.currentTime > maxWatchedRef.current + 1.5) {
      v.currentTime = maxWatchedRef.current;
    }
  };

  const onEnded = () => {
    endedRef.current = true;
    setVideoEnded(true);
    setIsPlaying(false);
    const v = videoRef.current;
    defer(() => {
      track({
        type: "video_end",
        meta: { watched: v?.currentTime || 0, duration: v?.duration || 0 },
      });
    });
    // Small delay so the ended event finishes bubbling before we tear down.
    setTimeout(() => finish("video_end"), 120);
  };

  const onPlay = () => {
    setIsPlaying(true);
    defer(() => {
      setStage("video_playing");
      track({ type: "video_start" });
    });
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v || endedRef.current) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  // Block keyboard shortcuts (arrows, page up/down, home/end, media keys)
  useEffect(() => {
    if (!visible) return;
    const blocked = new Set([
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      "MediaTrackNext",
      "MediaTrackPrevious",
      "MediaFastForward",
      "MediaRewind",
    ]);
    const onKey = (e: KeyboardEvent) => {
      if (blocked.has(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [visible]);

  if (!checked || !visible) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-background text-foreground">
      <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center px-4 py-6 sm:px-6 sm:py-10">
          {transition ? (
            <div className="my-auto max-w-xl rounded-3xl border border-success/40 bg-success/10 p-8 text-center opacity-100 transition-opacity duration-200">
              <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
              <p className="mt-4 text-lg font-bold text-foreground sm:text-xl">
                Perfeito! Com base nas suas respostas, preparamos a configuração ideal do robô pro
                seu negócio. Veja abaixo 👇
              </p>
            </div>
          ) : (
            <div className="w-full opacity-100 transition-opacity duration-200">
              <h1 className="fluid-h2 text-center font-extrabold tracking-tight">
                Assista até o final para{" "}
                <span className="text-gradient">liberar seu acesso</span>
              </h1>
              <p className="mt-2 text-center text-sm text-muted-foreground sm:text-base">
                Poucos minutos que podem mudar como você vende para sempre.
              </p>

              <div className="glass mt-6 overflow-hidden rounded-2xl p-1.5 shadow-[var(--shadow-elegant)] sm:mt-8">
                <div
                  className="relative overflow-hidden rounded-xl bg-black"
                  onContextMenu={(e) => e.preventDefault()}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <video
                    ref={videoRef}
                    src={videoAsset.url}
                    playsInline
                    preload="auto"
                    poster=""
                    disablePictureInPicture
                    disableRemotePlayback
                    controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
                    onSeeking={onSeeking}
                    onEnded={onEnded}
                    onPlay={onPlay}
                    onPause={() => setIsPlaying(false)}
                    onClick={togglePlay}
                    onRateChange={() => {
                      const v = videoRef.current;
                      if (v && v.playbackRate !== 1) v.playbackRate = 1;
                    }}
                    className="block h-auto w-full select-none bg-black"
                    style={{ pointerEvents: "auto" }}
                  />
                  {/* Invisible overlay to block right-click / long-press UI on the video area */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    aria-hidden="true"
                  />
                  {/* Custom play/pause button (only user control) */}
                  {!videoEnded && (
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
                      className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                        isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
                      } bg-black/25`}
                    >
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-black shadow-2xl sm:h-20 sm:w-20">
                        {isPlaying ? (
                          <Pause className="h-8 w-8" fill="currentColor" />
                        ) : (
                          <Play className="ml-1 h-8 w-8" fill="currentColor" />
                        )}
                      </span>
                    </button>
                  )}
                  {/* Non-interactive progress bar — purely decorative */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-white/10">
                    <div
                      ref={progressBarRef}
                      className="h-full transition-all duration-200"
                      style={{
                        width: "0%",
                        background: "var(--gradient-cta)",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div ref={quizAnchorRef} className="mt-8 space-y-5 sm:mt-10">
                {step > 0 && (
                  <div className="mx-auto flex max-w-md items-center justify-center gap-2">
                    {QUESTIONS.map((_, i) => {
                      const active = step > i;
                      const done = QUESTIONS[i] && answers[QUESTIONS[i].key];
                      return (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full transition-all ${
                            done
                              ? "bg-success"
                              : active
                              ? "bg-gradient-to-r from-[oklch(0.65_0.27_300)] to-[oklch(0.74_0.22_50)]"
                              : "bg-white/10"
                          }`}
                        />
                      );
                    })}
                  </div>
                )}
                  {QUESTIONS.slice(0, step).map((q, i) => (
                    <QuizQuestion
                      key={q.key}
                      q={q}
                      index={i}
                      selected={answers[q.key]}
                      onAnswer={handleAnswer}
                    />
                  ))}

                {step >= 3 && answers.goal && (
                  <button
                    onClick={() => finish("button")}
                    className="group mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold leading-tight text-cta-foreground shadow-[var(--shadow-cta)] transition-transform duration-150 hover:scale-[1.02]"
                    style={{ background: "var(--gradient-cta)" }}
                  >
                    <span>Ver minha oferta personalizada</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                )}

                {step === 0 && (
                  <p className="text-center text-xs text-muted-foreground">
                    As perguntas vão liberar automaticamente enquanto o vídeo toca.
                  </p>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

const QuizQuestion = memo(function QuizQuestion({
  q,
  index,
  selected,
  onAnswer,
}: {
  q: QDef;
  index: number;
  selected: string | null;
  onAnswer: (qIndex: number, option: string) => void;
}) {
  return (
    <div
      id={`quiz-q-${index + 1}`}
      className="glass rounded-2xl p-5 opacity-100 shadow-[var(--shadow-elegant)] ring-1 ring-white/10 transition-opacity duration-200 sm:p-7"
    >
      <p className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[oklch(0.65_0.27_300/0.25)] to-[oklch(0.74_0.22_50/0.25)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground/90 ring-1 ring-white/10">
        Pergunta {index + 1} de {QUESTIONS.length}
      </p>
      <h3 className="mt-3 text-lg font-extrabold leading-snug text-foreground sm:text-xl">
        {q.label}
      </h3>
      <div className="mt-5 grid gap-3">
        {q.options.map((opt) => {
          const isSelected = selected === opt;
          const emojiMatch = opt.match(/^(\p{Extended_Pictographic}+)\s*/u);
          const emoji = emojiMatch ? emojiMatch[1] : "";
          const rest = emoji ? opt.slice(emojiMatch![0].length) : opt;
          return (
            <button
              key={opt}
              onClick={() => onAnswer(index, opt)}
              className={`group relative flex w-full items-center gap-3 rounded-xl border-2 px-4 py-4 text-left text-base font-semibold leading-snug transition-colors duration-150 sm:text-base ${
                isSelected
                  ? "border-success bg-gradient-to-r from-success/25 to-success/10 text-foreground shadow-[0_0_24px_-6px_oklch(0.78_0.2_155/0.7)]"
                  : "border-white/10 bg-white/[0.04] text-foreground/90 hover:border-[oklch(0.65_0.27_300/0.6)] hover:bg-gradient-to-r hover:from-[oklch(0.65_0.27_300/0.12)] hover:to-[oklch(0.74_0.22_50/0.08)]"
              }`}
            >
              {emoji && <span className="text-2xl leading-none sm:text-3xl">{emoji}</span>}
              <span className="flex-1">{rest || opt}</span>
              {isSelected && (
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});
