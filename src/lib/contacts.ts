import { useEffect, useState } from "react";

export type Contact = {
  code: string;
  name: string;
  phone: string;
  createdAt: number;
};

const KEY = "rv_contacts_v1";
const EVENT = "rv-contacts-changed";
const IDENTITY_KEY = "rv_identity_v1";

export type Identity = { code: string; name: string; phone: string };

function b64urlEncode(s: string) {
  const b64 = typeof window === "undefined"
    ? Buffer.from(s, "utf-8").toString("base64")
    : btoa(unescape(encodeURIComponent(s)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function b64urlDecode(s: string) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  try {
    if (typeof window === "undefined") return Buffer.from(b64, "base64").toString("utf-8");
    return decodeURIComponent(escape(atob(b64)));
  } catch {
    return "";
  }
}

export function normalizePhone(p: string) {
  return p.replace(/[^\d+]/g, "");
}

function shortCode(): string {
  const s = "abcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 7; i++) out += s[Math.floor(Math.random() * s.length)];
  return out;
}

export function readContacts(): Contact[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function writeContacts(list: Contact[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function findContactByPhone(phone: string): Contact | undefined {
  const norm = normalizePhone(phone);
  return readContacts().find((c) => normalizePhone(c.phone) === norm);
}

export function upsertContact(name: string, phone: string): Contact {
  const existing = findContactByPhone(phone);
  if (existing) return existing;
  const c: Contact = {
    code: shortCode(),
    name: name.trim(),
    phone: phone.trim(),
    createdAt: Date.now(),
  };
  writeContacts([c, ...readContacts()]);
  return c;
}

export function encodeRef(c: Contact): string {
  return b64urlEncode(JSON.stringify({ c: c.code, n: c.name, p: c.phone }));
}

export function buildTrackableLink(origin: string, c: Contact) {
  return `${origin.replace(/\/$/, "")}/?ref=${encodeRef(c)}`;
}

export function decodeRef(raw: string): Identity | null {
  if (!raw) return null;
  const decoded = b64urlDecode(raw);
  if (!decoded) return null;
  try {
    const obj = JSON.parse(decoded);
    if (obj && typeof obj.c === "string" && typeof obj.n === "string" && typeof obj.p === "string") {
      return { code: obj.c, name: obj.n, phone: obj.p };
    }
  } catch {}
  return null;
}

export function readIdentity(): Identity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(IDENTITY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function saveIdentity(id: Identity) {
  localStorage.setItem(IDENTITY_KEY, JSON.stringify(id));
}

/** Reads ?ref= from URL, decodes, persists to localStorage. Idempotent. */
export function captureIdentityFromURL() {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const ref = url.searchParams.get("ref");
    if (!ref) return;
    const id = decodeRef(ref);
    if (id) saveIdentity(id);
  } catch {}
}

export function useContacts(): Contact[] {
  const [list, setList] = useState<Contact[]>([]);
  useEffect(() => {
    setList(readContacts());
    const h = () => setList(readContacts());
    window.addEventListener(EVENT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVENT, h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return list;
}