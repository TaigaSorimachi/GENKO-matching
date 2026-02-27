# バックエンドアーキテクチャルール

## 1. 共通ルール（全構成で適用）

### 1.1 3層アーキテクチャ
- **Handler層**: リクエスト受付・レスポンス返却のみ。ビジネスロジック禁止。
- **Service層**: ビジネスロジックを集約。HTTPフレームワークに依存しない純粋なTypeScriptで書く。
- **Repository層**: データアクセスのみ。Prisma Clientの呼び出しをここに閉じ込める。

### 1.2 疎結合
- Repository層はPrisma Clientを隠蔽し、Serviceにはドメイン型のみ返す

### 1.3 高凝集
- 1つのServiceは1つのドメイン概念を扱う
- 複数ドメインにまたがる処理は、それぞれのServiceを呼び出すオーケストレーション用Serviceで行う

### 1.4 DRY原則
- Prisma生成型をDBモデルの唯一の型定義源（Single Source of Truth）とする
- バリデーションスキーマからリクエスト型を導出する（型を二重定義しない）
- 共通のエラーハンドリング・レスポンス整形はユーティリティに集約する

### 1.5 エラーハンドリング
- ドメインエラーとHTTPエラーを分離する
- Service層はドメインエラーをthrowし、Handler層がHTTPステータスに変換する
- エラーレスポンス形式を統一する: `{ error: { code: string, message: string } }`
- ドメインエラークラスは汎用名を使用する（例: `NotFoundError`, `ValidationError`, `ConflictError`）。リソース名はエラークラス名に含めず、message で区別する

### 1.6 型安全
- API入出力の型はフロントエンドと共有する

## 2. Next.js Route Handlers 構成（現行）

### 命名規則
- リソース名は単数形を使用する（例: `user`, `todo-item`）

### ディレクトリ構造
```
app/api/[resource]/
  route.ts                              ← Handler（一覧・作成）
app/api/[resource]/[id]/
  route.ts                              ← Handler（取得・更新・削除）
app/api/[parent]/[id]/[child]/
  route.ts                              ← Handler（ネストされたリソース。ロジックは子リソースのServiceに実装する）
lib/
  services/[resource].service.ts        ← Service
  repositories/[resource].repository.ts ← Repository
  validators/[resource].validator.ts    ← Zod schema
  errors/index.ts                      ← ドメインエラー定義
  utils/response.ts                    ← 共通レスポンス整形・エラーハンドリング
  types/api.ts                         ← FE-BE共有型（全リソースの型を集約）
```

### ルール
- `route.ts` では Zodバリデーション → Service呼び出し → レスポンス返却 のみ
- `NextRequest` からのデータ抽出は `route.ts` 内でのみ行う
- DIは使わず、明示的なimportで依存を解決する

## 3. NestJS 構成（移行後）

### ディレクトリ構造（リソース名は単数形）
```
src/[resource]/
  [resource].module.ts
  [resource].controller.ts     ← Handler
  [resource].service.ts        ← Service
  [resource].repository.ts     ← Repository
  dto/
    create-[resource].dto.ts
    update-[resource].dto.ts
```

### ルール
- NestJSのDIコンテナを使用し、コンストラクタインジェクションで依存を解決する
- DTOは class-validator + class-transformer でバリデーション
- Guard で認証、Pipe でバリデーション、Interceptor でレスポンス変換
- Controller で req/res を直接操作しない（`@Body()`, `@Param()` 等のデコレータで取得）

## 4. 移行容易性の確保

Service層とRepository層をフレームワーク非依存に保つことで、移行時の変更を最小化する：
- **移行時に変更する**: Handler層（route.ts → Controller）、バリデーション（Zod → class-validator）
- **移行時に変更しない**: Service層、Repository層、ドメインエラー定義、Prismaスキーマ
