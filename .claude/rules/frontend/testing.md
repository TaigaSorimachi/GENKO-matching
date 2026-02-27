# フロントエンドテストルール

@rules/testing-common.md の共通ルールに従う。以下はフロントエンド固有のルール。

## テスト戦略

統合テストで正常系をカバーする。

### 統合テスト（メイン）
- Hook + api/ を組み合わせ、MSW でAPIをモックして一連のフローを検証する
- 正常系を優先し、エラーレスポンス（4xx, 5xx）のハンドリングもカバーする

### ユニットテスト（補完）
- 統合テストではカバーしづらい複雑なロジックに限定する
- 対象: 条件分岐が多いHook内のビジネスロジック、複雑な状態遷移

### View
- RTL でレンダーし、Propsで受け取る全イベントハンドラ（`onXxx`）が正しく呼ばれることを検証する
- 表示の出し分け（ローディング/エラー/空状態）が正しいことを確認する
- Viewはpropsのみで決まるため、モックpropsを渡すだけでテスト可能

### Container
- テスト不要（統合テストとViewのテストで間接的にカバー）

## テストファイルの配置

```
features/[resources]/
  __tests__/
    [resources].integration.test.ts     ← 統合テスト
    [resources].unit.test.ts            ← ユニットテスト（必要な場合のみ）
    [Resources].view.test.tsx           ← Viewテスト
  __tests__/factories/
    [resources].factory.ts              ← テストデータファクトリ
```
