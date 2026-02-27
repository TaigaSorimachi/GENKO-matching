# フロントエンドアーキテクチャルール

## 1. 3層分離構造

1つの機能コンポーネントは必ず以下の3ファイルで構成する:
- `*.view.tsx` — View
- `*.container.tsx` — Container
- `hooks/use[Feature].ts` — Hook

## 2. View (`*.view.tsx`)
- Hooks一切禁止（useState, useEffect, カスタムフック全て）
- 全データ・ハンドラはPropsで受け取る
- 条件分岐・map以外のロジック禁止
- 小さなサブコンポーネントを組み合わせる（モノリシックなJSX禁止）

## 3. Container (`*.container.tsx`)
- HookをCallし、返り値をViewのPropsにマッピングするだけ
- `<div>`等のUI要素の記述禁止
- 外部に公開するのはContainer

## 4. Hook (`hooks/use[Feature].ts`)
- 状態管理、バリデーション等のロジックを集約
- API通信は `api/` に切り出し、Hookからはそれを呼ぶだけ

## 5. 命名規則
- イベントハンドラProps: `onXxx` / Hook内実装: `handleXxx`
- boolean: `isXxx`, `hasXxx`, `canXxx`
- リスト: 複数形 (`users`, `items`)

## 6. コンポーネント粒度
- 意味のあるまとまり（カード、リストアイテム、フォームセクション等）は即座に別ファイルへ切り出す
- サブコンポーネントは同じ `ui/` ディレクトリに `[SubComponent].view.tsx` として配置する
- Prop Drillingが深くなる場合はchildren（Slot Pattern）を検討

## 7. スタイリング
- Tailwind CSS + shadcn/ui で統一（他の手法との混在禁止）
- インラインstyle禁止、className + Tailwindユーティリティで記述する

## 8. エラー・ローディングの統一方針
- ローディング中: Skeleton表示
- APIエラー: Toast通知
- フォームバリデーションエラー: フィールド直下にインライン表示

## 9. ディレクトリ構造

feature ディレクトリ名はリソースの複数形ケバブケース（例: `users`, `todo-items`）とする。
ケバブケースからPascalCase/camelCaseへの変換は、ハイフン区切りで各単語の先頭を大文字にする（例: `todo-items` → `TodoItems` / `todoItems`）。

```
features/[resources]/
  ui/
    [Resources].view.tsx
    [Resources].container.tsx
    [SubComponent].view.tsx          ← サブコンポーネントも ui/ 直下に配置
    [resources].tsx (re-export)
  hooks/
    use[Resources].ts
  api/
    [resource].api.ts
  model/ (Prisma生成型・共有型で不足するfeature固有の型がある場合のみ作成)
    types.ts
```

### re-export ファイル
`[resources].tsx` は Container を named export する:
```tsx
export { [Resources]Container as [Resources] } from './[Resources].container';
```

### API関数の命名
`[resource].api.ts` 内の関数名は `HTTPメソッド + リソース名` とする:
```ts
// user.api.ts
export const getUsers = ...
export const getUser = ...
export const createUser = ...
export const updateUser = ...
export const deleteUser = ...
```
