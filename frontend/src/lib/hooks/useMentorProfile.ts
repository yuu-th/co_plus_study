// @see specs/features/mentor.md
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";

interface MentorProfile {
  user_id: string;
  specialties: string[]; // JSONBから変換
  introduction: string | null;
  status: "active" | "inactive";
}

interface MentorProfileUpdateParams {
  specialties?: string[];
  introduction?: string;
  status?: "active" | "inactive";
}

/**
 * 現在のメンターのプロフィール情報を取得
 */
export function useMentorProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["mentorProfile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      const { data, error } = await supabase
        .from("mentor_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      // JSONBをstring[]に変換
      return {
        ...data,
        specialties: Array.isArray(data.specialties) ? data.specialties : [],
      } as MentorProfile;
    },
    enabled: !!userId,
  });
}

/**
 * メンタープロフィールを作成または更新
 */
export function useUpdateMentorProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: MentorProfileUpdateParams) => {
      const { data, error } = await supabase
        .from("mentor_profiles")
        .upsert({
          user_id: userId,
          ...params,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        specialties: Array.isArray(data.specialties) ? data.specialties : [],
      } as MentorProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorProfile", userId] });
    },
  });
}

/**
 * すべてのアクティブなメンターを取得
 */
export function useActiveMentors() {
  return useQuery({
    queryKey: ["mentors", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mentor_profiles")
        .select(
          `
          user_id,
          specialties,
          introduction,
          status,
          profiles!inner (
            display_name,
            avatar_url
          )
        `
        )
        .eq("status", "active");

      if (error) throw error;

      return data.map((mentor: any) => ({
        user_id: mentor.user_id,
        specialties: Array.isArray(mentor.specialties) ? mentor.specialties : [],
        introduction: mentor.introduction,
        status: mentor.status,
        display_name: mentor.profiles.display_name,
        avatar_url: mentor.profiles.avatar_url,
      }));
    },
  });
}
