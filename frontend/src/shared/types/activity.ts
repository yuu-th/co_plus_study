// @see ADR-005: Activity はDBに保存しない。diary_posts, user_badges, messages から動的にUnion Queryで取得

/**
 * 活動タイプ
 */
export type ActivityType = 'diary' | 'badge' | 'chat' | 'survey';

/**
 * 活動履歴（ホーム画面タイムライン用）
 * 
 * これはDBテーブルではなく、以下のテーブルから動的に合成される:
 * - diary_posts: 日報投稿
 * - user_badges: バッジ獲得
 * - messages: チャットメッセージ
 * - survey_responses: アンケート回答
 */
export interface Activity {
    /** 活動ID（元テーブルのIDにプレフィックス付与: diary-xxx, badge-xxx など） */
    id: string;
    /** 活動タイプ */
    type: ActivityType;
    /** タイトル */
    title: string;
    /** 説明文 */
    description: string;
    /** 発生日時（ISO8601） */
    timestamp: string;
    /** リンク先パス */
    link?: string;
}
