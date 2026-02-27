新規プロジェクト開始時の動作手順：
- `read` を使用して、`rules/tech-stack.md` の現在の技術スタックを確認する。

### ローカル開発に必要な前提条件
- ユーザーに以下がインストール済みか確認する：
    1. Docker Desktop（PostgreSQL コンテナの実行に必要）
    2. Node.js（LTS バージョン）
- 未インストールの場合はインストールを案内する。

### デプロイ時に追加で必要なセットアップ
- デプロイスコープの場合のみ、以下を案内する：
    1. Supabase アカウント作成 + プロジェクト作成 → `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DATABASE_URL` を取得
    2. Vercel アカウント作成 + GitHubリポジトリ連携 → 自動デプロイ設定
    3. GitHubリポジトリ作成 → CI/CDの基盤
- ユーザーの確認後、セットアップを開始する。
