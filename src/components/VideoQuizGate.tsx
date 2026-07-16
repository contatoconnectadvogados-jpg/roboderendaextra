import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import videoAsset from "@/assets/vsl-robovendas.mp4.asset.json";
import {
  EMPTY,
  completeGate,
  isGateCompleted,
  readAnswers,
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

const REVEAL_AT_SEC = 60;

export function VideoQuizGate({ onFinish }: { onFinish: () => void }) {
  const [visible, setVisible] = useState(false); // hidden during SSR/initial paint
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY);
  const [step, setStep] = useState(0); // number of questions revealed (0..3)
  const [transition, setTransition] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const quizAnchorRef = useRef<HTMLDivElement | null>(null);
  const maxWatchedRef = useRef(0);
  const progressReportedRef = useRef(0);

  // Decide whether to show gate — after mount only, to avoid SSR mismatch
  useEffect(() => {
    setChecked(true);
    if (isGateCompleted()) {
      setVisible(false);
      onFinish();
      return;
    }
    setVisible(true);
    setStage("landed");
    track({ type: "pageview", path: "/gate" });
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

  const handleAnswer = (qIndex: number, option: string) => {
    const q = QUESTIONS[qIndex];
    const next = { ...answers, [q.key]: option };
    setAnswers(next);
    writeAnswers(next);
    track({
      type: "quiz_answer",
      label: q.key,
      meta: { q: qIndex + 1, answer: option },
    });
    setStage(`answered_q${qIndex + 1}`);
    setStep(Math.max(step, qIndex + 1));
    setTimeout(() => {
      const el = document.getElementById(`quiz-q-${qIndex + 1}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const finish = (reason: "button" | "video_end") => {
    if (transition) return;
    setTransition(true);
    track({
      type: "gate_complete",
      label: reason,
      meta: { watched: maxWatchedRef.current },
    });
    setStage("clicked_continue");
    const finalAnswers = { ...answers, completedAt: Date.now() };
    writeAnswers(finalAnswers);
    completeGate();
    setTimeout(() => {
      setVisible(false);
      setStage("reached_offer");
      track({ type: "reached_offer" });
      onFinish();
    }, 2600);
  };

  // Video handlers
  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.currentTime > maxWatchedRef.current) {
      maxWatchedRef.current = v.currentTime;
    }
    if (step === 0 && v.currentTime >= REVEAL_AT_SEC) {
      setStep(1);
      setTimeout(() => {
        quizAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 120);
    }
    // Progress ping every ~10s
    if (v.currentTime - progressReportedRef.current >= 10) {
      progressReportedRef.current = v.currentTime;
      track({
        type: "video_progress",
        meta: { watched: v.currentTime, duration: v.duration || 0 },
      });
    }
  };

  const onSeeking = () => {
    const v = videoRef.current;
    if (!v) return;
    // Prevent forward seek beyond watched
    if (v.currentTime > maxWatchedRef.current + 0.5) {
      v.currentTime = maxWatchedRef.current;
    }
  };

  const onEnded = () => {
    const v = videoRef.current;
    track({
      type: "video_end",
      meta: { watched: v?.currentTime || 0, duration: v?.duration || 0 },
    });
    finish("video_end");
  };

  const onPlay = () => {
    setStage("video_playing");
    track({ type: "video_start" });
  };

  if (!checked || !visible) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-background text-foreground">
      <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center px-4 py-6 sm:px-6 sm:py-10">
        <AnimatePresence>
          {transition ? (
            <motion.div
              key="transition"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="my-auto max-w-xl rounded-3xl border border-success/40 bg-success/10 p-8 text-center"
            >
              <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
              <p className="mt-4 text-lg font-bold text-foreground sm:text-xl">
                Perfeito! Com base nas suas respostas, preparamos a configuração ideal do robô pro
                seu negócio. Veja abaixo 👇
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <h1 className="fluid-h2 text-center font-extrabold tracking-tight">
                Assista até o final para{" "}
                <span className="text-gradient">liberar seu acesso</span>
              </h1>
              <p className="mt-2 text-center text-sm text-muted-foreground sm:text-base">
                Poucos minutos que podem mudar como você vende para sempre.
              </p>

              <div className="glass mt-6 overflow-hidden rounded-2xl p-1.5 shadow-[var(--shadow-elegant)] sm:mt-8">
                <video
                  ref={videoRef}
                  src={videoAsset.url}
                  controls
                  controlsList="nodownload noplaybackrate noremoteplayback"
                  disablePictureInPicture
                  playsInline
                  onTimeUpdate={onTimeUpdate}
                  onSeeking={onSeeking}
                  onEnded={onEnded}
                  onPlay={onPlay}
                  className="block h-auto w-full rounded-xl bg-black"
                />
              </div>

              <div ref={quizAnchorRef} className="mt-8 space-y-5 sm:mt-10">
                <AnimatePresence>
                  {QUESTIONS.slice(0, step).map((q, i) => (
                    <motion.div
                      key={q.key}
                      id={`quiz-q-${i + 1}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="glass rounded-2xl p-5 sm:p-6"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Pergunta {i + 1} de 3
                      </p>
                      <h3 className="mt-1.5 text-base font-bold text-foreground sm:text-lg">
                        {q.label}
                      </h3>
                      <div className="mt-4 grid gap-2.5">
                        {q.options.map((opt) => {
                          const selected = answers[q.key] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handleAnswer(i, opt)}
                              className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium leading-snug transition-all ${
                                selected
                                  ? "border-success/60 bg-success/15 text-foreground"
                                  : "border-white/10 bg-white/[0.03] text-foreground/85 hover:border-white/20 hover:bg-white/[0.06]"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {step >= 3 && answers.goal && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => finish("button")}
                    className="group mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold leading-tight text-cta-foreground shadow-[var(--shadow-cta)] transition-transform hover:scale-[1.02]"
                    style={{ background: "var(--gradient-cta)" }}
                  >
                    <span>Ver minha oferta personalizada</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                )}

                {step === 0 && (
                  <p className="text-center text-xs text-muted-foreground">
                    As perguntas vão liberar automaticamente enquanto o vídeo toca.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
