// Database types for Supabase
// @see ADR-005: バックエンド連携アーキテクチャ
// Auto-generated types should eventually replace this file using:
// npx supabase gen types typescript --project-id <project-id> > src/lib/database.types.ts

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

// Enum types matching database
export type UserRole = 'student' | 'mentor' | 'admin';
export type SubjectType = '国語' | '数学' | '理科' | '社会' | '英語' | 'その他';
export type ReactionEmoji = '👍' | '❤️' | '🎉' | '👏' | '🔥';
export type MessageType = 'text' | 'image';
export type BadgeRank = 'platinum' | 'gold' | 'silver' | 'bronze';
export type SurveyStatus = 'draft' | 'scheduled' | 'active' | 'closed';
export type NotificationCategory = 'info' | 'event' | 'important';
export type NotificationPriority = 'low' | 'normal' | 'high';
export type MentorStatus = 'active' | 'inactive';

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    role: UserRole;
                    display_name: string;
                    name_kana: string | null;
                    avatar_url: string | null;
                    grade: string | null;
                    gender: 'male' | 'female' | null;
                    last_seen_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    role?: UserRole;
                    display_name: string;
                    name_kana?: string | null;
                    avatar_url?: string | null;
                    grade?: string | null;
                    gender?: 'male' | 'female' | null;
                    last_seen_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    role?: UserRole;
                    display_name?: string;
                    name_kana?: string | null;
                    avatar_url?: string | null;
                    grade?: string | null;
                    gender?: 'male' | 'female' | null;
                    last_seen_at?: string | null;
                    updated_at?: string;
                };
            };
            mentor_profiles: {
                Row: {
                    user_id: string;
                    specialties: Json;
                    introduction: string | null;
                    status: MentorStatus;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    user_id: string;
                    specialties?: Json;
                    introduction?: string | null;
                    status?: MentorStatus;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    specialties?: Json;
                    introduction?: string | null;
                    status?: MentorStatus;
                    updated_at?: string;
                };
            };
            diary_posts: {
                Row: {
                    id: string;
                    user_id: string;
                    subject: SubjectType;
                    duration_minutes: number;
                    content: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    subject: SubjectType;
                    duration_minutes: number;
                    content: string;
                    created_at?: string;
                };
                Update: {
                    subject?: SubjectType;
                    duration_minutes?: number;
                    content?: string;
                };
            };
            diary_reactions: {
                Row: {
                    id: string;
                    post_id: string;
                    user_id: string;
                    reaction_type: ReactionEmoji;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    post_id: string;
                    user_id: string;
                    reaction_type: ReactionEmoji;
                    created_at?: string;
                };
                Update: {
                    reaction_type?: ReactionEmoji;
                };
            };
            chat_rooms: {
                Row: {
                    id: string;
                    student_id: string;
                    mentor_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    student_id: string;
                    mentor_id: string;
                    created_at?: string;
                };
                Update: {
                    mentor_id?: string;
                };
            };
            messages: {
                Row: {
                    id: string;
                    room_id: string;
                    sender_id: string;
                    message_type: MessageType;
                    content: string | null;
                    image_url: string | null;
                    is_read: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    room_id: string;
                    sender_id: string;
                    message_type?: MessageType;
                    content?: string | null;
                    image_url?: string | null;
                    is_read?: boolean;
                    created_at?: string;
                };
                Update: {
                    content?: string | null;
                    is_read?: boolean;
                };
            };
            message_reactions: {
                Row: {
                    id: string;
                    message_id: string;
                    user_id: string;
                    emoji: ReactionEmoji;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    message_id: string;
                    user_id: string;
                    emoji: ReactionEmoji;
                    created_at?: string;
                };
                Update: {
                    emoji?: ReactionEmoji;
                };
            };
            badge_definitions: {
                Row: {
                    id: string;
                    name: string;
                    description: string;
                    condition_description: string;
                    rank: BadgeRank;
                    category: string;
                    condition_logic: string;
                    icon_url: string | null;
                    sort_order: number;
                };
                Insert: {
                    id: string;
                    name: string;
                    description: string;
                    condition_description: string;
                    rank: BadgeRank;
                    category: string;
                    condition_logic: string;
                    icon_url?: string | null;
                    sort_order?: number;
                };
                Update: {
                    name?: string;
                    description?: string;
                    condition_description?: string;
                    rank?: BadgeRank;
                    category?: string;
                    condition_logic?: string;
                    icon_url?: string | null;
                    sort_order?: number;
                };
            };
            user_badges: {
                Row: {
                    id: string;
                    user_id: string;
                    badge_id: string;
                    earned_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    badge_id: string;
                    earned_at?: string;
                };
                Update: never;
            };
            surveys: {
                Row: {
                    id: string;
                    title: string;
                    description: string | null;
                    questions: Json;
                    release_date: string | null;
                    due_date: string | null;
                    status: SurveyStatus;
                    created_by: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description?: string | null;
                    questions: Json;
                    release_date?: string | null;
                    due_date?: string | null;
                    status?: SurveyStatus;
                    created_by: string;
                    created_at?: string;
                };
                Update: {
                    title?: string;
                    description?: string | null;
                    questions?: Json;
                    release_date?: string | null;
                    due_date?: string | null;
                    status?: SurveyStatus;
                };
            };
            survey_responses: {
                Row: {
                    id: string;
                    survey_id: string;
                    user_id: string;
                    answers: Json;
                    submitted_at: string;
                };
                Insert: {
                    id?: string;
                    survey_id: string;
                    user_id: string;
                    answers: Json;
                    submitted_at?: string;
                };
                Update: {
                    answers?: Json;
                };
            };
            notifications: {
                Row: {
                    id: string;
                    category: NotificationCategory;
                    title: string;
                    content: string;
                    priority: NotificationPriority;
                    icon_url: string | null;
                    created_by: string | null;
                    expires_at: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    category: NotificationCategory;
                    title: string;
                    content: string;
                    priority?: NotificationPriority;
                    icon_url?: string | null;
                    created_by?: string | null;
                    expires_at?: string | null;
                    created_at?: string;
                };
                Update: {
                    category?: NotificationCategory;
                    title?: string;
                    content?: string;
                    priority?: NotificationPriority;
                    icon_url?: string | null;
                    expires_at?: string | null;
                };
            };
            user_notifications: {
                Row: {
                    id: string;
                    notification_id: string;
                    user_id: string;
                    is_read: boolean;
                    read_at: string | null;
                };
                Insert: {
                    id?: string;
                    notification_id: string;
                    user_id: string;
                    is_read?: boolean;
                    read_at?: string | null;
                };
                Update: {
                    is_read?: boolean;
                    read_at?: string | null;
                };
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: {
            user_role: UserRole;
            subject_type: SubjectType;
            reaction_emoji: ReactionEmoji;
            message_type: MessageType;
            badge_rank: BadgeRank;
            survey_status: SurveyStatus;
            notification_category: NotificationCategory;
            notification_priority: NotificationPriority;
            mentor_status: MentorStatus;
        };
    };
}

// Helper types for easier access
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertDTO<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateDTO<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Table row types
export type Profile = Tables<'profiles'>;
export type MentorProfile = Tables<'mentor_profiles'>;
export type DiaryPost = Tables<'diary_posts'>;
export type DiaryReaction = Tables<'diary_reactions'>;
export type ChatRoom = Tables<'chat_rooms'>;
export type Message = Tables<'messages'>;
export type MessageReaction = Tables<'message_reactions'>;
export type BadgeDefinition = Tables<'badge_definitions'>;
export type UserBadge = Tables<'user_badges'>;
export type Survey = Tables<'surveys'>;
export type SurveyResponse = Tables<'survey_responses'>;
export type Notification = Tables<'notifications'>;
export type UserNotification = Tables<'user_notifications'>;
