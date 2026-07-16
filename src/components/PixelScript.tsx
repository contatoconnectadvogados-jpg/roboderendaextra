import { useEffect } from "react";
import { useSiteConfig } from "@/lib/site-config";
import { track } from "@/lib/analytics";
import { captureIdentityFromURL } from "@/lib/contacts";

export function PixelAndTracking() {
  const { pixelId } = useSiteConfig();

  // Inject Meta Pixel when pixelId changes
  useEffect(() => {
    if (typeof window === "undefined" || !pixelId) return;
    const w = window as any;
    if (w.fbq) {
      w.fbq("init", pixelId);
      w.fbq("track", "PageView");
      return;
    }
    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    w.fbq("init", pixelId);
    w.fbq("track", "PageView");
    /* eslint-enable */
  }, [pixelId]);

  // Track pageview + session start + heartbeat (session activity)
  useEffect(() => {
    // Capture identity from ?ref= BEFORE the first track call so events carry it.
    captureIdentityFromURL();
    track({ type: "session_start", path: window.location.pathname });
    track({ type: "pageview", path: window.location.pathname });

    const hb = window.setInterval(() => {
      if (!document.hidden) track({ type: "heartbeat" });
    }, 15_000);
    const onHide = () => track({ type: "heartbeat", label: "unload" });
    window.addEventListener("pagehide", onHide);
    window.addEventListener("beforeunload", onHide);
    return () => {
      window.clearInterval(hb);
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("beforeunload", onHide);
    };
  }, []);

  return null;
}
