import { createClient } from '@supabase/supabase-js'
import { env } from './env.js'

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
})
