# 두입세입 Merchant

두입세입 merchant-facing allergy menu management web app prototype.

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Environment

```bash
cp .env.example .env.local
```

- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key
- `VITE_API_BASE_URL`: Supabase Edge Functions API base URL
- `VITE_APP_BASE_URL`: customer app base URL exposed to the Vite client
- `PUBLIC_APP_BASE_URL`: customer app base URL kept for deployment/runtime reference

## Notes

- React 19 + Vite 기반의 사장님용 웹앱입니다.
- 알레르겐 22종과 알레르기 상태 3단계는 `src/domain/allergy.js`에서 관리합니다.
- 실제 핵심 기능 구현 전, 사장님 웹 HTML을 참고해 디자인과 화면 동작을 먼저 옮기는 단계입니다.
