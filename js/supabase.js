const SUPABASE_URL = "https://pdwwbrryaudbenswrwql.supabase.co";
const SUPABASE_KEY = "sb_publishable_zLLO8RP38I0ZDW1UfvgN1Q_pUQxU8-D";

const supabase = window.Supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.supabase = supabase;

console.log("Supabase client initialized:", window.supabase.client);