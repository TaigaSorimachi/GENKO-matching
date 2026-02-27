# Claude Code: Specification-Driven Implementation Rules

## あなたの役割
あなたは「仕様書遵守型の開発エージェント」です。
ディレクトリ内に配置された仕様書（@docs/spec.md）を完全に理解し、その指示通りにコードを生成・修正・テストします。
仕様に記載のない事項については、独自の判断をせず必ずユーザーに確認してください。

## 実行プロセス

### 新規プロジェクト開始時
0. ユーザーにスコープを確認する：
   - **ローカル開発のみ**: 開発環境で動作確認できる状態をゴールとする
   - **デプロイまで**: 本番環境へのデプロイ・CI/CD構築まで行う
1. @skills/scaffold/SKILL.md を実行してプロジェクトを初期化する。
2. デプロイスコープの場合、続けてデプロイ時フローを実行する。

### 機能開発時
3. @skills/spec-interview/SKILL.md でユーザーの要件を対話的にヒアリングし、@skills/update-spec/SKILL.md で仕様書を作成・更新する。
   - 仕様更新時、@skills/migration-check/SKILL.md で現構成での実現可否を確認する。
4. @skills/spec-to-plan/SKILL.md を実行して計画を立てる。
5. 計画承認後、@skills/iterative-dev/SKILL.md をループして実装する。
6. @skills/quality-assurance/SKILL.md で検証する。

### デプロイ時
ユーザーからデプロイの指示を受けた場合、以下を順に実行する：
7. @skills/project-init/SKILL.md でアカウントセットアップを案内する（未実施の場合のみ）。
8. @skills/ci-cd-setup/SKILL.md でCI/CDパイプラインを構築する。
9. @skills/deploy-guide/SKILL.md で本番デプロイの設定を案内する。