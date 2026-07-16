import { useEffect, useState } from "react";

export type QuizAnswers = {
  business: string | null; // Q1
  ads: string | null; // Q2
  goal: string | null; // Q3
  completedAt: number | null;
};

const KEY = "rv_quiz_answers_v1";
const GATE_KEY = "rv_gate_completed_v1";
const EVENT = "rv-quiz-changed";

export const EMPTY: QuizAnswers = {
  business: null,
  ads: null,
  goal: null,
  completedAt: null,
};

export function readAnswers(): QuizAnswers {
  if (typeof window === "undefined") return EMPTY;
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return EMPTY;
  }
}

export function writeAnswers(a: QuizAnswers) {
  localStorage.setItem(KEY, JSON.stringify(a));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function isGateCompleted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GATE_KEY) === "1";
}

export function completeGate() {
  localStorage.setItem(GATE_KEY, "1");
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useQuizAnswers(): QuizAnswers {
  const [a, setA] = useState<QuizAnswers>(EMPTY);
  useEffect(() => {
    setA(readAnswers());
    const h = () => setA(readAnswers());
    window.addEventListener(EVENT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVENT, h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return a;
}
