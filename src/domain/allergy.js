export const ALLERGY_STATUS = Object.freeze({
  CONTAINS: 'contains',
  MAY_CONTAIN: 'mayContain',
  FREE: 'free',
})

export const ALLERGY_STATUS_META = Object.freeze({
  [ALLERGY_STATUS.CONTAINS]: {
    label: '확정',
    description: '선택한 알레르겐이 원재료로 사용된 메뉴입니다.',
  },
  [ALLERGY_STATUS.MAY_CONTAIN]: {
    label: '혼입 가능',
    description: '조리 과정이나 공용 도구로 섞여 들어갈 수 있습니다.',
  },
  [ALLERGY_STATUS.FREE]: {
    label: '없음',
    description: '선택한 알레르겐이 포함되지 않은 것으로 분류됩니다.',
  },
})

export const ALLERGENS = Object.freeze([
  { id: 'egg', label: '알류(가금류)' },
  { id: 'milk', label: '우유' },
  { id: 'buckwheat', label: '메밀' },
  { id: 'peanut', label: '땅콩' },
  { id: 'soybean', label: '대두' },
  { id: 'wheat', label: '밀' },
  { id: 'mackerel', label: '고등어' },
  { id: 'crab', label: '게' },
  { id: 'shrimp', label: '새우' },
  { id: 'pork', label: '돼지고기' },
  { id: 'peach', label: '복숭아' },
  { id: 'tomato', label: '토마토' },
  { id: 'sulfite', label: '아황산류' },
  { id: 'walnut', label: '호두' },
  { id: 'chicken', label: '닭고기' },
  { id: 'beef', label: '쇠고기' },
  { id: 'squid', label: '오징어' },
  { id: 'shellfish', label: '조개류' },
  { id: 'oyster', label: '굴' },
  { id: 'abalone', label: '전복' },
  { id: 'mussel', label: '홍합' },
  { id: 'pineNut', label: '잣' },
])
