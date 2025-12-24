// Supabase client initialization
// @see ADR-005: バックエンド連携アーキテクチャ

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In development without Supabase credentials, use mock mode
const isMockMode = !supabaseUrl || !supabaseAnonKey ||
    supabaseUrl === 'https://your-project-id.supabase.co';

if (isMockMode) {
    console.warn(
        '[CO+ Study] Supabase not configured. Running in mock mode. ' +
        'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
    );
}

// Create client with fallback for development
export const supabase: SupabaseClient = isMockMode
    ? createClient('https://placeholder.supabase.co', 'placeholder-key')
    : createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    });

export const isMockModeEnabled = isMockMode;

export default supabase;
