import { describe, it, expect, vi } from 'vitest';
import { groupByDate } from './groupByDate';
import type { DiaryPost } from '@/shared/types';

// 現在時刻を固定するための設定
const TODAY = new Date('2025-11-25T10:00:00Z');
vi.setSystemTime(TODAY);

// テストデータ
const mockPost = (id: number, date: string): DiaryPost => ({
    id: `post${id}`,
    userId: `user${id}`,
    userName: 'Test User',
    timestamp: date,
    subject: '国語',
    duration: 60,
    content: `投稿${id}です`,
    reactions: [],
});

describe('groupByDate', () => {
    it('空の配列を渡すと空の配列を返す', () => {
        expect(groupByDate([])).toEqual([]);
    });

    it('同じ日付の投稿が同じグループになる', () => {
        const posts: DiaryPost[] = [
            mockPost(1, '2025-11-25T09:00:00Z'), // 今日
            mockPost(2, '2025-11-25T08:00:00Z'), // 今日
        ];
        const result = groupByDate(posts);
        expect(result.length).toBe(1);
        expect(result[0].dateLabel).toBe('今日');
        expect(result[0].posts.length).toBe(2);
        // タイムスタンプの降順でソートされていることを確認
        expect(result[0].posts[0].id).toBe('post1');
        expect(result[0].posts[1].id).toBe('post2');
    });

    it('異なる日付の投稿が別々のグループになる', () => {
        const posts: DiaryPost[] = [
            mockPost(1, '2025-11-25T09:00:00Z'), // 今日
            mockPost(2, '2025-11-24T18:00:00Z'), // 昨日
            mockPost(3, '2025-11-22T12:00:00Z'), // 11月22日
        ];
        const result = groupByDate(posts);
        expect(result.length).toBe(3);
        expect(result[0].dateLabel).toBe('今日');
        expect(result[1].dateLabel).toBe('昨日');
        expect(result[2].dateLabel).toBe('11月22日');
    });

    it('今日・昨日のラベルが正しく表示される', () => {
        const posts: DiaryPost[] = [
            mockPost(1, '2025-11-25T09:00:00Z'), // 今日
            mockPost(2, '2025-11-24T18:00:00Z'), // 昨日
        ];
        const result = groupByDate(posts);
        expect(result.length).toBe(2);
        expect(result[0].dateLabel).toBe('今日');
        expect(result[1].dateLabel).toBe('昨日');
    });

    it('日付をまたいだ投稿が正しくグループ化される', () => {
        const posts: DiaryPost[] = [
            mockPost(1, '2025-11-25T01:00:00Z'), // 今日
            mockPost(2, '2025-11-24T23:00:00Z'), // 昨日
        ];
        const result = groupByDate(posts);
        expect(result.length).toBe(2);
        expect(result[0].dateLabel).toBe('今日');
        expect(result[1].dateLabel).toBe('昨日');
    });

    it('投稿が日付の降順、かつ同じ日の中では時間の降順でソートされる', () => {
        const posts: DiaryPost[] = [
            mockPost(1, '2025-11-23T10:00:00Z'),
            mockPost(2, '2025-11-25T10:00:00Z'),
            mockPost(3, '2025-11-23T12:00:00Z'),
            mockPost(4, '2025-11-24T10:00:00Z'),
            mockPost(5, '2025-11-25T09:00:00Z'),
        ];
        const result = groupByDate(posts);

        expect(result.length).toBe(3);
        // 1番目のグループ（今日）
        expect(result[0].dateLabel).toBe('今日');
        expect(result[0].posts.map(p => p.id)).toEqual(['post2', 'post5']);
        // 2番目のグループ（昨日）
        expect(result[1].dateLabel).toBe('昨日');
        expect(result[1].posts.map(p => p.id)).toEqual(['post4']);
        // 3番目のグループ（11月23日）
        expect(result[2].dateLabel).toBe('11月23日');
        expect(result[2].posts.map(p => p.id)).toEqual(['post3', 'post1']);
    });
});
