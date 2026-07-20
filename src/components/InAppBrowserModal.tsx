import { useEffect, useState } from "react";
import { Copy, Check as CheckIcon, X, ExternalLink } from "lucide-react";

export function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || (navigator as any).vendor || "";
  return /TikTok|musical_ly|BytedanceWebview|Instagram|FBAN|FBAV|FB_IAB|Line\/|KAKAOTALK|Snapchat|Twitter/i.test(ua);
}

function detectOS(): "android" | "ios" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  if (/Android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  return "other";
}

/** Attempts to open the URL in the OS default browser. Returns true if it tried. */
export function tryOpenExternal(url: string): boolean {
  const os = detectOS();
  if (os === "android") {
    const noProto = url.replace(/^https?:\/\//, "");
    // Intent forces Chrome; falls back to any browser if Chrome absent.
    window.location.href = `intent://${noProto}#Intent;scheme=https;package=com.android.chrome;end`;
    return true;
  }
  // iOS cannot be forced reliably; caller shows the manual instructions modal.
  return false;
}

export function InAppBrowserModal({ url, onClose }: { url: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const os = detectOS();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older webviews
      const t = document.createElement("textarea");
      t.value = url;
      document.body.appendChild(t);
      t.select();
      try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
      document.body.removeChild(t);
    }
  };

  const instruction =
    os === "ios"
      ? "Toque no ícone de compartilhar (□↑) na barra inferior e selecione “Abrir no Safari”."
      : "Toque nos três pontinhos (⋮) no canto superior direito e selecione “Abrir no navegador”.";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-background p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-cta" />
          <h3 className="text-base font-bold text-foreground">Abra no seu navegador</h3>
        </div>
        <p className="mt-2 text-sm text-foreground/80">
          Para finalizar sua compra com segurança, abra este link no{" "}
          {os === "ios" ? "Safari" : "Chrome"} do seu celular.
        </p>
        <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Como fazer</p>
          <p className="mt-1 text-sm text-foreground/90">{instruction}</p>
        </div>
        <div className="mt-4 rounded-lg bg-background/60 p-3 ring-1 ring-white/10">
          <code className="block truncate text-xs text-foreground/80">{url}</code>
        </div>
        <button
          onClick={copy}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold leading-tight text-cta-foreground shadow-[var(--shadow-cta)] transition-transform hover:scale-[1.02]"
          style={{ background: "var(--gradient-cta)" }}
        >
          {copied ? (<><CheckIcon className="h-4 w-4" /> Link copiado</>) : (<><Copy className="h-4 w-4" /> Copiar link do checkout</>)}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block text-center text-xs font-semibold text-muted-foreground underline transition-colors hover:text-foreground"
        >
          Ou tentar abrir mesmo assim
        </a>
      </div>
    </div>
  );
}