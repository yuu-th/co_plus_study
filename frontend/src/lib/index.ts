// Library exports
// @see ADR-005: バックエンド連携アーキテクチャ

export { supabase } from './supabase';
export { queryClient } from './queryClient';
export { AuthProvider, useAuth } from './auth';

// Re-export all hooks
export * from './hooks';

// Re-export converters
export * from './converters';

// Re-export database types for convenience
export type {
    Database,
    Tables,
    InsertDTO,
    UpdateDTO,
    Profile,
    MentorProfile,
    DiaryPost,
    DiaryReaction,
    ChatRoom,
    Message,
    MessageReaction,
    BadgeDefinition,
    UserBadge,
    Survey,
    SurveyResponse,
    Notification,
    UserNotification,
    UserRole,
    SubjectType,
    ReactionEmoji,
    MessageType,
    BadgeRank,
    SurveyStatus,
    NotificationCategory,
    NotificationPriority,
    MentorStatus,
} from './database.types';
