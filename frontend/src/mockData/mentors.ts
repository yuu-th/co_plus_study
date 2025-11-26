// @see specs/features/mentor.md

import type { StudentSummary, StudentDetail } from '../types';
import { mockDiaryPosts } from './diaries';

export const mockStudents: StudentSummary[] = [
  {
    id: 'student-1',
    name: '鈴木 一郎',
    avatarUrl: 'https://placehold.jp/150x150.png?text=S.I',
    totalPosts: 12,
    totalHours: 25.5,
    lastActivity: '2025-11-25T10:00:00Z',
  },
  {
    id: 'student-2',
    name: '佐藤 花子',
    totalPosts: 5,
    totalHours: 8,
    lastActivity: '2025-11-24T18:30:00Z',
  },
  {
    id: 'student-3',
    name: '高橋 健太',
    avatarUrl: 'https://placehold.jp/150x150.png?text=K.T',
    totalPosts: 28,
    totalHours: 42.0,
    lastActivity: '2025-11-25T12:15:00Z',
  },
  {
    id: 'student-4',
    name: '田中 美咲',
    totalPosts: 0,
    totalHours: 0,
    lastActivity: '2025-10-01T09:00:00Z',
  },
];

export const mockStudentDetails: StudentDetail[] = [
  {
    ...mockStudents[0],
    posts: mockDiaryPosts.filter((_, i) => i % 2 === 0), // 偶数番目の投稿
    stats: {
      continuousDays: 14,
      totalHours: 25.5,
      subjectBreakdown: [
        { subject: '数学', hours: 10 },
        { subject: '物理', hours: 8.5 },
        { subject: '英語', hours: 7 },
      ],
    },
  },
  {
    ...mockStudents[2],
    posts: mockDiaryPosts.filter((_, i) => i % 2 !== 0), // 奇数番目の投稿
    stats: {
      continuousDays: 5,
      totalHours: 42.0,
      subjectBreakdown: [
        { subject: '国語', hours: 15 },
        { subject: '社会', hours: 12 },
        { subject: '英語', hours: 15 },
      ],
    },
  },
];
