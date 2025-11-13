// 学習日報のモックデータ

import type { DiaryEntryWithFeedback, Feedback } from '../types';

const mockFeedbacks: Feedback[] = [
  {
    id: 'feedback-1',
    diaryId: 'diary-1',
    mentorId: 'mentor-1',
    mentorName: '高専 花子',
    message: '素晴らしい進捗ですね！この調子で頑張ってください。',
    timestamp: '2025-09-29T15:30:00Z',
  },
  {
    id: 'feedback-2',
    diaryId: 'diary-2',
    mentorId: 'mentor-1',
    mentorName: '高専 花子',
    message: '分からないところがあれば、いつでも相談してくださいね。',
    timestamp: '2025-09-28T14:20:00Z',
  },
];

export const mockDiaryEntries: DiaryEntryWithFeedback[] = [
  {
    id: 'diary-1',
    userId: '1',
    date: '2025-09-29',
    subject: '算数',
    duration: 60,
    content: '分数の掛け算と割り算を学習しました。最初は難しかったけど、練習問題を解いていくうちに理解できました。',
    comment: '明日は文章題に挑戦したいです。',
    createdAt: '2025-09-29T20:00:00Z',
    feedback: [mockFeedbacks[0]],
  },
  {
    id: 'diary-2',
    userId: '1',
    date: '2025-09-28',
    subject: '国語',
    duration: 45,
    content: '漢字の書き取りと、物語文の読解をしました。',
    createdAt: '2025-09-28T19:30:00Z',
    feedback: [mockFeedbacks[1]],
  },
  {
    id: 'diary-3',
    userId: '1',
    date: '2025-09-27',
    subject: '理科',
    duration: 90,
    content: '植物の光合成について学びました。実験動画を見て、とても面白かったです。',
    comment: '次は動物の呼吸について調べてみたいです。',
    createdAt: '2025-09-27T21:00:00Z',
  },
  {
    id: 'diary-4',
    userId: '1',
    date: '2025-09-26',
    subject: '社会',
    duration: 50,
    content: '日本の地理について勉強しました。都道府県の位置を覚えるのが大変でした。',
    createdAt: '2025-09-26T18:45:00Z',
  },
  {
    id: 'diary-5',
    userId: '1',
    date: '2025-09-25',
    subject: '英語',
    duration: 40,
    content: '英単語の暗記と、簡単な会話文の練習をしました。',
    createdAt: '2025-09-25T19:15:00Z',
  },
];

// 教科リスト
export const mockSubjects = [
  '国語',
  '算数',
  '理科',
  '社会',
  '英語',
  'その他',
];
