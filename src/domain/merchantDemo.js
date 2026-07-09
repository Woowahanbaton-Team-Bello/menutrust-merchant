export const STEP_LABELS = Object.freeze([
  { id: 1, label: '메뉴판 업로드' },
  { id: 2, label: '재료 분석 중' },
  { id: 3, label: '재료 확인·수정' },
  { id: 4, label: '알레르겐 분석 중' },
  { id: 5, label: '알레르겐 확인·수정' },
  { id: 6, label: '메뉴판 발행' },
  { id: 7, label: 'QR 생성 완료' },
])

export const RAW_MENU = Object.freeze([
  {
    name: '쏨땀',
    price: 8000,
    category: '샐러드',
    ingredients: ['그린파파야', '건새우', '땅콩', '라임', '피쉬소스', '고추'],
    unchecked: [],
    allergens: [
      { name: '새우', status: 'confirmed' },
      { name: '고등어', status: 'confirmed' },
      { name: '땅콩', status: 'confirmed' },
    ],
  },
  {
    name: '팟타이',
    price: 11000,
    category: '누들',
    ingredients: ['쌀국수', '계란', '두부', '숙주', '땅콩', '피쉬소스', '건새우(소량)'],
    unchecked: ['건새우(소량)'],
    allergens: [
      { name: '새우', status: 'possible' },
      { name: '고등어', status: 'confirmed' },
      { name: '대두', status: 'confirmed' },
      { name: '알류(가금류)', status: 'confirmed' },
      { name: '땅콩', status: 'confirmed' },
    ],
  },
  {
    name: '팟씨유',
    price: 11000,
    category: '누들',
    ingredients: ['넓적쌀국수', '계란', '간장', '돼지고기', '브로콜리'],
    unchecked: [],
    allergens: [
      { name: '밀', status: 'confirmed' },
      { name: '대두', status: 'confirmed' },
      { name: '알류(가금류)', status: 'confirmed' },
      { name: '돼지고기', status: 'confirmed' },
    ],
  },
  {
    name: '그린커리',
    price: 13000,
    category: '커리',
    ingredients: ['코코넛밀크', '그린커리페이스트', '가지', '닭고기', '바질'],
    unchecked: [],
    allergens: [
      { name: '새우', status: 'possible' },
      { name: '닭고기', status: 'confirmed' },
    ],
  },
  {
    name: '마사만커리',
    price: 14000,
    category: '커리',
    ingredients: ['코코넛밀크', '땅콩', '감자', '쇠고기', '마사만페이스트'],
    unchecked: [],
    allergens: [
      { name: '땅콩', status: 'confirmed' },
      { name: '쇠고기', status: 'confirmed' },
    ],
  },
  {
    name: '팟카파오 무쌉',
    price: 10000,
    category: '덮밥',
    ingredients: ['다진돼지고기', '바질', '마늘', '고추', '피쉬소스', '계란후라이'],
    unchecked: [],
    allergens: [
      { name: '고등어', status: 'confirmed' },
      { name: '알류(가금류)', status: 'confirmed' },
      { name: '돼지고기', status: 'confirmed' },
    ],
  },
  {
    name: '똠얌누들',
    price: 12000,
    category: '수프',
    ingredients: ['새우', '쌀국수', '레몬그라스', '버섯', '고추페이스트'],
    unchecked: [],
    allergens: [
      { name: '새우', status: 'confirmed' },
      { name: '조개류', status: 'possible' },
    ],
  },
  {
    name: '타이 아이스티',
    price: 5000,
    category: '음료',
    ingredients: ['홍차', '연유', '우유'],
    unchecked: [],
    allergens: [
      { name: '우유', status: 'confirmed' },
    ],
  },
])
