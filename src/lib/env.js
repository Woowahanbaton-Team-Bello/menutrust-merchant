const requiredClientEnv = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
}

Object.entries(requiredClientEnv).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable for ${key}.`)
  }
})

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  appBaseUrl: import.meta.env.VITE_APP_BASE_URL || '',
  supabaseAnonKey: requiredClientEnv.supabaseAnonKey,
  supabaseUrl: requiredClientEnv.supabaseUrl,
}
