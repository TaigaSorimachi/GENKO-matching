# 技術スタック

## フロントエンド + バックエンド (統合構成)
- フレームワーク: Next.js (App Router + Route Handlers)
- 言語: TypeScript (strict mode)
- スタイリング: Tailwind CSS
- UIコンポーネント: shadcn/ui
- サーバー状態管理: TanStack Query
- クライアント状態管理: Zustand
- フォーム・バリデーション: React Hook Form + Zod
- ORM: Prisma
- テスト: Vitest + React Testing Library + MSW

## ローカル開発環境
- DB: PostgreSQL (Docker コンテナ)
- コンテナ管理: Docker Compose
- 認証: モック or 無効化（Supabase Auth はデプロイ時に導入）

## 本番インフラ
- DB: PostgreSQL (Supabase)
- ホスティング: Vercel (FE + API統合)
- 認証: Supabase Auth
- CI/CD: GitHub Actions (最小構成)
- 月額コスト: $0
