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
  const response = await apiFetch(env.storeRegistrationPath || '/owner/onboarding', {
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

async function readApiResponse(response, fallbackMessage) {
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.error?.message || fallbackMessage)
  }

  return payload?.data ?? payload
}

export async function createMenuBoard({ contentType, fileName, storeId, title = '메뉴판' }) {
  const response = await apiFetch(`/stores/${storeId}/menu-boards`, {
    body: JSON.stringify({
      contentType,
      fileName,
      title,
    }),
    method: 'POST',
  })

  return readApiResponse(response, '메뉴 보드를 생성하지 못했습니다.')
}

export async function markMenuBoardImageUploaded({ bucket, contentType, menuBoardId, path }) {
  const response = await apiFetch(`/menu-boards/${menuBoardId}/image`, {
    body: JSON.stringify({
      bucket,
      contentType,
      path,
    }),
    method: 'PATCH',
  })

  return readApiResponse(response, '이미지 업로드 완료를 반영하지 못했습니다.')
}

export async function runMockFullAnalysis({ menuBoardId, overwriteExisting = true }) {
  const response = await apiFetch(`/menu-boards/${menuBoardId}/mock-analysis-jobs`, {
    body: JSON.stringify({ overwriteExisting }),
    method: 'POST',
  })

  return readApiResponse(response, '목데이터 분석을 시작하지 못했습니다.')
}

export async function fetchMenuBoardDetail(menuBoardId) {
  const response = await apiFetch(`/menu-boards/${menuBoardId}`)

  return readApiResponse(response, '메뉴판 상세 정보를 불러오지 못했습니다.')
}

export async function saveMenuItems({ items, menuBoardId, confirm = true }) {
  const response = await apiFetch(`/menu-boards/${menuBoardId}/menu-items`, {
    body: JSON.stringify({
      confirm,
      items,
    }),
    method: 'PUT',
  })

  return readApiResponse(response, '메뉴 정보를 저장하지 못했습니다.')
}

export async function saveIngredients({ items, menuBoardId, confirm = true }) {
  const response = await apiFetch(`/menu-boards/${menuBoardId}/ingredients`, {
    body: JSON.stringify({
      confirm,
      items,
    }),
    method: 'PUT',
  })

  return readApiResponse(response, '재료 정보를 저장하지 못했습니다.')
}

export async function runAllergenAnalysis({
  menuBoardId,
  overwriteExisting = true,
  autoConfirm = false,
  strategy = 'rule_only',
}) {
  const response = await apiFetch(`/menu-boards/${menuBoardId}/allergen-analysis-jobs`, {
    body: JSON.stringify({
      autoConfirm,
      overwriteExisting,
      strategy,
    }),
    method: 'POST',
  })

  return readApiResponse(response, '알레르겐 분석을 시작하지 못했습니다.')
}

export async function saveAllergens({ items, menuBoardId, confirm = true }) {
  const response = await apiFetch(`/menu-boards/${menuBoardId}/allergens`, {
    body: JSON.stringify({
      confirm,
      items,
    }),
    method: 'PUT',
  })

  return readApiResponse(response, '알레르겐 정보를 저장하지 못했습니다.')
}

export async function markBoardAllergenReview({ menuBoardId, reviewStatus = 'reviewed' }) {
  const response = await apiFetch(`/menu-boards/${menuBoardId}/allergen-review`, {
    body: JSON.stringify({
      reviewStatus,
    }),
    method: 'PATCH',
  })

  return readApiResponse(response, '알레르겐 검수 상태를 반영하지 못했습니다.')
}

export async function publishMenuBoard({ menuBoardId, publicBaseUrl }) {
  const response = await apiFetch(`/menu-boards/${menuBoardId}/publications`, {
    body: JSON.stringify({
      ...(publicBaseUrl ? { publicBaseUrl } : {}),
    }),
    method: 'POST',
  })

  return readApiResponse(response, '메뉴판을 발행하지 못했습니다.')
}
