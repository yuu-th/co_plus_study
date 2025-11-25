# 共通コンポーネント仕様

> 最終更新: 2025-11-25

## 概要

複数の機能で再利用される共通UIコンポーネントの仕様。
実装場所: `frontend/src/shared/components/`

## Button

### バリアント

| variant | 用途 | スタイル |
|---------|------|----------|
| primary | メインアクション | 青背景・白文字 |
| secondary | サブアクション | 白背景・青文字・青枠 |
| outline | 控えめ | 透明背景・グレー枠 |
| ghost | 最小限 | 透明背景・枠なし |

### サイズ

| size | padding | font-size |
|------|---------|-----------|
| small | 4px 8px | 12px |
| medium | 8px 16px | 14px |
| large | 12px 24px | 16px |

### Props

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

---

## Card

### バリアント

| padding | 値 |
|---------|-----|
| none | 0 |
| sm | 8px |
| md | 16px |
| lg | 24px |

### Props

```typescript
interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}
```

---

## Modal

### サイズ

| size | max-width |
|------|-----------|
| small | 400px |
| medium | 600px |
| large | 800px |

### Props

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}
```

### アクセシビリティ要件

- ESCキーで閉じる
- フォーカストラップ（モーダル内でTabが循環）
- `role="dialog"`, `aria-modal="true"`
- 背景クリックで閉じる

---

## Badge

### バリアント（ランク）

| rank | 色 |
|------|-----|
| platinum | #E5E4E2 |
| gold | #FFD700 |
| silver | #C0C0C0 |
| bronze | #CD7F32 |

### Props

```typescript
interface BadgeProps {
  rank: 'platinum' | 'gold' | 'silver' | 'bronze';
  name: string;
  description?: string;
  icon?: React.ReactNode;
}
```

---

## EmptyState

空の状態を表示するコンポーネント。

### Props

```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
```

---

## Skeleton

ローディング中のプレースホルダー。

### Props

```typescript
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
}
```

---

## 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-11-25 | EmptyState, Skeleton追加 |
| 2025-11-20 | Modal A11y要件追加 |
| 2025-11-15 | 初版作成 |
