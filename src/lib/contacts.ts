import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Contact = {
  code: string;
  name: string;
  phone: string;
  createdAt: number;
};

export type Identity = { code: string; name: string; phone: string };

const IDENTITY_KEY = "rv_identity_v1";

export function normalizePhone(p: string) {
  return p.replace(/[^\d+]/g, "");
}

function shortCode(): string {
  const s = "abcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 7; i++) out += s[Math.floor(Math.random() * s.length)];
  return out;
}

function mapContactRow(r: any): Contact {
  return {
    code: r.code,
    name: r.name,
    phone: r.phone,
    createdAt: new Date(r.created_at).getTime(),
  };
}

export async function readContacts(): Promise<Contact[]> {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[contacts] erro ao buscar contatos:", error);
    return [];
  }
  return (data || []).map(mapContactRow);
}

export async function findContactByPhone(phone: string): Promise<Contact | undefined> {
  const norm = normalizePhone(phone);
  const list = await readContacts();
  return list.find((c) => normalizePhone(c.phone) === norm);
}

export async function findContactByCode(code: string): Promise<Contact | null> {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("code", code)
    .maybeSingle();
  if (error || !data) return null;
  return mapContactRow(data);
}

export async function upsertContact(name: string, phone: string): Promise<Contact> {
  const existing = await findContactByPhone(phone);
  if (existing) return existing;

  const c: Contact = {
    code: shortCode(),
    name: name.trim(),
    phone: phone.trim(),
    createdAt: Date.now(),
  };

  const { error } = await supabase.from("contacts").insert({
    code: c.code,
    name: c.name,
    phone: c.phone,
    created_at: new Date(c.createdAt).toISOString(),
  });
  if (error) console.error("[contacts] erro ao salvar contato:", error);

  return c;
}

export function buildTrackableLink(origin: string, c: Contact) {
  return `${origin.replace(/\/$/, "")}/?ref=${c.code}`;
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

/** Lê ?ref=codigo da URL, busca o contato no Supabase, e salva a identidade localmente neste navegador. */
export async function captureIdentityFromURL() {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const ref = url.searchParams.get("ref");
    if (!ref) return;
    const contact = await findContactByCode(ref);
    if (contact) {
      saveIdentity({ code: contact.code, name: contact.name, phone: contact.phone });
    }
  } catch {
    // silencioso — não deve travar o carregamento do site
  }
}

const POLL_MS = 4000;

export function useContacts(): Contact[] {
  const [list, setList] = useState<Contact[]>([]);

  const refetch = useCallback(() => {
    readContacts().then(setList);
  }, []);

  useEffect(() => {
    refetch();
    const interval = setInterval(refetch, POLL_MS);
    return () => clearInterval(interval);
  }, [refetch]);

  return list;
}
