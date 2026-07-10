import { env } from './env.js'
import { supabase } from './supabase.js'

function createApiUrl(path = '') {
  if (!env.apiBaseUrl) {
    throw new Error('Missing required environment variable for apiBaseUrl.')
  }

  const baseUrl = env.apiBaseUrl.replace(/\/$/, '')
  const normalizedPath = path.replace(/^\//, '')

  return normalizedPath ? `${baseUrl}/${normalizedPath}` : baseUrl
}

export async function apiFetch(path, options = {}) {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  const headers = new Headers(options.headers)

  if (data.session?.access_token) {
    headers.set('Authorization', `Bearer ${data.session.access_token}`)
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(createApiUrl(path), {
    ...options,
    headers,
  })
}

export async function registerStore({ storeName }) {
  if (!env.storeRegistrationPath) {
    throw new Error('가게 등록 API 경로가 설정되지 않았습니다. `VITE_STORE_REGISTRATION_PATH`를 설정해주세요.')
  }

  const response = await apiFetch(env.storeRegistrationPath, {
    body: JSON.stringify({
      [env.storeRegistrationNameField]: storeName,
    }),
    method: 'POST',
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.error?.message || '가게 등록에 실패했습니다.')
  }

  return payload
}
