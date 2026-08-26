const SUPABASE_URL = "https://pdwwbrryaudbenswrwql.supabase.co";
const SUPABASE_KEY = "sb_publishable_zLLO8RP38I0ZDW1UfvgN1Q_pUQxU8-D";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.supabase = supabaseClient;

console.log("Supabase client initialized:", window.supabase.client);