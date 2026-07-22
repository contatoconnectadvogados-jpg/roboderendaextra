import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nayjuukusgcubveopqlp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_4uldelunpW4bGWZkJYD7Yw_t6jNkTVg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
