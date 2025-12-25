// @see specs/features/archive.md
// ADR-005: Edge Function for dynamic badge checking
// Triggered by Database Webhook on diary_posts INSERT

import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseClient } from "../_shared/supabase.ts";

interface BadgeCondition {
    type: "total_posts" | "total_hours" | "streak_days" | "unique_subjects" | "total_messages";
    threshold: number;
}

interface BadgeDefinition {
    id: string;
    name: string;
    condition_logic: string;
}

// condition_logic parser: "total_posts:10" → { type: "total_posts", threshold: 10 }
function parseCondition(logic: string): BadgeCondition {
    const [type, value] = logic.split(":");
    return {
        type: type as BadgeCondition["type"],
        threshold: parseInt(value, 10),
    };
}

async function checkUserBadges(userId: string) {
    const supabase = createSupabaseClient();

    // Get all badge definitions
    const { data: badges, error: badgesError } = await supabase
        .from("badge_definitions")
        .select("id, name, condition_logic");

    if (badgesError) {
        throw new Error(`Failed to fetch badges: ${badgesError.message}`);
    }

    // Get user's already earned badges
    const { data: earnedBadges } = await supabase
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", userId);

    const earnedIds = new Set((earnedBadges || []).map((b) => b.badge_id));

    // Calculate user stats
    const { data: posts } = await supabase
        .from("diary_posts")
        .select("id, subject, duration_minutes, posted_date")
        .eq("user_id", userId);

    const { data: messages } = await supabase
        .from("messages")
        .select("id")
        .eq("sender_id", userId);

    const totalPosts = posts?.length || 0;
    const totalHours = Math.floor(
        (posts?.reduce((sum, p) => sum + (p.duration_minutes || 0), 0) || 0) / 60
    );
    const uniqueSubjects = new Set(posts?.map((p) => p.subject) || []).size;
    const totalMessages = messages?.length || 0;

    // Calculate streak (simple version: consecutive days from most recent)
    let streakDays = 0;
    if (posts && posts.length > 0) {
        const sortedDates = posts
            .map((p) => new Date(p.posted_date))
            .sort((a, b) => b.getTime() - a.getTime());

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let currentDate = sortedDates[0];
        currentDate.setHours(0, 0, 0, 0);

        // Check if most recent post is today or yesterday
        const daysDiff = Math.floor(
            (today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysDiff > 1) {
            streakDays = 0;
        } else {
            streakDays = 1;
            for (let i = 1; i < sortedDates.length; i++) {
                const prevDate = new Date(sortedDates[i - 1]);
                prevDate.setHours(0, 0, 0, 0);
                const currDate = new Date(sortedDates[i]);
                currDate.setHours(0, 0, 0, 0);

                const diff = Math.floor(
                    (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
                );

                if (diff === 1) {
                    streakDays++;
                } else {
                    break;
                }
            }
        }
    }

    const stats = {
        total_posts: totalPosts,
        total_hours: totalHours,
        streak_days: streakDays,
        unique_subjects: uniqueSubjects,
        total_messages: totalMessages,
    };

    // Check each badge condition
    const newBadges: string[] = [];

    for (const badge of badges as BadgeDefinition[]) {
        if (earnedIds.has(badge.id)) continue;

        const condition = parseCondition(badge.condition_logic);
        const currentValue = stats[condition.type];

        if (currentValue >= condition.threshold) {
            // Award the badge
            const { error: insertError } = await supabase
                .from("user_badges")
                .insert({
                    user_id: userId,
                    badge_id: badge.id,
                    earned_at: new Date().toISOString(),
                });

            if (!insertError) {
                newBadges.push(badge.name);
            }
        }
    }

    return { newBadges, stats };
}

Deno.serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { record } = await req.json();

        if (!record?.user_id) {
            return new Response(
                JSON.stringify({ error: "Missing user_id in record" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const result = await checkUserBadges(record.user_id);

        return new Response(
            JSON.stringify({
                success: true,
                userId: record.user_id,
                newBadges: result.newBadges,
                stats: result.stats,
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
