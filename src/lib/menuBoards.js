function pickFirstString(values, fallback = '') {
  const match = values.find((value) => typeof value === 'string' && value.trim())

  return match ? match.trim() : fallback
}

function pickFirstArray(values) {
  return values.find(Array.isArray) || []
}

function formatUpdatedAt(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function getMenuCount(board) {
  const menus = pickFirstArray([
    board?.menus,
    board?.menuItems,
    board?.items,
    board?.entries,
  ])

  if (menus.length > 0) {
    return menus.length
  }

  const countCandidates = [
    board?.menuCount,
    board?.menusCount,
    board?.itemCount,
    board?.itemsCount,
  ]

  const count = countCandidates.find((value) => Number.isFinite(value))

  return count || 0
}

function getStatusLabel(board) {
  const status = pickFirstString([
    board?.status,
    board?.publishStatus,
    board?.state,
  ])

  if (!status) return '연결됨'

  if (['published', 'live', 'active'].includes(status.toLowerCase())) {
    return '발행중'
  }

  if (['draft', 'pending'].includes(status.toLowerCase())) {
    return '작성중'
  }

  return status
}

function pickFirstNumber(values, fallback = 0) {
  const match = values.find((value) => Number.isFinite(value))

  if (typeof match === 'number') {
    return match
  }

  const stringMatch = values.find((value) => typeof value === 'string' && value.trim())

  if (!stringMatch) {
    return fallback
  }

  const normalized = Number(stringMatch.replace(/[^0-9.-]/g, ''))

  return Number.isFinite(normalized) ? normalized : fallback
}

function extractArray(values) {
  return values.find(Array.isArray) || []
}

function normalizeAllergenStatus(status) {
  const normalized = typeof status === 'string' ? status.trim().toLowerCase() : ''

  if (!normalized) {
    return 'confirmed'
  }

  if (['confirmed', 'contains', 'present', 'detected', 'included'].includes(normalized)) {
    return 'confirmed'
  }

  if (['possible', 'maycontain', 'may_contain', 'cross_contact', 'crosscontact', 'trace'].includes(normalized)) {
    return 'possible'
  }

  if (['free', 'none', 'absent', 'not_detected'].includes(normalized)) {
    return ''
  }

  return 'confirmed'
}

function normalizeIngredient(ingredient) {
  if (typeof ingredient === 'string') {
    return {
      checked: true,
      name: ingredient.trim(),
    }
  }

  if (!ingredient || typeof ingredient !== 'object') {
    return null
  }

  const name = pickFirstString([
    ingredient.name,
    ingredient.ingredientName,
    ingredient.ingredient_name,
    ingredient.label,
    ingredient.text,
  ])

  if (!name) {
    return null
  }

  const explicitChecked = [
    ingredient.checked,
    ingredient.selected,
    ingredient.included,
    ingredient.isIncluded,
    ingredient.enabled,
  ].find((value) => typeof value === 'boolean')

  const explicitUnchecked = [
    ingredient.unchecked,
    ingredient.excluded,
    ingredient.isExcluded,
    ingredient.disabled,
  ].find((value) => typeof value === 'boolean')

  return {
    checked: explicitChecked ?? (explicitUnchecked != null ? !explicitUnchecked : true),
    name,
  }
}

function normalizeAllergen(allergen) {
  if (typeof allergen === 'string') {
    return {
      name: allergen.trim(),
      status: 'confirmed',
    }
  }

  if (!allergen || typeof allergen !== 'object') {
    return null
  }

  const name = pickFirstString([
    allergen.name,
    allergen.allergenName,
    allergen.allergen_name,
    allergen.label,
    allergen.text,
  ])

  if (!name) {
    return null
  }

  const status = normalizeAllergenStatus(
    pickFirstString([
      allergen.status,
      allergen.classification,
      allergen.type,
      allergen.level,
    ]),
  )

  if (!status) {
    return null
  }

  return {
    name,
    reason: pickFirstString([
      allergen.reason,
      allergen.description,
      allergen.note,
    ]),
    status,
  }
}

function extractIngredientNames(menu) {
  const ingredientNames = extractArray([
    menu?.ingredientNames,
    menu?.ingredient_names,
  ])

  return ingredientNames.map((name) => normalizeIngredient(name)).filter(Boolean)
}

function extractIngredients(menu) {
  const normalizedIngredients = extractArray([
    menu?.ingredients,
    menu?.ingredientCandidates,
    menu?.ingredient_candidates,
    menu?.menuIngredients,
    menu?.menu_ingredients,
  ])
    .map((ingredient) => normalizeIngredient(ingredient))
    .filter(Boolean)

  if (normalizedIngredients.length > 0) {
    return normalizedIngredients
  }

  return extractIngredientNames(menu)
}

function extractAllergens(menu) {
  return extractArray([
    menu?.allergens,
    menu?.allergenCandidates,
    menu?.allergen_candidates,
    menu?.menuAllergens,
    menu?.menu_allergens,
    menu?.detectedAllergens,
  ])
    .map((allergen) => normalizeAllergen(allergen))
    .filter(Boolean)
}

function extractMenus(board) {
  return extractArray([
    board?.menus,
    board?.menuItems,
    board?.menu_items,
    board?.items,
    board?.entries,
    board?.data?.menus,
    board?.data?.items,
  ])
}

export function getMenuBoardId(board, index = 0) {
  return pickFirstString([board?.id, board?.menuBoardId, board?.menu_board_id], `menu-board-${index}`)
}

export function extractMenuBoards(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  const candidates = [
    payload?.data,
    payload?.data?.menuBoards,
    payload?.data?.items,
    payload?.menuBoards,
    payload?.items,
    payload?.result?.menuBoards,
  ]

  const boards = candidates.find(Array.isArray)

  return boards || []
}

export function summarizeMenuBoard(board, index) {
  const title = pickFirstString([
    board?.name,
    board?.title,
    board?.storeName,
    board?.store_name,
  ], `메뉴판 ${index + 1}`)
  const menuCount = getMenuCount(board)
  const updatedAt = formatUpdatedAt(
    pickFirstString([board?.updatedAt, board?.updated_at, board?.publishedAt, board?.published_at]),
  )

  const metaParts = []

  if (menuCount > 0) {
    metaParts.push(`메뉴 ${menuCount}개`)
  }

  if (updatedAt) {
    metaParts.push(`최근 수정 ${updatedAt}`)
  }

  return {
    id: getMenuBoardId(board, index),
    meta: metaParts.join(' · ') || '연결된 메뉴판',
    statusLabel: getStatusLabel(board),
    title,
  }
}

export function extractMenuBoardDetail(payload) {
  if (Array.isArray(payload)) {
    return payload[0] || null
  }

  const candidates = [
    payload?.data?.menuBoard,
    payload?.data?.item,
    payload?.data,
    payload?.menuBoard,
    payload?.item,
    payload?.result,
    payload,
  ]

  return candidates.find((candidate) => candidate && typeof candidate === 'object') || null
}

export function extractEditableItems(board) {
  const menus = extractMenus(board)

  return menus.map((menu, index) => {
    const ingredients = extractIngredients(menu)
    const allergens = extractAllergens(menu)

    return {
      allergenDraft: '',
      allergens,
      category: pickFirstString([menu?.category, menu?.group, menu?.section], '기타'),
      draft: '',
      id: pickFirstString([menu?.id, menu?.menuId, menu?.menu_id], `menu-${index}`),
      ingredients,
      name: pickFirstString([menu?.name, menu?.menuName, menu?.menu_name], `메뉴 ${index + 1}`),
      price: pickFirstNumber([menu?.price, menu?.amount, menu?.cost], 0),
      unchecked: ingredients.filter((ingredient) => !ingredient.checked).map((ingredient) => ingredient.name),
    }
  })
}
