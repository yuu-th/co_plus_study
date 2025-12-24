// @see specs/features/home.md
// ADR-005: Activity Timeline - Union Query from diary_posts, user_badges, messages
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";

export interface Activity {
  id: string;
  type: "diary" | "badge" | "chat";
  timestamp: string;
  title: string;
  description: string;
  badge?: {
    name: string;
    rank: "platinum" | "gold" | "silver" | "bronze";
  };
}

export const ACTIVITY_QUERY_KEY = "activities";

/**
 * ユーザーの最近のアクティビティを取得
 * 日報投稿、バッジ獲得、チャットメッセージを統合
 */
export function useRecentActivities(userId: string | undefined, limit = 10) {
  return useQuery({
    queryKey: [ACTIVITY_QUERY_KEY, userId, limit],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      const activities: Activity[] = [];

      // 1. 日報投稿を取得
      const { data: diaryPosts } = await supabase
        .from("diary_posts")
        .select("id, subject, content, posted_date")
        .eq("user_id", userId)
        .order("posted_date", { ascending: false })
        .limit(limit);

      if (diaryPosts) {
        activities.push(
          ...diaryPosts.map((post) => ({
            id: `diary-${post.id}`,
            type: "diary" as const,
            timestamp: post.posted_date,
            title: `${post.subject}を学習`,
            description: post.content.slice(0, 50) + (post.content.length > 50 ? "..." : ""),
          }))
        );
      }

      // 2. バッジ獲得を取得
      const { data: badges } = await supabase
        .from("user_badges")
        .select(
          `
          id,
          earned_at,
          badge_definitions!inner (
            name,
            description,
            rank
          )
        `
        )
        .eq("user_id", userId)
        .order("earned_at", { ascending: false })
        .limit(limit);

      if (badges) {
        activities.push(
          ...badges.map((badge: any) => ({
            id: `badge-${badge.id}`,
            type: "badge" as const,
            timestamp: badge.earned_at,
            title: "バッジ獲得",
            description: badge.badge_definitions.name,
            badge: {
              name: badge.badge_definitions.name,
              rank: badge.badge_definitions.rank as "platinum" | "gold" | "silver" | "bronze",
            },
          }))
        );
      }

      // 3. チャットメッセージを取得（自分が送信したもの）
      const { data: messages } = await supabase
        .from("messages")
        .select(
          `
          id,
          content,
          created_at,
          chat_rooms!inner (
            id
          )
        `
        )
        .eq("sender_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (messages) {
        activities.push(
          ...messages.map((msg) => ({
            id: `chat-${msg.id}`,
            type: "chat" as const,
            timestamp: msg.created_at,
            title: "メンターに相談",
            description: msg.content.slice(0, 50) + (msg.content.length > 50 ? "..." : ""),
          }))
        );
      }

      // タイムスタンプでソートして制限
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    },
    enabled: !!userId,
  });
}
