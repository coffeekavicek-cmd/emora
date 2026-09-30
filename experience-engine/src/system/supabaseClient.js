import { createClient } from '@supabase/supabase-js';

const url=String(import.meta.env.VITE_SUPABASE_URL||'').trim();
const publishableKey=String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||'').trim();

export const supabaseConfigured=Boolean(url&&publishableKey);

export const supabase=supabaseConfigured
  ? createClient(url,publishableKey,{
      auth:{
        persistSession:true,
        autoRefreshToken:true,
        detectSessionInUrl:true,
      },
    })
  : null;

export function requireSupabase(){
  if(!supabase)throw new Error('EMORA cloud is not configured on this deployment.');
  return supabase;
}
