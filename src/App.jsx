import { useMemo, useState } from 'react'
import {
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  Image,
  Loader2,
  LogOut,
  Plus,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react'
import './App.css'
import { ALLERGENS } from './domain/allergy.js'
import { RAW_MENU, STEP_LABELS } from './domain/merchantDemo.js'

const STORE_NAME = '우아타이'
const MENU_URL = 'menutrust-demo.vercel.app/m/wooa-thai'

const allergenOptions = ALLERGENS.map((allergen) => allergen.label)

function createInitialItems() {
  return RAW_MENU.map((menu) => ({
    ...menu,
    ingredients: menu.ingredients.map((name) => ({
      name,
      checked: !menu.unchecked.includes(name),
    })),
    allergens: menu.allergens.map((allergen) => ({ ...allergen })),
    draft: '',
    allergenDraft: allergenOptions[0],
  }))
}

function formatPrice(price) {
  return `${Number(price).toLocaleString('ko-KR')}원`
}

function statusLabel(status) {
  return status === 'confirmed' ? '확정' : '혼입 가능'
}

function App() {
  const [phase, setPhase] = useState('login')
  const [step, setStep] = useState(1)
  const [items, setItems] = useState(createInitialItems)
  const [auth, setAuth] = useState({
    email: '',
    password: '',
    storeName: '',
    confirmPassword: '',
  })
  const [newMenu, setNewMenu] = useState({ name: '', price: '', category: '' })

  const itemCount = items.length
  const currentStep = useMemo(
    () => STEP_LABELS.find((item) => item.id === step),
    [step],
  )

  function updateItem(index, updater) {
    setItems((current) => current.map((item, i) => (i === index ? updater(item) : item)))
  }

  function beginFlow() {
    setPhase('flow')
    setStep(1)
  }

  function logout() {
    setPhase('login')
    setStep(1)
    setAuth({ email: '', password: '', storeName: '', confirmPassword: '' })
  }

  function addMenu() {
    const name = newMenu.name.trim()
    if (!name) return

    const price = Number(newMenu.price.replace(/[^0-9]/g, '')) || 0
    const category = newMenu.category.trim() || '기타'
    setItems((current) => [
      ...current,
      {
        name,
        price,
        category,
        ingredients: [],
        unchecked: [],
        allergens: [],
        draft: '',
        allergenDraft: allergenOptions[0],
      },
    ])
    setNewMenu({ name: '', price: '', category: '' })
  }

  if (phase === 'login' || phase === 'signup') {
    return (
      <AuthScreen
        auth={auth}
        mode={phase}
        onAuthChange={setAuth}
        onLoginMode={() => setPhase('login')}
        onSignupMode={() => setPhase('signup')}
        onSubmit={beginFlow}
      />
    )
  }

  return (
    <div className="merchant-app">
      <Sidebar
        itemCount={itemCount}
        phase={phase}
        step={step}
        onLogout={logout}
        onStepChange={(nextStep) => {
          setPhase('flow')
          setStep(nextStep)
        }}
      />

      <main className="workspace">
        {phase === 'home' ? (
          <HomeDashboard
            itemCount={itemCount}
            items={items}
            onEditMenu={() => {
              setPhase('flow')
              setStep(3)
            }}
            onRepublish={() => {
              setPhase('flow')
              setStep(6)
            }}
          />
        ) : (
          <FlowScreen
            currentStep={currentStep}
            itemCount={itemCount}
            items={items}
            newMenu={newMenu}
            step={step}
            onAddAllergen={(itemIndex) => {
              updateItem(itemIndex, (item) => {
                const remaining = allergenOptions.filter(
                  (name) => !item.allergens.some((allergen) => allergen.name === name),
                )
                const name = remaining.includes(item.allergenDraft)
                  ? item.allergenDraft
                  : remaining[0]

                if (!name) return item

                return {
                  ...item,
                  allergens: [...item.allergens, { name, status: 'possible' }],
                  allergenDraft: remaining.find((option) => option !== name) || '',
                }
              })
            }}
            onAddIngredient={(itemIndex) => {
              updateItem(itemIndex, (item) => {
                const name = item.draft.trim()
                if (!name) return item
                return {
                  ...item,
                  ingredients: [...item.ingredients, { name, checked: true }],
                  draft: '',
                }
              })
            }}
            onAddMenu={addMenu}
            onAllergenDraftChange={(itemIndex, value) => {
              updateItem(itemIndex, (item) => ({ ...item, allergenDraft: value }))
            }}
            onIngredientDraftChange={(itemIndex, value) => {
              updateItem(itemIndex, (item) => ({ ...item, draft: value }))
            }}
            onNewMenuChange={setNewMenu}
            onRemoveAllergen={(itemIndex, allergenIndex) => {
              updateItem(itemIndex, (item) => ({
                ...item,
                allergens: item.allergens.filter((_, i) => i !== allergenIndex),
              }))
            }}
            onRemoveIngredient={(itemIndex, ingredientIndex) => {
              updateItem(itemIndex, (item) => ({
                ...item,
                ingredients: item.ingredients.filter((_, i) => i !== ingredientIndex),
              }))
            }}
            onSetAllergenStatus={(itemIndex, allergenIndex, status) => {
              updateItem(itemIndex, (item) => ({
                ...item,
                allergens: item.allergens.map((allergen, i) => (
                  i === allergenIndex ? { ...allergen, status } : allergen
                )),
              }))
            }}
            onStepChange={setStep}
            onToggleIngredient={(itemIndex, ingredientIndex) => {
              updateItem(itemIndex, (item) => ({
                ...item,
                ingredients: item.ingredients.map((ingredient, i) => (
                  i === ingredientIndex
                    ? { ...ingredient, checked: !ingredient.checked }
                    : ingredient
                )),
              }))
            }}
            onViewHome={() => setPhase('home')}
          />
        )}
      </main>
    </div>
  )
}

function AuthScreen({
  auth,
  mode,
  onAuthChange,
  onLoginMode,
  onSignupMode,
  onSubmit,
}) {
  const isSignup = mode === 'signup'

  function updateField(field, value) {
    onAuthChange((current) => ({ ...current, [field]: value }))
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-brand">
          <span className="brand-box" />
          <span>{STORE_NAME}</span>
        </div>
        <h1 id="auth-title">{isSignup ? '매장 정보를 입력해주세요' : '사장님 로그인'}</h1>
        <p>{isSignup ? 'MenuTrust 매장 계정을 만들고 메뉴판을 관리하세요.' : '알레르기 메뉴판을 관리하세요'}</p>

        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
        >
          {isSignup && (
            <label>
              <span>매장명</span>
              <input
                autoComplete="organization"
                onChange={(event) => updateField('storeName', event.target.value)}
                placeholder="우아타이"
                value={auth.storeName}
              />
            </label>
          )}
          <label>
            <span>이메일</span>
            <input
              autoComplete="email"
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="owner@wooa-thai.com"
              type="email"
              value={auth.email}
            />
          </label>
          <label>
            <span>비밀번호</span>
            <input
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="비밀번호"
              type="password"
              value={auth.password}
            />
          </label>
          {isSignup && (
            <label>
              <span>비밀번호 확인</span>
              <input
                autoComplete="new-password"
                onChange={(event) => updateField('confirmPassword', event.target.value)}
                placeholder="비밀번호 확인"
                type="password"
                value={auth.confirmPassword}
              />
            </label>
          )}
          <button className="primary-button auth-submit" type="submit">
            {isSignup ? '가입하기' : '로그인'}
          </button>
        </form>

        <div className="auth-switch">
          <span>{isSignup ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}</span>
          <button type="button" onClick={isSignup ? onLoginMode : onSignupMode}>
            {isSignup ? '로그인' : '회원가입'}
          </button>
        </div>
      </section>
    </main>
  )
}

function Sidebar({ itemCount, phase, step, onLogout, onStepChange }) {
  return (
    <aside className="sidebar">
      <div className="store-lockup">
        <span className="brand-box" />
        <strong>{STORE_NAME}</strong>
      </div>

      <nav className="step-nav" aria-label="메뉴판 발행 단계">
        {STEP_LABELS.map((item) => {
          const active = phase === 'flow' && item.id === step
          const done = phase === 'home' || item.id < step

          return (
            <button
              className={`step-nav-item ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`}
              key={item.id}
              type="button"
              onClick={() => onStepChange(item.id)}
            >
              <span className="step-dot">{done ? <Check size={13} /> : item.id}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <p>{STORE_NAME} 메뉴 {itemCount}개 기준 데모입니다.</p>
        <button className="logout-button" type="button" onClick={onLogout}>
          <LogOut size={15} />
          로그아웃
        </button>
      </div>
    </aside>
  )
}

function FlowScreen(props) {
  const {
    currentStep,
    itemCount,
    items,
    newMenu,
    step,
    onAddAllergen,
    onAddIngredient,
    onAddMenu,
    onAllergenDraftChange,
    onIngredientDraftChange,
    onNewMenuChange,
    onRemoveAllergen,
    onRemoveIngredient,
    onSetAllergenStatus,
    onStepChange,
    onToggleIngredient,
    onViewHome,
  } = props

  return (
    <section className="flow-page" aria-labelledby="flow-title">
      <div className="workspace-header">
        <div>
          <p className="section-kicker">Step {step}</p>
          <h1 id="flow-title">{currentStep.label}</h1>
        </div>
        <span className="progress-pill">{itemCount}개 메뉴</span>
      </div>

      {step === 1 && <UploadStep onNext={() => onStepChange(2)} />}
      {step === 2 && (
        <AnalysisStep
          icon={<Sparkles size={30} />}
          title="메뉴와 재료를 분석하고 있어요"
          description="메뉴명 · 가격 · 식재료 후보를 추출하는 중입니다"
          actionLabel="결과 화면 미리보기"
          onNext={() => onStepChange(3)}
        />
      )}
      {step === 3 && (
        <IngredientStep
          items={items}
          newMenu={newMenu}
          onAddIngredient={onAddIngredient}
          onAddMenu={onAddMenu}
          onIngredientDraftChange={onIngredientDraftChange}
          onNewMenuChange={onNewMenuChange}
          onNext={() => onStepChange(4)}
          onRemoveIngredient={onRemoveIngredient}
          onToggleIngredient={onToggleIngredient}
        />
      )}
      {step === 4 && (
        <AnalysisStep
          icon={<FileText size={30} />}
          title="알레르겐을 분석하고 있어요"
          description="확인된 재료를 기준으로 22가지 알레르겐 항목을 대조하는 중입니다"
          actionLabel="알레르겐 결과 보기"
          onNext={() => onStepChange(5)}
        />
      )}
      {step === 5 && (
        <AllergenStep
          items={items}
          onAddAllergen={onAddAllergen}
          onAllergenDraftChange={onAllergenDraftChange}
          onNext={() => onStepChange(6)}
          onRemoveAllergen={onRemoveAllergen}
          onSetAllergenStatus={onSetAllergenStatus}
        />
      )}
      {step === 6 && <PublishStep itemCount={itemCount} onNext={() => onStepChange(7)} />}
      {step === 7 && <QrStep onViewHome={onViewHome} />}
    </section>
  )
}

function UploadStep({ onNext }) {
  return (
    <div className="upload-layout">
      <div className="upload-dropzone">
        <Image size={44} />
        <strong>메뉴판 이미지를 업로드하세요</strong>
        <p>사진 한 장이면 메뉴명, 가격, 재료 후보까지 AI가 자동으로 인식해요.</p>
        <button className="secondary-button" type="button">
          <Upload size={16} />
          다른 이미지 선택
        </button>
      </div>
      <div className="upload-file">
        <div className="file-thumbnail" />
        <div>
          <strong>menu-board.jpg</strong>
          <p>업로드 완료</p>
          <span>2.4MB · JPG</span>
        </div>
      </div>
      <button className="primary-button next-button" type="button" onClick={onNext}>
        AI 재료 분석 시작하기
        <ChevronRight size={17} />
      </button>
    </div>
  )
}

function AnalysisStep({ actionLabel, description, icon, onNext, title }) {
  return (
    <div className="analysis-panel">
      <div className="analysis-orbit">
        <Loader2 className="spinner" size={88} />
        <div>{icon}</div>
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      <button className="text-action" type="button" onClick={onNext}>
        {actionLabel}
        <ChevronRight size={15} />
      </button>
    </div>
  )
}

function IngredientStep({
  items,
  newMenu,
  onAddIngredient,
  onAddMenu,
  onIngredientDraftChange,
  onNewMenuChange,
  onNext,
  onRemoveIngredient,
  onToggleIngredient,
}) {
  return (
    <div className="editor-stack">
      <header className="editor-copy">
        <h2>AI가 추출한 재료를 확인하세요.</h2>
        <p>체크·해제하거나 직접 추가·삭제할 수 있어요.</p>
      </header>

      <div className="menu-editor-list">
        {items.map((item, itemIndex) => (
          <article className="menu-editor-card" key={`${item.name}-${itemIndex}`}>
            <MenuCardHeader item={item} />
            <p className="field-caption">재료 - 체크된 재료만 알레르겐 분석에 반영됩니다</p>
            <div className="ingredient-grid">
              {item.ingredients.map((ingredient, ingredientIndex) => (
                <button
                  className={`ingredient-chip ${ingredient.checked ? 'is-checked' : ''}`}
                  key={`${ingredient.name}-${ingredientIndex}`}
                  type="button"
                  onClick={() => onToggleIngredient(itemIndex, ingredientIndex)}
                >
                  <span className="checkbox-mark">{ingredient.checked ? <Check size={13} /> : null}</span>
                  <span>{ingredient.name}</span>
                  <Trash2
                    aria-label={`${ingredient.name} 삭제`}
                    role="button"
                    size={14}
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation()
                      onRemoveIngredient(itemIndex, ingredientIndex)
                    }}
                  />
                </button>
              ))}
            </div>
            <div className="inline-add">
              <input
                aria-label={`${item.name} 재료 추가`}
                onChange={(event) => onIngredientDraftChange(itemIndex, event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    onAddIngredient(itemIndex)
                  }
                }}
                placeholder="재료 직접 추가"
                value={item.draft}
              />
              <button type="button" onClick={() => onAddIngredient(itemIndex)}>
                <Plus size={15} />
                추가
              </button>
            </div>
          </article>
        ))}
      </div>

      <section className="add-menu-panel" aria-labelledby="add-menu-title">
        <div>
          <h3 id="add-menu-title">메뉴 추가</h3>
          <p>추가한 메뉴는 재료를 직접 입력한 뒤 알레르겐 분석을 진행할 수 있어요.</p>
        </div>
        <div className="add-menu-grid">
          <input
            aria-label="새 메뉴명"
            onChange={(event) => onNewMenuChange((current) => ({ ...current, name: event.target.value }))}
            placeholder="메뉴명"
            value={newMenu.name}
          />
          <input
            aria-label="새 메뉴 가격"
            inputMode="numeric"
            onChange={(event) => onNewMenuChange((current) => ({ ...current, price: event.target.value }))}
            placeholder="가격"
            value={newMenu.price}
          />
          <input
            aria-label="새 메뉴 카테고리"
            onChange={(event) => onNewMenuChange((current) => ({ ...current, category: event.target.value }))}
            placeholder="카테고리"
            value={newMenu.category}
          />
          <button className="secondary-button" type="button" onClick={onAddMenu}>
            <Plus size={16} />
            새 메뉴 추가
          </button>
        </div>
      </section>

      <button className="primary-button next-button" type="button" onClick={onNext}>
        재료 확인 완료 · 알레르겐 분석하기
        <ChevronRight size={17} />
      </button>
    </div>
  )
}

function AllergenStep({
  items,
  onAddAllergen,
  onAllergenDraftChange,
  onNext,
  onRemoveAllergen,
  onSetAllergenStatus,
}) {
  return (
    <div className="editor-stack">
      <header className="editor-copy">
        <h2>재료 기준으로 감지된 알레르겐이에요.</h2>
        <p>상태를 눌러 바꾸거나, 식약처 22가지 알레르기 유발식품 목록에서 빠진 항목을 추가·삭제하세요.</p>
      </header>

      <div className="menu-editor-list">
        {items.map((item, itemIndex) => {
          const remaining = allergenOptions.filter(
            (name) => !item.allergens.some((allergen) => allergen.name === name),
          )

          return (
            <article className="menu-editor-card" key={`${item.name}-${itemIndex}`}>
              <MenuCardHeader item={item} />
              <div className="allergen-list">
                {item.allergens.length === 0 ? (
                  <p className="empty-note">감지된 알레르겐이 없어요.</p>
                ) : (
                  item.allergens.map((allergen, allergenIndex) => (
                    <div className="allergen-row" key={`${allergen.name}-${allergenIndex}`}>
                      <div>
                        <strong>{allergen.name}</strong>
                        <span className={`status-badge status-badge--${allergen.status}`}>
                          {statusLabel(allergen.status)}
                        </span>
                      </div>
                      <div className="segmented-control">
                        <button
                          className={allergen.status === 'confirmed' ? 'is-selected danger' : ''}
                          type="button"
                          onClick={() => onSetAllergenStatus(itemIndex, allergenIndex, 'confirmed')}
                        >
                          확정
                        </button>
                        <button
                          className={allergen.status === 'possible' ? 'is-selected caution' : ''}
                          type="button"
                          onClick={() => onSetAllergenStatus(itemIndex, allergenIndex, 'possible')}
                        >
                          혼입 가능
                        </button>
                        <button
                          aria-label={`${allergen.name} 삭제`}
                          type="button"
                          onClick={() => onRemoveAllergen(itemIndex, allergenIndex)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {remaining.length > 0 ? (
                <div className="inline-add">
                  <select
                    aria-label={`${item.name} 알레르겐 추가`}
                    onChange={(event) => onAllergenDraftChange(itemIndex, event.target.value)}
                    value={remaining.includes(item.allergenDraft) ? item.allergenDraft : remaining[0]}
                  >
                    {remaining.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <button type="button" onClick={() => onAddAllergen(itemIndex)}>
                    <Plus size={15} />
                    추가
                  </button>
                </div>
              ) : (
                <p className="empty-note">22가지 알레르겐 항목을 모두 추가했어요.</p>
              )}
            </article>
          )
        })}
      </div>

      <button className="primary-button next-button" type="button" onClick={onNext}>
        검수 완료 · 발행하러 가기
        <ChevronRight size={17} />
      </button>
    </div>
  )
}

function PublishStep({ itemCount, onNext }) {
  return (
    <div className="publish-panel">
      <CheckCircle2 size={54} />
      <h2>전체 메뉴 {itemCount}개 검수 완료</h2>
      <p>
        검수가 완료되면 소비자가 볼 수 있는 알레르기 메뉴판이 공개됩니다.
        <br />
        발행 후에도 언제든 재료를 수정할 수 있어요.
      </p>
      <button className="primary-button" type="button" onClick={onNext}>
        알레르기 메뉴판 발행하기
        <ChevronRight size={17} />
      </button>
    </div>
  )
}

function QrStep({ onViewHome }) {
  return (
    <div className="qr-panel">
      <h2>발행 완료 · QR 생성됨</h2>
      <QrBlock size="large" />
      <button className="text-action" type="button" onClick={onViewHome}>
        완료
        <ChevronRight size={15} />
      </button>
    </div>
  )
}

function HomeDashboard({ itemCount, items, onEditMenu, onRepublish }) {
  return (
    <section className="home-dashboard" aria-labelledby="home-title">
      <div className="workspace-header">
        <div>
          <div className="title-row">
            <h1 id="home-title">{STORE_NAME} 알레르기 메뉴판</h1>
            <span className="live-badge">발행중</span>
          </div>
          <p>메뉴 {itemCount}개 · 소비자 공개 메뉴판이 QR로 연결되어 있어요.</p>
        </div>
      </div>

      <div className="home-qr-section">
        <QrBlock />
        <button className="primary-button" type="button">
          QR 코드 출력하기
        </button>
      </div>

      <section className="menu-summary" aria-labelledby="summary-title">
        <div className="summary-heading">
          <h2 id="summary-title">메뉴판 내용</h2>
          <button className="primary-button compact" type="button" onClick={onEditMenu}>
            메뉴판 수정하기
          </button>
        </div>
        <div className="summary-list">
          {items.map((item) => (
            <article className="summary-row" key={item.name}>
              <div>
                <strong>{item.name}</strong>
                <span>{item.category} · {formatPrice(item.price)}</span>
              </div>
              <div className="summary-badges">
                {item.allergens.length > 0 ? (
                  item.allergens.slice(0, 4).map((allergen) => (
                    <span
                      className={`status-badge status-badge--${allergen.status}`}
                      key={allergen.name}
                    >
                      {allergen.name}
                    </span>
                  ))
                ) : (
                  <span className="muted-label">알레르겐 없음</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="republish-callout">
        <p>
          재료를 수정하면 알레르겐 정보가 바뀌어요.
          <br />
          수정 후 다시 발행하면 QR과 공개 메뉴판이 최신 정보로 갱신돼요.
        </p>
        <button className="outline-button" type="button" onClick={onRepublish}>
          QR 재발행하기
        </button>
      </div>
    </section>
  )
}

function MenuCardHeader({ item }) {
  return (
    <div className="menu-card-header">
      <div>
        <h3>{item.name}</h3>
        <span>{item.category} · {formatPrice(item.price)}</span>
      </div>
      <span className="review-badge">검수완료</span>
    </div>
  )
}

function QrBlock({ size = 'default' }) {
  return (
    <div className={`qr-block qr-block--${size}`}>
      <div className="qr-code" aria-label="데모 QR 코드" />
      <div className="qr-meta">
        <span>공개 메뉴판 URL</span>
        <code>{MENU_URL}</code>
        {size === 'large' && (
          <button className="primary-button compact" type="button">
            QR 이미지 저장
          </button>
        )}
      </div>
    </div>
  )
}

export default App
