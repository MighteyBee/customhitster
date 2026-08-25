const SUPABASE_URL = "https://pdwwbrryaudbenswrwql.supabase.co";
const SUPABASE_KEY = "sb_publishable_zLLO8RP38I0ZDW1UfvgN1Q_pUQxU8-D";

if (typeof window.supabase === 'undefined') {
    window.supabase = window.supabase || {};
    window.supabase.client = window.Supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

console.log("Supabase client initialized:", window.supabase.client);