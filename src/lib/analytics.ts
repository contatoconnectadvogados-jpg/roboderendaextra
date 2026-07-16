import { useEffect, useState } from "react";

export type AnalyticsEventType =
  | "pageview"
  | "click"
  | "checkout_click"
  | "video_start"
  | "video_progress"
  | "video_end"
  | "quiz_answer"
  | "stage"
  | "gate_complete"
  | "reached_offer";

export type AnalyticsEvent = {
  type: AnalyticsEventType;
  ts: number;
  path?: string;
  label?: string;
  sessionId?: string;
  meta?: Record<string, unknown>;
};

const KEY = "rv_analytics_v1";
const EVENT = "rv-analytics-changed";
const SESSION_KEY = "rv_session_id";
const MAX = 5000;

function read(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(list: AnalyticsEvent[]) {
  const trimmed = list.slice(-MAX);
  localStorage.setItem(KEY, JSON.stringify(trimmed));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      "s_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 8);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function track(ev: Omit<AnalyticsEvent, "ts" | "sessionId">) {
  if (typeof window === "undefined") return;
  const list = read();
  list.push({ ...ev, ts: Date.now(), sessionId: getSessionId() });
  write(list);

  const w = window as any;
  if (typeof w.fbq === "function") {
    if (ev.type === "checkout_click") w.fbq("track", "InitiateCheckout");
    else if (ev.type === "click") w.fbq("trackCustom", "ButtonClick", { label: ev.label });
    else if (ev.type === "pageview") w.fbq("track", "PageView");
    else if (ev.type === "quiz_answer") w.fbq("trackCustom", "QuizAnswer", ev.meta);
    else if (ev.type === "stage") w.fbq("trackCustom", "FunnelStage", { stage: ev.label });
    else if (ev.type === "gate_complete") w.fbq("trackCustom", "GateComplete");
  }
}

export function setStage(stage: string) {
  track({ type: "stage", label: stage });
}

export function clearAnalytics() {
  write([]);
}

export function useAnalytics() {
  const [list, setList] = useState<AnalyticsEvent[]>([]);
  useEffect(() => {
    setList(read());
    const h = () => setList(read());
    window.addEventListener(EVENT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVENT, h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return list;
}

export function computeMetrics(list: AnalyticsEvent[]) {
  const pageviews = list.filter((e) => e.type === "pageview").length;
  const clicks = list.filter(
    (e) => e.type === "click" || e.type === "checkout_click",
  ).length;
  const checkoutClicks = list.filter((e) => e.type === "checkout_click").length;
  const ctr = pageviews > 0 ? (clicks / pageviews) * 100 : 0;
  const checkoutCtr = pageviews > 0 ? (checkoutClicks / pageviews) * 100 : 0;
  const cpm = 0;
  return { pageviews, clicks, checkoutClicks, ctr, checkoutCtr, cpm };
}

export type VisitorRow = {
  sessionId: string;
  firstSeen: number;
  lastSeen: number;
  stage: string;
  videoWatchedSec: number;
  videoDurationSec: number;
  answers: (string | null)[];
  reachedOffer: number | null;
  checkoutClick: number | null;
};

const STAGE_ORDER = [
  "landed",
  "video_playing",
  "answered_q1",
  "answered_q2",
  "answered_q3",
  "clicked_continue",
  "reached_offer",
  "checkout_click",
];

export function computeVisitors(list: AnalyticsEvent[]): VisitorRow[] {
  const map = new Map<string, VisitorRow>();
  const rank = (s: string) => {
    const i = STAGE_ORDER.indexOf(s);
    return i < 0 ? -1 : i;
  };
  for (const ev of list) {
    const sid = ev.sessionId || "unknown";
    let row = map.get(sid);
    if (!row) {
      row = {
        sessionId: sid,
        firstSeen: ev.ts,
        lastSeen: ev.ts,
        stage: "landed",
        videoWatchedSec: 0,
        videoDurationSec: 0,
        answers: [null, null, null],
        reachedOffer: null,
        checkoutClick: null,
      };
      map.set(sid, row);
    }
    row.lastSeen = Math.max(row.lastSeen, ev.ts);
    if (ev.type === "video_progress" || ev.type === "video_end") {
      const m = (ev.meta || {}) as any;
      if (typeof m.watched === "number")
        row.videoWatchedSec = Math.max(row.videoWatchedSec, Math.round(m.watched));
      if (typeof m.duration === "number") row.videoDurationSec = Math.round(m.duration);
    }
    if (ev.type === "quiz_answer") {
      const m = (ev.meta || {}) as any;
      const idx = typeof m.q === "number" ? m.q - 1 : -1;
      if (idx >= 0 && idx < 3) row.answers[idx] = String(m.answer ?? "");
    }
    if (ev.type === "stage" && ev.label) {
      if (rank(ev.label) > rank(row.stage)) row.stage = ev.label;
    }
    if (ev.type === "reached_offer") {
      row.reachedOffer = row.reachedOffer ?? ev.ts;
      if (rank("reached_offer") > rank(row.stage)) row.stage = "reached_offer";
    }
    if (ev.type === "checkout_click") {
      row.checkoutClick = row.checkoutClick ?? ev.ts;
      row.stage = "checkout_click";
    }
  }
  return Array.from(map.values()).sort((a, b) => b.lastSeen - a.lastSeen);
}

export function computeFunnel(rows: VisitorRow[]) {
  const rank = (s: string) => STAGE_ORDER.indexOf(s);
  return STAGE_ORDER.map((s) => ({
    stage: s,
    count: rows.filter((r) => rank(r.stage) >= rank(s)).length,
  }));
}
