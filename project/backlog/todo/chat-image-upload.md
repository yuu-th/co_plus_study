---
id: chat-image-upload
feature: chat
depends_on: []
scope_files:
  - frontend/src/features/student/components/chat/ChatInput/ChatInput.tsx
  - frontend/src/features/student/components/chat/ChatInput/ChatInput.module.css
  - frontend/src/features/student/components/chat/MessageBubble/MessageBubble.tsx
  - frontend/src/features/student/components/chat/MessageBubble/MessageBubble.module.css
forbidden_files:
  - frontend/src/shared/types/chat.ts
created_at: 2025-12-11
---

# タスク: チャット画像送信機能

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `specs/overview.md` - システム全体像
2. `specs/features/chat.md` - チャット機能の仕様（画像送信セクション）
3. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

チャット入力欄に画像アップロードボタンを追加し、画像を含むメッセージを送信できるようにする。Phase 1のため実際のアップロードは行わず、DataURL（Base64）で画像を保持する。

## 2. 完了条件

- [ ] ChatInput に画像選択ボタン追加
- [ ] ファイル選択ダイアログ表示
- [ ] 画像プレビュー表示（送信前）
- [ ] MessageBubble で画像を表示
- [ ] 画像クリックで拡大表示（簡易モーダル）
- [ ] TypeScriptエラーがないこと
- [ ] 仕様書（chat.md）との整合性確認

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/features/student/components/chat/ChatInput/ChatInput.tsx` | 編集（画像選択追加） |
| `frontend/src/features/student/components/chat/ChatInput/ChatInput.module.css` | 編集（プレビュースタイル） |
| `frontend/src/features/student/components/chat/MessageBubble/MessageBubble.tsx` | 編集（画像表示） |
| `frontend/src/features/student/components/chat/MessageBubble/MessageBubble.module.css` | 編集（画像スタイル） |

**上記以外は編集禁止**

## 4. 実装仕様

### ChatInput.tsx の変更

```typescript
import { useState, useRef } from 'react';
// ... 既存のimport

const ChatInput = ({ onSend }: ChatInputProps) => {
    const [text, setText] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!text.trim() && !selectedImage) return;

        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            senderId: 'student-1',
            content: text,
            imageUrl: selectedImage || undefined,
            timestamp: new Date().toISOString(),
            isRead: false,
        };

        onSend(newMessage);
        setText('');
        setSelectedImage(null);
    };

    return (
        <div className={styles.container}>
            {selectedImage && (
                <div className={styles.imagePreview}>
                    <img src={selectedImage} alt="プレビュー" />
                    <button onClick={() => setSelectedImage(null)} className={styles.removeBtn}>
                        ✕
                    </button>
                </div>
            )}
            <div className={styles.inputRow}>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.imageBtn}
                    aria-label="画像を選択"
                >
                    📷
                </button>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="メッセージを入力..."
                    className={styles.textInput}
                />
                <button onClick={handleSubmit} className={styles.sendBtn}>
                    送信
                </button>
            </div>
        </div>
    );
};
```

### ChatInput.module.css の追加

```css
.imagePreview {
  position: relative;
  max-width: 200px;
  margin-bottom: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.imagePreview img {
  width: 100%;
  height: auto;
  display: block;
}

.removeBtn {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  background-color: var(--color-error);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.inputRow {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}

.imageBtn {
  padding: var(--spacing-sm);
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: 20px;
}

.imageBtn:hover {
  background-color: var(--color-bg-hover);
}
```

### MessageBubble.tsx の変更

```typescript
const MessageBubble = ({ message, isMine }: MessageBubbleProps) => {
    const [showImageModal, setShowImageModal] = useState(false);

    return (
        <>
            <div className={`${styles.bubble} ${isMine ? styles.mine : styles.theirs}`}>
                {message.imageUrl && (
                    <img
                        src={message.imageUrl}
                        alt="送信画像"
                        className={styles.messageImage}
                        onClick={() => setShowImageModal(true)}
                    />
                )}
                {message.content && <p className={styles.text}>{message.content}</p>}
                <span className={styles.timestamp}>
                    {new Date(message.timestamp).toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            </div>

            {showImageModal && (
                <div className={styles.imageModal} onClick={() => setShowImageModal(false)}>
                    <img src={message.imageUrl} alt="拡大画像" />
                </div>
            )}
        </>
    );
};
```

### MessageBubble.module.css の追加

```css
.messageImage {
  max-width: 300px;
  max-height: 300px;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  margin-bottom: var(--spacing-xs);
  display: block;
}

.messageImage:hover {
  opacity: 0.9;
}

.imageModal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
}

.imageModal img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}
```

## 5. 参考実装

- `specs/features/chat.md` - 画像送信仕様
- `frontend/src/shared/types/chat.ts` - Message型（imageUrl確認）

## 6. 技術的制約

- ❌ `any` 型禁止
- ❌ 外部画像アップロードライブラリ禁止
- ❌ localStorage使用禁止
- ✅ DataURL（Base64）で画像保持
- ✅ FileReader API使用

## 7. 完了報告

### タスクID: chat-image-upload

### 作成/編集ファイル:
- `ChatInput.tsx` - 画像選択・プレビュー機能
- `MessageBubble.tsx` - 画像表示・拡大モーダル
- 対応するCSSファイル

### 主要な変更点:
- 画像選択ボタン追加
- 送信前プレビュー機能
- 画像付きメッセージ送信
- 画像クリックで拡大表示

### 未解決の問題: なし
