// 日報投稿配列を表示用グループ (今日/昨日/MM月DD日) に変換するユーティリティ
// Phase 2 DiaryTimeline で利用

import type { DiaryPost, GroupedDiaryPost } from '../types';

const formatDateLabel = (date: Date, today: Date): string => {
  const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return '今日';
  if (diffDays === 1) return '昨日';
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

/** DiaryPost[] を GroupedDiaryPost[] に変換 */
export const groupByDate = (posts: DiaryPost[]): GroupedDiaryPost[] => {
  if (posts.length === 0) return [];
  const today = new Date();
  // 日付 (YYYY-MM-DD) 単位でマップ
  const map = new Map<string, DiaryPost[]>();
  posts.forEach(p => {
    const d = new Date(p.timestamp);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    const arr = map.get(key) ?? [];
    arr.push(p);
    map.set(key, arr);
  });
  // 最新日付が先になるようにソート
  const sortedKeys = Array.from(map.keys()).sort((a, b) => (a < b ? 1 : -1));
  return sortedKeys.map(key => {
    const dateObj = new Date(key + 'T00:00:00Z');
    return {
      dateLabel: formatDateLabel(dateObj, today),
      posts: map.get(key)!.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)),
    };
  });
};

/** 週次集計計算 (週開始=月曜) */
export const computeWeeklyStats = (posts: DiaryPost[]) => {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diffToMonday = (day + 6) % 7; // 月曜までの差
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - diffToMonday);

  const end = new Date(monday);
  end.setDate(monday.getDate() + 7);

  const weekPosts = posts.filter(p => {
    const t = new Date(p.timestamp);
    return t >= monday && t < end;
  });

  let totalMinutes = 0;
  const subjectMap = new Map<string, number>();
  weekPosts.forEach(p => {
    totalMinutes += p.duration;
    subjectMap.set(p.subject, (subjectMap.get(p.subject) ?? 0) + p.duration);
  });

  return {
    weekStartISO: monday.toISOString(),
    totalPosts: weekPosts.length,
    totalMinutes,
    subjectBreakdown: Array.from(subjectMap.entries()).map(([subject, totalMinutes]) => ({ subject, totalMinutes })),
  };
};
