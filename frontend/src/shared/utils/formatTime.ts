// @see specs/features/diary.md
// 時間変換ユーティリティ

/** 分を h:mm 形式の文字列に変換 */
export const minutesToHM = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}:${String(m).padStart(2, '0')}`;
};

/** h:mm 形式の文字列を分に変換（無効な場合はnull） */
export const hmToMinutes = (hm: string): number | null => {
    const match = hm.match(/^(\d{1,3}):([0-5]\d)$/);
    if (!match) return null;
    const h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    return h * 60 + m;
};

/** 分を「XXX時間YY分」形式で表示 */
export const minutesToJapanese = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}分`;
    if (m === 0) return `${h}時間`;
    return `${h}時間${m}分`;
};
