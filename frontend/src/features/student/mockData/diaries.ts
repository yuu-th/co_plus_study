// 学習日報モック (SNS風)
// @see specs/features/diary.md

import type { DiaryPost, ReactionType, Subject } from '@/shared/types';

const subjects: Subject[] = ['国語', '数学', '理科', '社会', '英語', 'その他'];
const reactionTypes: ReactionType[] = ['👍', '❤️', '🎉', '👏', '🔥'];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const baseUser = { userId: '1', userName: '田中太郎' };

// 過去7日分の投稿を生成
export const mockDiaryPosts: DiaryPost[] = (() => {
    const posts: DiaryPost[] = [];
    const now = new Date();
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const day = new Date(now);
        day.setDate(now.getDate() - dayOffset);
        const count = rand(1, 3);
        for (let i = 0; i < count; i++) {
            const ts = new Date(day);
            ts.setHours(rand(7, 21), rand(0, 59), 0, 0);
            const reactions = reactionTypes
                .filter(() => Math.random() < 0.35)
                .map(type => ({
                    type,
                    userIds: ['mentor1', 'mentor2'].filter(() => Math.random() < 0.6),
                    count: 0,
                }));
            reactions.forEach(r => { r.count = r.userIds.length; });
            posts.push({
                id: `post-${dayOffset}-${i}`,
                ...baseUser,
                subject: pick(subjects),
                duration: rand(20, 90),
                content: `${pick(['復習', '練習', '読解', '問題演習', '単語暗記'])}を行いました。${pick(['理解が深まりました', '少し難しかったです', '次は応用問題に挑戦したいです', 'メンターに質問しました'])}。`,
                timestamp: ts.toISOString(),
                reactions,
            });
        }
    }
    return posts.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
})();

// 教科リスト
export const mockSubjects = subjects;
