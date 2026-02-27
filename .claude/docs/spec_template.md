<!-- このファイルはClaude専用の構造テンプレートです。直接編集しないでください。 -->
<!-- Claudeがユーザーの要望をもとに @docs/spec.md を生成する際の雛形として使用します。 -->

# Specification: [アプリ名]

## 1. 概要 (Overview)
- **目的:** 何のためのアプリか（1行で）。
- **ユーザー体験:** ユーザーがこのアプリを使って達成すること。

## 2. データ構造 (Data Model)
Prisma Schema として定義するモデル。

| フィールド名 | 型 | 制約 | 備考 |
| :--- | :--- | :--- | :--- |
| `id` | String | Primary Key | cuid |
| `title` | String | Not Null | |

## 3. 機能要件 (Functional Requirements)
チェックリスト形式で、IDを振って管理する。

- [ ] **REQ-1:** [例: ログイン済みユーザーのみが投稿できる]
- [ ] **REQ-2:** [例: 投稿内容は最大280文字でバリデーションする]

## 4. UI/UX 要件 (UI/UX Requirements)
- **ページ構成:** [例: `/login`, `/dashboard`]
- **レイアウト:** [例: サイドバー付きの2カラム構成]
- **使用コンポーネント:** [例: `Button`, `Input`, `Toast`]

## 5. エラーメッセージ定義 (Error Messages)
※ 表示方法（Toast/インライン等）は `rules/frontend/architecture.md` §8 に従う。
ここには機能固有のメッセージのみ記載する。

| 条件 | メッセージ |
| :--- | :--- |
| [例: title未入力] | [例: "タイトルは必須です"] |
| [例: ネットワークエラー] | [例: "通信に失敗しました"] |

## 6. 受け入れ基準 (Acceptance Criteria)
「これができたら完了」というチェックリスト。

- [ ] `npm run build` が正常に完了すること
- [ ] `npm run test` が全てパスすること
- [ ] [例: 正常系の動作確認]
- [ ] [例: 異常系の動作確認]

## 7. 備考・制約 (Constraints/Notes)
- 外部API: [使用する場合のみ記載。例: Stripe, OpenAI API]
- その他の制約や注意事項
