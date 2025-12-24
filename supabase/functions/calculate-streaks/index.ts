// @see specs/features/archive.md
// ADR-005: Edge Function for calculating user streaks
// Triggered by cron job daily at 00:00 UTC

import { createSupabaseClient } from "../_shared/supabase.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface UserStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
}

async function calculateStreaksForAllUsers(): Promise<UserStreak[]> {
  const supabase = createSupabaseClient();

  // Get all users who have posted
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "student");

  if (usersError) {
    throw new Error(`Failed to fetch users: ${usersError.message}`);
  }

  const results: UserStreak[] = [];

  for (const user of users || []) {
    const { data: posts } = await supabase
      .from("diary_posts")
      .select("posted_date")
      .eq("user_id", user.id)
      .order("posted_date", { ascending: false });

    if (!posts || posts.length === 0) {
      results.push({
        user_id: user.id,
        current_streak: 0,
        longest_streak: 0,
      });
      continue;
    }

    // Calculate current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedDates = posts.map((p) => {
      const date = new Date(p.posted_date);
      date.setHours(0, 0, 0, 0);
      return date;
    });

    // Remove duplicates (multiple posts on same day)
    const uniqueDates = Array.from(
      new Set(sortedDates.map((d) => d.getTime()))
    ).map((t) => new Date(t));
    uniqueDates.sort((a, b) => b.getTime() - a.getTime());

    // Check if most recent post is today or yesterday
    const daysSinceLastPost = Math.floor(
      (today.getTime() - uniqueDates[0].getTime()) / (1000 * 60 * 60 * 24)
    );

    let currentStreak = 0;
    if (daysSinceLastPost <= 1) {
      currentStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const diff = Math.floor(
          (uniqueDates[i - 1].getTime() - uniqueDates[i].getTime()) /
            (1000 * 60 * 60 * 24)
        );
        if (diff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const diff = Math.floor(
        (uniqueDates[i - 1].getTime() - uniqueDates[i].getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (diff === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    results.push({
      user_id: user.id,
      current_streak: currentStreak,
      longest_streak: longestStreak,
    });
  }

  return results;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify cron secret (security measure)
    const authHeader = req.headers.get("Authorization");
    const cronSecret = Deno.env.get("CRON_SECRET");
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = await calculateStreaksForAllUsers();

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        processedUsers: results.length,
        results: results,
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
