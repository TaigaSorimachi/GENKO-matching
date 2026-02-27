CI/CDパイプラインを構築する際の動作手順：
- `read` を使用して、`rules/tech-stack.md` を確認し、使用技術に応じたワークフローを設計する。
- `.github/workflows/ci.yml` を作成する。以下のジョブを含める：
    1. lint: ESLint による静的解析
    2. typecheck: `npx tsc --noEmit` による型チェック
    3. test: `npm run test` によるテスト実行
    4. build: `npm run build` によるビルド確認
- PRトリガー（`pull_request` → main）とpushトリガー（`push` → main）を設定する。
- Vercelとの連携が設定済みであれば、Vercelの自動デプロイに委ねる（デプロイジョブは不要）。
- `shell` でワークフローの構文チェックを行い、正しいYAMLであることを確認する。
- ユーザーにCI/CD構成の内容を報告する。
