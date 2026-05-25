import { useEffect, useState } from "react";

export type AnalyticsEvent = {
  type: "pageview" | "click" | "checkout_click";
  ts: number;
  path?: string;
  label?: string;
};

const KEY = "rv_analytics_v1";
const EVENT = "rv-analytics-changed";
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

export function track(ev: Omit<AnalyticsEvent, "ts">) {
  if (typeof window === "undefined") return;
  const list = read();
  list.push({ ...ev, ts: Date.now() });
  write(list);

  // Meta Pixel passthrough
  const w = window as any;
  if (typeof w.fbq === "function") {
    if (ev.type === "checkout_click") w.fbq("track", "InitiateCheckout");
    else if (ev.type === "click") w.fbq("trackCustom", "ButtonClick", { label: ev.label });
    else if (ev.type === "pageview") w.fbq("track", "PageView");
  }
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
  const clicks = list.filter((e) => e.type === "click" || e.type === "checkout_click").length;
  const checkoutClicks = list.filter((e) => e.type === "checkout_click").length;
  const ctr = pageviews > 0 ? (clicks / pageviews) * 100 : 0;
  const checkoutCtr = pageviews > 0 ? (checkoutClicks / pageviews) * 100 : 0;
  // CPM placeholder (cost not tracked) — show 0 unless future spend integration
  const cpm = 0;
  return { pageviews, clicks, checkoutClicks, ctr, checkoutCtr, cpm };
}
