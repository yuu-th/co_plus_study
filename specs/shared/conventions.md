# コーディング規約

> 最終更新: 2025-11-25

## 概要

CO+ Studyプロジェクトのコーディング規約。

---

## 1. TypeScript

### 型定義

```typescript
// ✅ Good: interfaceを優先
interface UserProps {
  name: string;
  age: number;
}

// ✅ Good: typeはユニオン型のみ
type Status = 'idle' | 'loading' | 'success' | 'error';

// ❌ Bad: anyは禁止
const data: any = {};

// ✅ Good: unknownを使用
const data: unknown = {};
```

### Type-only imports

Viteの`verbatimModuleSyntax`により必須:

```typescript
// ✅ Good
import type { User } from './types';
import { mockUsers } from './mock';

// ❌ Bad
import { User } from './types';
```

### 仕様参照コメント

型定義ファイルの先頭に記載:

```typescript
// @see specs/features/diary.md
export interface DiaryPost { ... }
```

---

## 2. React

### 関数コンポーネント

```typescript
// ✅ Good: 通常の関数 + Props分割代入
interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card = ({ title, children }: CardProps) => {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default Card;

// ❌ Bad: React.FCは使用しない
const Card: React.FC<CardProps> = () => {};
```

### デフォルト値

```typescript
// ✅ Good: 分割代入でデフォルト設定
const Button = ({ 
  variant = 'primary',
  size = 'medium',
  children 
}: ButtonProps) => {};
```

### ファイル構成順序

```typescript
// 1. imports
import type { ... } from '...';
import { useState } from 'react';
import styles from './Component.module.css';

// 2. 型定義
interface ComponentProps { ... }

// 3. コンポーネント
const Component = ({ ... }: ComponentProps) => {
  // 3a. hooks
  const [state, setState] = useState();
  
  // 3b. handlers
  const handleClick = () => {};
  
  // 3c. JSX
  return <div>...</div>;
};

// 4. export
export default Component;
```

---

## 3. CSS Modules

### ファイル名

```
ComponentName.module.css
```

### クラス名（camelCase）

```css
/* ✅ Good */
.container { }
.headerTitle { }
.isActive { }

/* ❌ Bad: BEM、kebab-case */
.header-title { }
.header__title { }
.header--active { }
```

### CSS変数の使用

```css
/* ✅ Good: 変数を使用 */
.button {
  background-color: var(--color-accent-blue);
  padding: var(--spacing-sm) var(--spacing-md);
}

/* ❌ Bad: ハードコード */
.button {
  background-color: #4DB8E8;
  padding: 8px 16px;
}
```

---

## 4. 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `DiaryPostCard.tsx` |
| CSSモジュール | PascalCase.module.css | `DiaryPostCard.module.css` |
| 型ファイル | camelCase | `types.ts` |
| モックファイル | camelCase | `mock.ts` |
| ユーティリティ | camelCase | `groupByDate.ts` |
| ディレクトリ | camelCase | `diary/`, `notification/` |
| 関数 | camelCase | `handleSubmit`, `formatDate` |
| 定数 | UPPER_SNAKE_CASE | `MAX_LENGTH`, `REACTION_TYPES` |
| CSS変数 | kebab-case | `--color-bg-primary` |

---

## 5. モックデータ

### ファイル配置

各機能ディレクトリ内の `mock.ts`:

```
features/diary/mock.ts
features/chat/mock.ts
```

### 命名

```typescript
// ✅ Good: mock + 複数形
export const mockDiaryPosts: DiaryPost[] = [];
export const mockUsers: User[] = [];

// ❌ Bad
export default [];
```

### タイムスタンプ

```typescript
// ✅ Good: ISO 8601
{ timestamp: '2025-11-25T14:30:00Z' }

// ❌ Bad
{ timestamp: '2025/11/25 14:30' }
{ timestamp: 1732545000000 }
```

---

## 6. アクセシビリティ

### セマンティックHTML

```tsx
// ✅ Good
<header>
  <nav aria-label="メインナビゲーション">
    <ul>...</ul>
  </nav>
</header>
<main>
  <section aria-labelledby="title">
    <h2 id="title">タイトル</h2>
  </section>
</main>

// ❌ Bad
<div class="header">
  <div class="nav">...</div>
</div>
```

### ARIAラベル

```tsx
<button aria-label="閉じる" onClick={onClose}>×</button>
<input aria-describedby="hint" />
<span id="hint">半角英数字で入力</span>
```

### キーボード操作

- すべてのインタラクティブ要素はTabでフォーカス可能
- EnterまたはSpaceでアクション実行
- ESCでモーダル/ドロップダウンを閉じる

---

## 7. 禁止事項

- ❌ `any` 型の使用
- ❌ `React.FC` の使用
- ❌ CSS値のハードコード
- ❌ `fetch` / `axios` によるAPI通信
- ❌ `localStorage` / `sessionStorage` の使用
- ❌ 外部UIライブラリ（Material UI, Ant Design等）
- ❌ styled-components / Emotion / Tailwind

---

## 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-11-25 | 初版作成 |
