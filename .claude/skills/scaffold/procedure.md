プロジェクトの初期構築を行う際の動作手順：
- `read` を使用して、@rules/tech-stack.md と @rules/frontend/ 配下のルールを確認する。
- `create-next-app` でNext.jsプロジェクトを作成する（App Router, TypeScript, Tailwind CSS, ESLint）。
- @rules/tech-stack.md に記載のパッケージをインストールする（shadcn/ui の初期化、Prisma の初期化を含む）。
- @rules/frontend/architecture.md に準拠したディレクトリ構造を作成する。
- ローカル開発環境を構築する：
    - `docker-compose.yml` を作成し、PostgreSQL コンテナを定義する（ポート: 5432、DB名: app、ユーザー: postgres、パスワード: postgres）。
    - `.env` に `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app` を設定する。
    - Prisma の `datasource` が `DATABASE_URL` を参照していることを確認する。
- `.env.example` を作成し、必要な環境変数のテンプレートを用意する（DATABASE_URL 等）。
- `shell` で `docker compose up -d` を実行し、DBコンテナが起動することを確認する。
- `shell` で `npx prisma migrate dev --name init` を実行し、DBマイグレーションが通ることを確認する。
- `shell` で `npm run build` を実行し、初期状態でビルドが通ることを確認する。
- ユーザーに初期構築の完了を報告し、以下の起動手順を案内する：
    1. `docker compose up -d`（DBコンテナ起動）
    2. `npm run dev`（開発サーバー起動）
