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
