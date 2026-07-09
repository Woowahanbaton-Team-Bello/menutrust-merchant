import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react'
import './App.css'
import {
  ALLERGENS,
  ALLERGY_STATUS,
  ALLERGY_STATUS_META,
} from './domain/allergy.js'

const demoStatuses = [
  ALLERGY_STATUS.CONTAINS,
  ALLERGY_STATUS.MAY_CONTAIN,
  ALLERGY_STATUS.FREE,
]

function App() {
  return (
    <main className="app-shell">
      <section className="intro-panel" aria-labelledby="app-title">
        <div className="brand-row">
          <span className="brand-mark">MT</span>
          <span className="brand-name">MenuTrust</span>
        </div>

        <p className="eyebrow">Thai demo store</p>
        <h1 id="app-title">알레르기 메뉴 확인 화면 준비 중</h1>
        <p className="intro-copy">
          사장님 웹 HTML 디자인을 React 화면으로 옮기기 위한 초기 프로젝트 설정이
          완료되었습니다.
        </p>
      </section>

      <section className="status-panel" aria-labelledby="status-title">
        <h2 id="status-title">상태 표시 기준</h2>
        <div className="status-list">
          {demoStatuses.map((status) => {
            const meta = ALLERGY_STATUS_META[status]
            const Icon = status === ALLERGY_STATUS.CONTAINS
              ? AlertTriangle
              : status === ALLERGY_STATUS.MAY_CONTAIN
                ? HelpCircle
                : CheckCircle2

            return (
              <article className={`status-card status-card--${status}`} key={status}>
                <Icon aria-hidden="true" size={22} />
                <div>
                  <strong>{meta.label}</strong>
                  <p>{meta.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="allergen-panel" aria-labelledby="allergen-title">
        <h2 id="allergen-title">알레르겐 22종</h2>
        <div className="allergen-grid">
          {ALLERGENS.map((allergen) => (
            <button className="allergen-chip" key={allergen.id} type="button">
              {allergen.label}
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
