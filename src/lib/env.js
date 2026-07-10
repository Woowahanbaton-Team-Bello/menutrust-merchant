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
  qrImageSavePath: import.meta.env.VITE_QR_IMAGE_SAVE_PATH || '',
  storeRegistrationNameField: import.meta.env.VITE_STORE_REGISTRATION_NAME_FIELD || 'storeName',
  storeRegistrationPath: import.meta.env.VITE_STORE_REGISTRATION_PATH || '',
  supabaseAnonKey: requiredClientEnv.supabaseAnonKey,
  supabaseUrl: requiredClientEnv.supabaseUrl,
}
