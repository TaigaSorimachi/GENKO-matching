# Specification: GENKO（ゲンコ）— ブルーカラー人材マッチングプラットフォーム

## 1. 概要 (Overview)
- **目的:** ブルーカラー産業に特化した人材マッチングWebアプリ。求職者が最速で最適な仕事を見つけ、企業が迅速に人材を確保できる。
- **ユーザー体験:**
  - 求職者: 60秒で登録 → スキルに基づいたおすすめ求人をすぐに閲覧 → ワンタップで応募 → チャットで企業と連絡
  - 企業担当者: 求人を簡単に作成 → マッチした求職者からの応募を確認 → ダッシュボードでKPIを管理
- **対象ユーザー:**
  - 求職者: 建設・製造・運輸・物流・警備・介護・清掃業界の労働者
  - 企業: 上記業界の中小〜大手企業の採用担当者
- **デザインコンセプト:** タイミー風のシンプル・直感的なUI（shadcn/ui ベース）
- **認証:** モック実装（ヘッダーのユーザー切替ボタンでロールをシミュレート）

## 2. データ構造 (Data Model)

### User（ユーザー）
| フィールド名 | 型 | 制約 | 備考 |
| :--- | :--- | :--- | :--- |
| `id` | String | Primary Key | cuid |
| `type` | UserType (enum) | Not Null | JOBSEEKER / EMPLOYER |
| `phone` | String | Unique, Not Null | 電話番号 |
| `name` | String | Not Null | 氏名 |
| `location` | String | Nullable | 居住エリア |
| `lat` | Float | Nullable | 緯度 |
| `lng` | Float | Nullable | 経度 |
| `language` | String | Default: "ja" | 使用言語 |
| `trustScore` | Int | Default: 0 | 信頼スコア (0-100) |
| `companyId` | String | Nullable, FK | 所属企業（EMPLOYER のみ） |

### Company（企業）
| フィールド名 | 型 | 制約 | 備考 |
| :--- | :--- | :--- | :--- |
| `id` | String | Primary Key | cuid |
| `name` | String | Not Null | 企業名 |
| `industry` | Industry (enum) | Not Null | 業界 |
| `size` | Int | Nullable | 従業員数 |
| `address` | String | Nullable | 所在地 |
| `lat` | Float | Nullable | 緯度 |
| `lng` | Float | Nullable | 経度 |
| `verified` | Boolean | Default: false | 認証済みフラグ |
| `trustScore` | Int | Default: 0 | 信頼スコア (0-100) |

### Skill（スキル）
| フィールド名 | 型 | 制約 | 備考 |
| :--- | :--- | :--- | :--- |
| `id` | String | Primary Key | cuid |
| `name` | String | Unique, Not Null | スキル名（例: 溶接(TIG)） |
| `category` | String | Not Null | カテゴリ（例: 溶接、運転） |
| `industry` | Industry (enum) | Not Null | 対応業界 |

### UserSkill（ユーザースキル）
| フィールド名 | 型 | 制約 | 備考 |
| :--- | :--- | :--- | :--- |
| `id` | String | Primary Key | cuid |
| `userId` | String | FK, Not Null | ユーザーID |
| `skillId` | String | FK, Not Null | スキルID |
| `level` | Int | Default: 1 | スキルレベル (1-5) |
| `verified` | Boolean | Default: false | 検証済みフラグ |
| `xpPoints` | Int | Default: 0 | 経験値ポイント |

### Job（求人）
| フィールド名 | 型 | 制約 | 備考 |
| :--- | :--- | :--- | :--- |
| `id` | String | Primary Key | cuid |
| `companyId` | String | FK, Not Null | 企業ID |
| `title` | String | Not Null | 求人タイトル |
| `description` | String | Not Null | 求人説明 |
| `salaryMin` | Int | Nullable | 最低給与（日給/月給） |
| `salaryMax` | Int | Nullable | 最高給与 |
| `location` | String | Not Null | 勤務地 |
| `lat` | Float | Nullable | 緯度 |
| `lng` | Float | Nullable | 経度 |
| `shiftType` | ShiftType (enum) | Not Null | FULL_TIME / PART_TIME / SPOT / CONTRACT |
| `urgency` | JobUrgency (enum) | Default: NORMAL | NORMAL / URGENT / EMERGENCY |
| `status` | JobStatus (enum) | Default: DRAFT | DRAFT / ACTIVE / CLOSED / EXPIRED |

### JobSkill（求人スキル要件）
| フィールド名 | 型 | 制約 | 備考 |
| :--- | :--- | :--- | :--- |
| `id` | String | Primary Key | cuid |
| `jobId` | String | FK, Not Null | 求人ID |
| `skillId` | String | FK, Not Null | スキルID |
| `minLevel` | Int | Default: 1 | 最低必要レベル |

### Match（マッチング）
| フィールド名 | 型 | 制約 | 備考 |
| :--- | :--- | :--- | :--- |
| `id` | String | Primary Key | cuid |
| `userId` | String | FK, Not Null | 求職者ID |
| `jobId` | String | FK, Not Null | 求人ID |
| `aiScore` | Float | Nullable | マッチングスコア (0-100) |
| `status` | MatchStatus (enum) | Default: SUGGESTED | SUGGESTED / APPLIED / SCREENING / INTERVIEW / OFFERED / HIRED / REJECTED / WITHDRAWN |
| `appliedAt` | DateTime | Nullable | 応募日時 |
| `hiredAt` | DateTime | Nullable | 採用日時 |

### Review（レビュー）
| フィールド名 | 型 | 制約 | 備考 |
| :--- | :--- | :--- | :--- |
| `id` | String | Primary Key | cuid |
| `reviewerId` | String | FK, Not Null | 評価者ID |
| `revieweeId` | String | FK, Not Null | 被評価者ID |
| `jobId` | String | FK, Not Null | 求人ID |
| `rating` | Int | Not Null | 総合評価 (1-5) |
| `safetyScore` | Int | Nullable | 安全性評価 (1-5) |
| `comment` | String | Nullable | コメント |

### Message（メッセージ）
| フィールド名 | 型 | 制約 | 備考 |
| :--- | :--- | :--- | :--- |
| `id` | String | Primary Key | cuid |
| `senderId` | String | FK, Not Null | 送信者ID |
| `receiverId` | String | FK, Not Null | 受信者ID |
| `type` | MessageType (enum) | Default: TEXT | TEXT のみ（MVP） |
| `content` | String | Not Null | メッセージ本文 |
| `read` | Boolean | Default: false | 既読フラグ |

### Enum定義
- **UserType:** JOBSEEKER, EMPLOYER
- **Industry:** CONSTRUCTION, MANUFACTURING, TRANSPORT, LOGISTICS, SECURITY, NURSING, CLEANING, OTHER
- **ShiftType:** FULL_TIME, PART_TIME, SPOT, CONTRACT
- **JobUrgency:** NORMAL, URGENT, EMERGENCY
- **JobStatus:** DRAFT, ACTIVE, CLOSED, EXPIRED
- **MatchStatus:** SUGGESTED, APPLIED, SCREENING, INTERVIEW, OFFERED, HIRED, REJECTED, WITHDRAWN
- **MessageType:** TEXT

## 3. 機能要件 (Functional Requirements)

### 認証（モック）
- [ ] **REQ-AUTH-1:** ヘッダーにユーザー切替ドロップダウンを表示し、事前に用意したモックユーザー（求職者3名、企業担当者2名）を切り替えられる
- [ ] **REQ-AUTH-2:** 選択中のユーザーのロール（JOBSEEKER/EMPLOYER）に応じて、表示する画面・ナビゲーションを切り替える

### 求職者 - 登録（60秒レジストレーション）
- [ ] **REQ-REG-1:** ステップフォーム形式で登録を行う（4ステップ）
  - Step 1: 名前・電話番号
  - Step 2: 居住エリア（テキスト入力）
  - Step 3: 興味のある業界をタップ選択（複数選択可）
  - Step 4: 保有スキルを候補リストから選択 + 希望条件（給与レンジスライダー、シフト種別）
- [ ] **REQ-REG-2:** 各ステップにバリデーションを実装する（名前は必須、電話番号はフォーマットチェック）
- [ ] **REQ-REG-3:** 登録完了後、即座におすすめ求人リストを表示する

### 求職者 - プロフィール
- [ ] **REQ-PROF-1:** プロフィール編集画面で名前・電話番号・居住エリア・言語を編集できる
- [ ] **REQ-PROF-2:** スキル管理画面で保有スキルの追加・レベル変更・削除ができる

### 求職者 - 求人検索
- [ ] **REQ-SEARCH-1:** 求人をカードリスト形式で表示する（タイトル、企業名、給与、勤務地、スキル要件のバッジ）
- [ ] **REQ-SEARCH-2:** フィルタ機能: 業界、シフト種別、給与範囲（min/max）、エリア（テキスト）
- [ ] **REQ-SEARCH-3:** マッチングスコア順（高い順）でデフォルトソート
- [ ] **REQ-SEARCH-4:** 求人詳細画面で企業情報・求人説明・スキル要件・給与・勤務地を表示する

### 求職者 - マッチング
- [ ] **REQ-MATCH-1:** 各求人に対して、ログイン中の求職者とのマッチングスコアを算出する
  - スキル適合度: 40%（求人必須スキルとのレベル一致度）
  - 通勤利便性: 25%（求職者と求人の位置情報からの距離）
  - 給与希望合致: 20%（求職者の希望給与と求人給与レンジの重なり）
  - 職場文化適合: 10%（同業界経験の有無）
  - キャリア成長性: 5%（スキルレベルアップの余地）
- [ ] **REQ-MATCH-2:** ホーム画面にマッチングスコア上位10件をおすすめとして表示する

### 求職者 - 応募
- [ ] **REQ-APPLY-1:** 求人詳細画面から「応募する」ボタンで応募できる（Match レコードを APPLIED に更新）
- [ ] **REQ-APPLY-2:** 応募一覧画面で自分の応募状況（ステータス）を確認できる
- [ ] **REQ-APPLY-3:** 同一求人への重複応募を防止する

### 企業 - 求人管理
- [ ] **REQ-JOB-1:** 求人一覧画面で自社の求人をリスト表示する（ステータスでフィルタ可能）
- [ ] **REQ-JOB-2:** 求人作成フォーム: タイトル、説明、給与範囲、勤務地、シフト種別、緊急度、必要スキル（複数選択 + 最低レベル設定）
- [ ] **REQ-JOB-3:** 求人の編集・ステータス変更（DRAFT→ACTIVE→CLOSED）ができる
- [ ] **REQ-JOB-4:** 求人の削除ができる（確認ダイアログ付き）

### 企業 - 応募者管理
- [ ] **REQ-APPLICANT-1:** 求人ごとの応募者一覧を表示する（名前、スキル、マッチングスコア、応募日時、ステータス）
- [ ] **REQ-APPLICANT-2:** 応募者のステータスを変更できる（APPLIED → SCREENING → INTERVIEW → OFFERED → HIRED / REJECTED）
- [ ] **REQ-APPLICANT-3:** 応募者のプロフィール・スキル詳細を確認できる

### 企業 - ダッシュボード
- [ ] **REQ-DASH-1:** KPIカードを表示する: 総応募数、面接予定数、採用率、アクティブ求人数
- [ ] **REQ-DASH-2:** 最近の応募（直近5件）をリスト表示する
- [ ] **REQ-DASH-3:** 求人ごとの応募数を棒グラフまたはリストで表示する

### チャット（共通）
- [ ] **REQ-CHAT-1:** マッチング成立（APPLIED以降）した求職者と企業担当者間でテキストメッセージを送受信できる
- [ ] **REQ-CHAT-2:** チャット一覧画面で会話相手のリストを表示する（最新メッセージのプレビュー付き）
- [ ] **REQ-CHAT-3:** チャットルームでメッセージ履歴を時系列で表示する
- [ ] **REQ-CHAT-4:** 未読メッセージ数をバッジで表示する
- [ ] **REQ-CHAT-5:** 5秒間隔のDBポーリングで新着メッセージを取得する（リアルタイム風）

### シード - モックデータ
- [ ] **REQ-SEED-1:** 以下のモックデータをシードスクリプトで投入する
  - 求職者ユーザー: 3名（異なるスキル・エリア）
  - 企業ユーザー: 2名（各企業1名）
  - 企業: 2社（建設業、物流業）
  - スキルマスタ: 15種類以上（業界横断）
  - 求人: 10件以上（異なる条件）
  - マッチング・応募: 数件のサンプルデータ
  - メッセージ: いくつかの会話サンプル

## 4. UI/UX 要件 (UI/UX Requirements)

### ページ構成
**求職者側（`/`配下）:**
| パス | 役割 |
| :--- | :--- |
| `/` | ホーム（おすすめ求人TOP10リスト） |
| `/jobs` | 求人検索・フィルタ |
| `/jobs/[id]` | 求人詳細 |
| `/profile` | プロフィール編集 |
| `/skills` | スキル管理 |
| `/applications` | 応募一覧 |
| `/messages` | チャット一覧 |
| `/messages/[userId]` | チャットルーム |

**企業側（`/company`配下）:**
| パス | 役割 |
| :--- | :--- |
| `/company` | ダッシュボード（KPI + 最近の応募） |
| `/company/jobs` | 求人一覧 |
| `/company/jobs/new` | 求人作成 |
| `/company/jobs/[id]/edit` | 求人編集 |
| `/company/jobs/[id]/applicants` | 応募者一覧 |
| `/company/messages` | チャット一覧 |
| `/company/messages/[userId]` | チャットルーム |

### レイアウト
- **全体:** モバイルファーストのレスポンシブデザイン
- **求職者側:** ボトムナビゲーション（ホーム / 求人検索 / 応募 / チャット / プロフィール）
- **企業側:** サイドバーナビゲーション（ダッシュボード / 求人管理 / チャット）
- **ヘッダー:** アプリロゴ + ユーザー切替ドロップダウン（モック認証）

### デザインガイドライン
- タイミー風のクリーンで直感的なUI
- プライマリカラー: ブルー系（ブルーカラーを想起させる）
- カード型レイアウトを基本とする（求人カード、応募者カード等）
- 大きなタッチターゲット（現場作業者の手袋着用を考慮）
- アイコン + テキストのナビゲーション

### 使用コンポーネント（shadcn/ui）
- Button, Input, Select, Slider, Badge, Card, Dialog, Toast, Tabs, Avatar, Skeleton, DropdownMenu, Sheet, Table

## 5. エラーメッセージ定義 (Error Messages)

| 条件 | メッセージ |
| :--- | :--- |
| 名前未入力 | "名前は必須です" |
| 電話番号フォーマット不正 | "正しい電話番号を入力してください" |
| 求人タイトル未入力 | "求人タイトルは必須です" |
| 求人説明未入力 | "求人の説明は必須です" |
| 勤務地未入力 | "勤務地は必須です" |
| 給与範囲不整合 | "最低給与は最高給与以下にしてください" |
| 重複応募 | "この求人には既に応募済みです" |
| メッセージ空送信 | "メッセージを入力してください" |
| API通信エラー | "通信に失敗しました。再度お試しください" |
| 求人が見つからない | "求人が見つかりませんでした" |

## 6. 受け入れ基準 (Acceptance Criteria)

- [ ] `npm run build` が正常に完了すること
- [ ] `npm run test` が全てパスすること
- [ ] モックユーザーの切り替えで求職者/企業の画面が切り替わること
- [ ] 求職者がステップフォームで登録情報を入力できること
- [ ] 求人一覧がマッチングスコア順で表示されること
- [ ] 求人詳細から応募ができ、応募一覧に反映されること
- [ ] 企業が求人のCRUD操作を実行できること
- [ ] 企業ダッシュボードにKPI（応募数、面接予定数、採用率、アクティブ求人数）が表示されること
- [ ] 応募者のステータスを変更できること
- [ ] チャットでテキストメッセージの送受信ができること
- [ ] シードデータが正常に投入され、アプリが初期状態で動作すること

## 7. 備考・制約 (Constraints/Notes)
- **認証:** MVP ではモック実装。Supabase Auth はデプロイ時に導入予定
- **位置情報:** 緯度・経度はシードデータで固定値を設定。ブラウザの Geolocation API は使用しない
- **マッチングスコア:** サーバーサイドで計算し、求人取得時にスコアを付与する
- **チャットリアルタイム:** WebSocket ではなく5秒間隔のDBポーリングで実装
- **外部API:** MVP では使用しない（OCR、AI、地図API等はPhase 2以降）
- **多言語対応:** MVP では日本語のみ
- **ローカル開発:** Docker Compose で PostgreSQL を起動、`npm run dev` で開発サーバーを起動
