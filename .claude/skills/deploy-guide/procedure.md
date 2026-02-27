本番デプロイの準備を行う際の動作手順：
- `read` を使用して、`rules/tech-stack.md` と `.env.example` を確認する。
- Supabaseの本番設定をユーザーに案内する：
    1. Supabaseダッシュボードでプロジェクトが作成済みか確認
    2. `DATABASE_URL`（Connection Pooling有効）の取得
    3. Prismaマイグレーションの実行（`npx prisma migrate deploy`）
- Vercelの本番設定をユーザーに案内する：
    1. VercelダッシュボードでGitHubリポジトリが連携済みか確認
    2. 環境変数（`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DATABASE_URL`）の設定
    3. ビルド設定の確認（Framework Preset: Next.js）
- `vercel.json` が必要な場合は作成する（リダイレクト、ヘッダー等）。
- ユーザーにデプロイ手順の完了を報告し、本番URLの確認を促す。
