// Library exports
// @see ADR-005: バックエンド連携アーキテクチャ

export { AuthProvider, useAuth } from './auth';
export { queryClient } from './queryClient';
export { supabase } from './supabase';

// Re-export all hooks
export * from './hooks';

// Re-export converters
export * from './converters';

// Re-export database types for convenience
export type {
    BadgeDefinition, BadgeRank, ChatRoom, Database, DiaryPost,
    DiaryReaction, InsertDTO, MentorProfile, MentorStatus, Message,
    MessageReaction, MessageType, Notification, NotificationCategory,
    NotificationPriority, Profile, ReactionEmoji, SubjectType, Survey,
    SurveyResponse, SurveyStatus, Tables, UpdateDTO, UserBadge, UserNotification,
    UserRole
} from './database.types';

