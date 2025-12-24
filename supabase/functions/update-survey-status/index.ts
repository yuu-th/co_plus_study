// @see specs/features/survey.md
// ADR-005: Edge Function for updating survey status
// Triggered by cron job daily at 00:00 UTC

import { createSupabaseClient } from "../_shared/supabase.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface SurveyUpdate {
  id: string;
  previous_status: string;
  new_status: string;
}

async function updateSurveyStatuses(): Promise<SurveyUpdate[]> {
  const supabase = createSupabaseClient();
  const now = new Date();
  const updates: SurveyUpdate[] = [];

  // Get all surveys that need status updates
  const { data: surveys, error: surveysError } = await supabase
    .from("surveys")
    .select("id, status, start_date, end_date")
    .in("status", ["scheduled", "active"]);

  if (surveysError) {
    throw new Error(`Failed to fetch surveys: ${surveysError.message}`);
  }

  for (const survey of surveys || []) {
    const startDate = new Date(survey.start_date);
    const endDate = new Date(survey.end_date);
    let newStatus = survey.status;

    // Check if scheduled survey should become active
    if (survey.status === "scheduled" && now >= startDate) {
      newStatus = "active";
    }

    // Check if active survey should be closed
    if (survey.status === "active" && now > endDate) {
      newStatus = "closed";
    }

    // Update if status changed
    if (newStatus !== survey.status) {
      const { error: updateError } = await supabase
        .from("surveys")
        .update({ status: newStatus })
        .eq("id", survey.id);

      if (!updateError) {
        updates.push({
          id: survey.id,
          previous_status: survey.status,
          new_status: newStatus,
        });
      }
    }
  }

  return updates;
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

    const updates = await updateSurveyStatuses();

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        updatedSurveys: updates.length,
        updates: updates,
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
