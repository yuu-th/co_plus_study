---
id: ui-header-logo-profile-nav
feature: home
depends_on:
  - design-spec-home-improvements
scope_files:
  - frontend/src/components/layout/Header/Header.tsx
  - frontend/src/components/layout/Header/Header.module.css
  - frontend/src/pages/ProfilePage/ProfilePage.tsx
  - frontend/src/pages/ProfilePage/ProfilePage.module.css
  - frontend/src/router.tsx
forbidden_files:
  - frontend/src/mockData/
  - frontend/src/types/
created_at: 2025-11-27
---

# タスク: ロゴクリック・ユーザー名プロフィール機能実装

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル | 読む目的 |
|------|----------|----------|
| 1 | `specs/overview.md` | システム全体像・技術制約 |
| 2 | `specs/features/home.md` | ホーム画面仕様（作成後） |
| 3 | `specs/shared/conventions.md` | コーディング規約 |

## 1. タスク概要

2つのナビゲーション機能を実装:

1. **ロゴをクリック** → ホーム画面へ遷移
2. **ユーザー名をクリック** → プロフィール画面へ遷移（新規）

## 2. 完了条件

- [ ] Header でロゴがクリッカブルになり、ホームへ遷移
- [ ] ユーザー名がクリッカブルになり、プロフィール画面へ遷移
- [ ] ProfilePage が新規作成されている
- [ ] プロフィール画面にユーザー情報とフリガナが表示される
- [ ] TypeScriptエラーなし
- [ ] router.tsx に /profile ルート追加

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/components/layout/Header/Header.tsx` | 編集 |
| `frontend/src/components/layout/Header/Header.module.css` | 編集 |
| `frontend/src/pages/ProfilePage/ProfilePage.tsx` | 新規作成 |
| `frontend/src/pages/ProfilePage/ProfilePage.module.css` | 新規作成 |
| `frontend/src/router.tsx` | 編集（ルート追加） |

## 4. 実装仕様

### Header コンポーネント

ロゴ・ユーザー名をクリッカブルに:

```tsx
// Header.tsx
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick?: () => void;
  userName?: string;
}

const Header = ({ onMenuClick, userName = 'ユーザー' }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogoClick = () => navigate('/');
  const handleUserNameClick = () => navigate('/profile');

  return (
    <header className={styles.header}>
      <button className={styles.logoButton} onClick={handleLogoClick}>
        {/* ロゴ画像またはテキスト */}
        Co+ Study
      </button>
      {/* ... 既存のメニューボタン ... */}
      <div className={styles.userInfo}>
        <button className={styles.userButton} onClick={handleUserNameClick}>
          <FaUser className={styles.userIcon} />
          <span className={styles.userName}>{userName}</span>
        </button>
      </div>
    </header>
  );
};
```

### ProfilePage コンポーネント

新規作成:

```tsx
// ProfilePage.tsx

interface UserProfile {
  id: string;
  name: string;
  kana: string;              // フリガナ
  avatarUrl?: string;
  joinedAt: string;          // 参加日
  totalStudyHours: number;   // 総学習時間
  totalPosts: number;        // 総投稿数
}

interface ProfilePageProps {
  // なし（モックデータから取得）
}

const ProfilePage = () => {
  // モックデータから現在ユーザー情報を取得
  const user: UserProfile = {
    id: '1',
    name: '田中太郎',
    kana: 'たなかたろう',
    avatarUrl: '/assets/avatar.png',
    joinedAt: '2024-01-15',
    totalStudyHours: 156,
    totalPosts: 42,
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>プロフィール</h1>
      
      <div className={styles.profileCard}>
        <img src={user.avatarUrl} alt={user.name} className={styles.avatar} />
        
        <div className={styles.info}>
          <div className={styles.field}>
            <label>名前</label>
            <p>{user.name}</p>
          </div>
          
          <div className={styles.field}>
            <label>フリガナ</label>
            <p>{user.kana}</p>
          </div>
          
          <div className={styles.field}>
            <label>参加日</label>
            <p>{new Date(user.joinedAt).toLocaleDateString('ja-JP')}</p>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <h3>総学習時間</h3>
          <p className={styles.value}>{user.totalStudyHours} 時間</p>
        </div>
        <div className={styles.stat}>
          <h3>投稿数</h3>
          <p className={styles.value}>{user.totalPosts} 件</p>
        </div>
      </div>

      <Link to="/"><Button variant="outline">戻る</Button></Link>
    </div>
  );
};
```

### ルーティング

router.tsx に以下を追加:

```tsx
import ProfilePage from './pages/ProfilePage/ProfilePage';

// routes配列に追加:
{
  path: '/profile',
  element: <ProfilePage />,
}
```

## 5. スタイリング

```css
/* Header.module.css に追加 */

.logoButton {
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: color 0.2s;
}

.logoButton:hover {
  color: var(--color-accent-blue);
}

.userButton {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  color: var(--color-text-primary);
}

.userButton:hover {
  opacity: 0.8;
}

/* ProfilePage.module.css */

.page {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.profileCard {
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: var(--spacing-md);
}

.info {
  width: 100%;
}

.field {
  margin-bottom: var(--spacing-md);
}

.field label {
  font-weight: bold;
  color: var(--color-text-secondary);
  display: block;
  margin-bottom: 4px;
}

.field p {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.stat {
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  text-align: center;
}

.stat h3 {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-accent-blue);
}
```

## 6. 注意事項

- ロゴテキストは「Co+ Study」または「Co+Study」（仕様参照: 「×CO+Study」「○Co+Study」）
- フリガナはモックデータから取得（後に型定義で正式化）
- ユーザー情報はモックデータのため、実装時は `mockUsers` から取得

## 7. 完了報告

```markdown
## 完了報告

### タスクID
ui-header-logo-profile-nav

### 作成/編集ファイル
- Header.tsx - 編集（ロゴ・ユーザー名をクリッカブルに）
- Header.module.css - 編集（スタイル追加）
- ProfilePage.tsx - 新規作成
- ProfilePage.module.css - 新規作成
- router.tsx - 編集（/profile ルート追加）

### 主要な変更点
- ロゴクリック → ホーム遷移
- ユーザー名クリック → プロフィール画面遷移
- プロフィール画面で名前、フリガナ、統計情報を表示

### 未解決の問題
- なし
```
