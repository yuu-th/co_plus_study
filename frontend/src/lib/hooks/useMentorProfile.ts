// @see specs/features/mentor.md
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
                .maybeSingle(); // レコードがなくてもエラーにならない

            if (error) throw error;

            // レコードがない場合はnullを返す
            if (!data) return null;

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
            avatar_url,
            gender
          )
        `
                )
                .eq("status", "active");

            if (error) throw error;

            interface ProfileData {
                display_name: string;
                avatar_url: string | null;
                gender: string | null;
            }

            return data.map((mentor) => {
                // profiles は inner join なので単一オブジェクト
                const profile = mentor.profiles as unknown as ProfileData;
                return {
                    id: mentor.user_id,
                    user_id: mentor.user_id,
                    specialties: Array.isArray(mentor.specialties) ? mentor.specialties as string[] : [],
                    introduction: mentor.introduction,
                    status: mentor.status,
                    display_name: profile.display_name,
                    avatar_url: profile.avatar_url,
                    gender: profile.gender,
                };
            });
        },
    });
}
