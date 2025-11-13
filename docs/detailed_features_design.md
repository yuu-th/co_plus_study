# 詳細機能設計書 - 学習日報・相談・アンケート・チュートリアル・お知らせ・管理者機能

## 目次
## 3. アンケート機能

### 3.1. 概要
アンケートは運営（メンター/管理者）が配信・スケジュールし、生徒は配信されたアンケートの中から選んで回答できる仕組みにします。
多くのアンケートを一度に一覧で表示するのではなく、「配信済み/利用可能なアンケート」を選べるカード型UIで提示し、期末や特定期間に運営からまとめて配信する運用を想定します（モックでスケジュール表現を実装）。

### 3.2. UX方針（生徒向け）
- 「アンケート」ページは2つの領域で構成:
  - 上部: 現在利用可能なアンケート（カード表示、最大3件を目立たせる。その他は「もっと見る」）
  - 下部: 過去に回答したアンケートの履歴（フィルター可能）

- カードには以下を含む:
  - タイトル、短い説明
  - 配信元（運営/メンター名）
  - 公開期間（開始日〜締切日）と残り日数バッジ
  - 進捗インジケーター（未回答/回答済み）
  - プレビューボタン（質問の一部を確認）

- 表示数制御:
  - デスクトップは3件を優先表示、残りは「もっと見る」で展開
  - モバイルは1〜2件を縦スクロールで表示

### 3.3. コンポーネント設計（生徒）

#### SurveyCardList
```typescript
interface SurveyCardListProps {
  surveys: SurveySummary[]; // 公開中または自分に割当られたアンケートのサマリ
  onSelect: (id: string) => void;
  onShowMore: () => void;
}
```

#### SurveyCard
```typescript
interface SurveySummary {
  id: string;
  title: string;
  description?: string;
  publisher: string; // 運営/メンター
  releaseDate: string; // 公開開始
  dueDate?: string; // 締切
  isAnswered: boolean;
}
```

#### SurveyPage（個別アンケート表示）
```typescript
interface SurveyPageProps {
  surveyId: string;
  onSubmit: (answers: Answer[]) => void;
}
```

**特徴:**
- 生徒は1件ずつアンケートを開いて回答する（ステップ形式 or 一括表示はアンケート定義に依存）
- 回答中は進捗を保存できる（モック: local state）の警告
- 回答期限を過ぎると自動的に受付終了（UI上で締切表記）

### 3.4. 管理画面（運営/メンター）

運営側はアンケートを作成し、配信スケジュールを指定して特定グループ（全員／学年／クラス）へ送付できます。配信はモック上で「公開開始日時」を設定し、フロントで公開状態を切り替えます。

#### AdminSurveyManager
```typescript
interface AdminSurveyManagerProps {
  surveys: SurveyDraft[];
  onPublish: (id: string, options: PublishOptions) => void;
}

interface SurveyDraft {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  draft: boolean;
  releaseDate?: string;
  dueDate?: string;
  targetGroups?: string[]; // 例: ['grade_6','class_a']
}

interface PublishOptions {
  releaseDate: string; // 即時または将来日時
  dueDate?: string;
  targetGroups?: string[];
}
```

**機能（管理者）:**
- アンケート作成・編集（ドラフト保存）
- 公開日時（releaseDate）を予約して配信
- 対象グループの指定（全体/学年/個別クラス）
- 締切日の設定とリマインダー（モック: UIで表示）
- プレビューと下書き保存

### 3.5. モックデータ仕様とスケジューリング

`mockData/surveys.ts` には複数のアンケート定義を用意し、各アンケートに `releaseDate` と `dueDate`、`targetGroups` を含めます。アプリ側は現在日時と `releaseDate` を比較して表示可否を判断します（モックでのスケジュール表現）。

例:
```typescript
export const mockSurveys: SurveyDraft[] = [
  {
    id: 's1',
    title: '期末アンケート（算数）',
    description: '期末テストの感想と学習ニーズを教えてください',
    releaseDate: '2025-12-10T09:00:00Z',
    dueDate: '2025-12-20T23:59:59Z',
    targetGroups: ['grade_6'],
    draft: false,
    questions: [ /* ... */ ],
  },
  // 複数定義
];
```

### 3.6. 通知と表示ロジック（簡易）

- 運営が `releaseDate` を設定すると、当該日時以降に `SurveyCardList` に表示される
- フロントの `useNotifications` フックが未読アンケートや公開開始の通知を作る（モック）
- 締切直前（例: 3日前）に未回答者向けのリマインダー表示を行う（UI表示のみ、実送信はしない）

### 3.7. アクセシビリティ

- アンケートの質問はすべてラベルつきで、必須項目は明示する
- ラジオ/チェックボックスはキーボードで操作できること
- プレビューやモーダルはフォーカストラップを実装する

---

## 4. チュートリアル機能
**機能:**
- 日付ごとにグループ化して表示
- 各投稿カードに以下を表示:
  - 時刻（HH:MM）
  - 教科アイコン・名前
  - 学習時間
  - 学習内容
  - 絵文字リアクション（クリック不可、表示のみ）
- 無限スクロール
- フィルター機能（教科別、期間別）

#### DiaryPostCard（投稿カード）
```typescript
interface DiaryPostCardProps {
  post: DiaryPost;
  isOwn: boolean; // 自分の投稿かどうか
}
```

**デザイン:**
- カード形式
- 左側に教科アイコンと時刻
- 右側に学習内容と時間
- 下部に絵文字リアクション表示（例: 👍 3  ❤️ 1）
- ホバー時に微妙にシャドウを強調

#### DiaryStats（統計情報）
```typescript
interface DiaryStatsProps {
  totalHours: number; // 総学習時間
  totalPosts: number; // 総投稿数
  thisWeekHours: number; // 今週の学習時間
  thisWeekPosts: number; // 今週の投稿数
  subjectBreakdown: { subject: string; hours: number }[];
}
```

**表示内容:**
- 今週の総学習時間
- 今週の投稿数
- 教科別の学習時間（円グラフまたは横棒グラフ）

### 1.4. カラースキーム

```css
/* 教科別カラー */
--color-subject-japanese: #FF6B9D;   /* 国語: ピンク */
--color-subject-math: #4169E1;       /* 算数: ブルー */
--color-subject-science: #32CD32;    /* 理科: グリーン */
--color-subject-social: #FF8C00;     /* 社会: オレンジ */
--color-subject-english: #9370DB;    /* 英語: パープル */
--color-subject-other: #808080;      /* その他: グレー */

/* 投稿カード */
--color-post-bg: #FFFFFF;
--color-post-border: #E0E0E0;
--color-post-hover: #F5F5F5;

/* リアクション */
--color-reaction-bg: #F0F0F0;
--color-reaction-active: #FFD700;
```

---

## 2. 相談（チャット）機能

### 2.1. 概要
生徒がメンターと1対1でチャットできる機能。リアルタイム風のUI（実際はモック）。

### 2.2. 画面構成の方針

**レイアウト:**
- 上部にメンター情報ヘッダー
- 中央にメッセージリスト（スクロール可能）
- 下部に入力エリア（固定）

**特徴:**
- LINE/Slackのような吹き出し形式
- 日付区切り（「今日」「昨日」「○月○日」）
- 既読表示

### 2.3. コンポーネント設計

#### ChatMessage
```typescript
interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'mentor';
  content: string;
  timestamp: string;
  isRead: boolean;
}
```

**デザイン:**
- 吹き出し形式
- 自分のメッセージ: 右寄せ、青系背景
- 相手のメッセージ: 左寄せ、グレー系背景
- タイムスタンプ: 吹き出しの下に小さく表示
- 既読マーク（自分のメッセージのみ）

#### ChatInput
```typescript
interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}
```

**機能:**
- テキスト入力欄（複数行対応）
- Enterキーで送信（Shift+Enterで改行）
- 送信ボタン
- 文字数カウンター（最大500文字）

#### ChatHeader
```typescript
interface ChatHeaderProps {
  mentorName: string;
  mentorStatus: 'online' | 'offline';
  lastSeen?: string;
}
```

**表示内容:**
- メンター名
- オンライン/オフラインステータス
- 最終ログイン時刻

#### MessageList
```typescript
interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onLoadMore?: () => void;
}
```

**機能:**
- メッセージを時系列で表示
- 自動スクロール（新着メッセージ受信時）
- 日付区切り（「今日」「昨日」「○月○日」）
- 上スクロールで過去メッセージ読み込み

### 2.4. カラースキーム

```css
/* チャット関連 */
--color-message-own: #DCF8C6;        /* 自分のメッセージ背景 */
--color-message-other: #ECECEC;      /* 相手のメッセージ背景 */
--color-message-timestamp: #999999;  /* タイムスタンプ */
--color-online: #34B7F1;             /* オンライン表示 */
--color-offline: #CCCCCC;            /* オフライン表示 */
```

---

## 3. アンケート機能

### 3.1. 概要
生徒からフィードバックや満足度を収集するアンケート機能。

### 3.2. 画面構成の方針

**レイアウト:**
- 上部にアンケートタイトルと説明
- 中央に質問リスト（順次表示またはステップ形式）
- 下部に送信ボタン

### 3.3. コンポーネント設計

#### SurveyForm
```typescript
interface SurveyFormProps {
  survey: Survey;
  onSubmit: (answers: Answer[]) => void;
  onCancel?: () => void;
}

interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

interface Question {
  id: string;
  type: 'single' | 'multiple' | 'text' | 'rating';
  text: string;
  options?: string[];
  required: boolean;
  maxLength?: number; // テキスト質問の最大文字数
}

interface Answer {
  questionId: string;
  value: string | string[] | number;
}
```

**機能:**
- 質問タイプに応じた入力UI
- バリデーション（必須項目チェック）
- 進捗表示（「3問中2問回答済み」）
- 一時保存機能（離脱時に警告）

#### QuestionItem
```typescript
interface QuestionItemProps {
  question: Question;
  answer?: Answer;
  onChange: (answer: Answer) => void;
  error?: string;
}
```

**質問タイプ別UI:**
1. **単一選択 (single)**: ラジオボタン
2. **複数選択 (multiple)**: チェックボックス
3. **テキスト (text)**: テキストエリア
4. **評価 (rating)**: 星評価（5段階）

#### SurveyComplete
```typescript
interface SurveyCompleteProps {
  message?: string;
  onClose: () => void;
}
```

**表示内容:**
- 完了メッセージ
- サンキューメッセージ
- ホームに戻るボタン

---

## 4. チュートリアル機能

### 4.1. 概要
初回利用者に主要機能の使い方を案内するクエスト形式のチュートリアル。

### 4.2. 画面構成の方針

**表示形式:**
- モーダルウィンドウ
- 対象要素のハイライト
- 進捗バー

### 4.3. コンポーネント設計

#### TutorialModal
```typescript
interface TutorialModalProps {
  isOpen: boolean;
  quest: Quest;
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  targetElement?: string; // ハイライト対象のセレクタ
  targetDescription?: string;
  step: number;
  totalSteps: number;
  isCompleted: boolean;
  action?: 'click' | 'input' | 'navigate';
}
```

**機能:**
- モーダルウィンドウ表示
- 操作対象のハイライト（矢印やオーバーレイ）
- 進捗バー表示
- 次へ/スキップボタン
- 完了時のアニメーション

#### ProgressBar
```typescript
interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  color?: string;
}
```

**表示:**
- プログレスバー
- パーセンテージ表示
- 「○問中△問完了」

#### Highlight
```typescript
interface HighlightProps {
  targetSelector: string;
  message?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}
```

**機能:**
- 対象要素をハイライト
- オーバーレイで他の要素を暗く
- 矢印で対象を指示
- ツールチップでメッセージ表示

### 4.4. クエスト一覧

1. **初めての日報を投稿しよう**
   - 学習日報ページへ移動
   - 投稿フォームに入力
   - 投稿ボタンをクリック

2. **ARCHIVEを見てみよう**
   - ARCHIVEページへ移動
   - カレンダータブを確認
   - スキルタブを確認

3. **メンターに相談してみよう**
   - 相談ページへ移動
   - メッセージを入力
   - 送信ボタンをクリック

4. **目標を確認しよう**
   - 継続日数を確認
   - 次のバッジを確認

5. **完了！**
   - 全クエスト達成
   - 初回バッジ獲得

---

## 5. お知らせ機能

### 5.1. 概要
メンターからの重要なお知らせを**インタラクティブ**に表示する機能。
ただのリスト表示ではなく、ユーザーが見たくなる工夫を施す。

### 5.2. 画面構成の方針

**レイアウト:**
- ホームページ、またはサイドバーにお知らせウィジェット
- カード形式でビジュアルを重視
- 未読/既読の明確な区別

**インタラクティブ要素:**
- 未読バッジ（数字）
- ホバー時のアニメーション
- クリックで詳細モーダル表示
- カテゴリ別の色分け

### 5.3. コンポーネント設計

#### NotificationList
```typescript
interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

interface Notification {
  id: string;
  category: 'info' | 'important' | 'event' | 'achievement';
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  iconUrl?: string; // カテゴリアイコン
}
```

**機能:**
- カード形式で表示
- カテゴリ別アイコンと色分け
  - info: 青（一般情報）
  - important: 赤（重要）
  - event: 緑（イベント）
  - achievement: 金（達成・バッジ獲得）
- 未読は太字＋背景色で強調
- クリックで詳細モーダル
- 「すべて既読にする」ボタン

#### NotificationCard
```typescript
interface NotificationCardProps {
  notification: Notification;
  onClick: () => void;
}
```

**デザイン:**
- カード形式
- 左側にカテゴリアイコン
- 右側にタイトルと日時
- 未読は左端に青い縦線
- ホバー時に微妙に浮き上がる（shadow）

#### NotificationModal
```typescript
interface NotificationModalProps {
  notification: Notification;
  isOpen: boolean;
  onClose: () => void;
}
```

**表示内容:**
- タイトル
- 全文（改行・装飾対応）
- 投稿日時
- 閉じるボタン

#### NotificationBadge
```typescript
interface NotificationBadgeProps {
  count: number; // 未読件数
  position?: 'top-right' | 'top-left';
}
```

**表示:**
- 赤い丸バッジ
- 件数を白文字で表示
- 配置位置をカスタマイズ可能

### 5.4. カラースキーム

```css
/* お知らせカテゴリ */
--color-notification-info: #2196F3;       /* 一般情報: 青 */
--color-notification-important: #F44336;  /* 重要: 赤 */
--color-notification-event: #4CAF50;      /* イベント: 緑 */
--color-notification-achievement: #FFD700; /* 達成: 金 */

/* お知らせ状態 */
--color-notification-unread-bg: #E3F2FD;  /* 未読背景 */
--color-notification-unread-border: #2196F3; /* 未読左線 */
--color-notification-badge: #FF0000;      /* バッジ背景 */
```

---

## 6. 管理者（メンター）側機能

### 6.1. 概要
メンターが生徒を管理し、日報にリアクションし、お知らせを投稿するための管理画面。

### 6.2. 主要機能

#### 6.2.1. メンター登録・ログイン
- メンター専用のログインフォーム
- 既存のログインページに「メンターとしてログイン」リンク追加

#### 6.2.2. ダッシュボード
- 担当生徒一覧
- 未読メッセージ件数
- 最近の日報投稿（全生徒分）
- お知らせ投稿ボタン

#### 6.2.3. 生徒管理
- 生徒リスト表示
- 各生徒の学習状況確認
- 生徒の詳細ページへ遷移

#### 6.2.4. 日報への絵文字リアクション
- 生徒の日報タイムラインを表示
- 各投稿に絵文字ボタンを配置
- リアクション済みの絵文字はハイライト

#### 6.2.5. お知らせ投稿
- お知らせ作成フォーム
- カテゴリ選択
- プレビュー機能
- 投稿・下書き保存

#### 6.2.6. チャット（生徒側と同様）
- 担当生徒とのチャット
- 複数の生徒とのチャットを管理

### 6.3. コンポーネント設計

#### MentorDashboard
```typescript
interface MentorDashboardProps {
  students: StudentSummary[];
  unreadMessages: number;
  recentPosts: DiaryPost[];
}

interface StudentSummary {
  id: string;
  name: string;
  avatarUrl?: string;
  totalPosts: number;
  totalHours: number;
  lastActivity: string;
}
```

**表示内容:**
- 担当生徒カード（グリッド）
- 未読メッセージバッジ
- 最近の日報投稿（タイムライン形式）
- お知らせ投稿ボタン

#### StudentList
```typescript
interface StudentListProps {
  students: StudentSummary[];
  onSelectStudent: (id: string) => void;
}
```

**機能:**
- 生徒をカード形式で表示
- 各カードに名前、学習時間、最終活動日
- クリックで詳細ページへ

#### StudentDetailPage
```typescript
interface StudentDetailPageProps {
  student: StudentDetail;
}

interface StudentDetail extends StudentSummary {
  posts: DiaryPost[];
  stats: {
    continuousDays: number;
    totalHours: number;
    subjectBreakdown: { subject: string; hours: number }[];
  };
}
```

**表示内容:**
- 生徒の基本情報
- 学習統計（グラフ）
- 日報タイムライン（リアクション可能）

#### ReactionButton
```typescript
interface ReactionButtonProps {
  type: '👍' | '❤️' | '🎉' | '👏' | '🔥';
  count: number;
  isActive: boolean; // 自分が押したか
  onClick: () => void;
}
```

**機能:**
- 絵文字ボタン
- クリックでリアクション追加/削除
- カウント表示
- 押下済みはハイライト

#### NotificationEditor
```typescript
interface NotificationEditorProps {
  onSubmit: (notification: NotificationDraft) => void;
  onSaveDraft: (notification: NotificationDraft) => void;
}

interface NotificationDraft {
  category: 'info' | 'important' | 'event' | 'achievement';
  title: string;
  content: string;
}
```

**機能:**
- カテゴリ選択
- タイトル入力
- 内容入力（リッチテキストまたはMarkdown）
- プレビュー表示
- 投稿・下書き保存ボタン

### 6.4. ルーティング

```typescript
// メンター側のルート
/mentor/login          // メンターログイン
/mentor/dashboard      // ダッシュボード
/mentor/students       // 生徒一覧
/mentor/students/:id   // 生徒詳細
/mentor/notifications  // お知らせ管理
/mentor/chat           // チャット
```

### 6.5. レイアウト

**メンター専用サイドバー:**
- ダッシュボード
- 生徒一覧
- お知らせ管理
- チャット
- ログアウト

---

## 7. 実装優先度

### Phase 1（完了済み）
1. ✅ ARCHIVEページ

### Phase 2（次回実装）
1. **学習日報機能（生徒側）**
   - DiaryPostForm
   - DiaryTimeline（日付グループ化、絵文字表示のみ）
   - DiaryPostCard
   - DiaryStats
   - DiaryPage統合

### Phase 3
1. **お知らせ機能**
   - NotificationList
   - NotificationCard
   - NotificationModal
   - NotificationBadge
   - ホームページに統合

### Phase 4
1. **相談機能**
   - ChatMessage
   - ChatInput
   - ChatHeader
   - MessageList
   - ChatPage統合

### Phase 5
1. **アンケート機能**
   - QuestionItem
   - SurveyForm
   - SurveyComplete
   - SurveyPage統合

### Phase 6
1. **チュートリアル機能**
   - TutorialModal
   - ProgressBar
   - Highlight
   - TutorialPage統合

### Phase 7
1. **管理者（メンター）側機能**
   - MentorDashboard
   - StudentList
   - StudentDetailPage
   - ReactionButton（日報へのリアクション）
   - NotificationEditor
   - メンター専用レイアウト・ルーティング

---

## 8. モックデータの拡張

各機能に必要な追加モックデータ:

### 学習日報（タイムライン形式）
- 過去7日分、1日2-3投稿
- 絵文字リアクション付き
- 教科別、時間別のデータ

### お知らせ
- 5-10件のお知らせ
- カテゴリ別（info, important, event, achievement）
- 未読/既読状態

### 相談
- 過去のチャット履歴（10-20件）
- メンターのステータス情報
- 既読/未読状態

### アンケート
- 1-2種類のアンケートテンプレート
- 質問パターン（単一選択、複数選択、テキスト、評価）

### チュートリアル
- 5つのクエストデータ
- 各クエストの説明文とターゲット要素

### 管理者側
- 生徒リスト（3-5人）
- 各生徒の統計情報
- メンターの情報

---

## 9. アクセシビリティ考慮事項

### 学習日報
- フォーム項目に適切なラベル
- エラーメッセージの明確な表示
- キーボード操作でフォーム送信可能

### お知らせ
- 未読件数をスクリーンリーダーで読み上げ
- カテゴリアイコンにalt属性
- キーボードで既読操作可能

### 相談
- 新着メッセージの通知（スクリーンリーダー対応）
- チャット履歴のスクロール位置保持
- キーボードショートカット（Enter送信など）

### アンケート
- 質問項目のARIAラベル
- エラー状態の明確な表示
- フォーカス管理

### チュートリアル
- スキップ可能
- ESCキーで閉じる
- フォーカストラップ（モーダル内）

---

**この設計書について承認いただけましたら、実装を開始します。**
**修正や追加の要望があれば、お知らせください。**
