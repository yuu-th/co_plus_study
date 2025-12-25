// Hooks exports
// @see ADR-005: バックエンド連携アーキテクチャ

// User
export { CURRENT_USER_QUERY_KEY, useCurrentUser } from './useCurrentUser';

// Diary
export {
    DIARY_QUERY_KEYS, useAddDiaryReaction, useCreateDiaryPost, useDeleteDiaryPost, useDiaryPost, useDiaryPosts, useRemoveDiaryReaction, useUpdateDiaryPost
} from './useDiary';

// Chat
export {
    CHAT_QUERY_KEYS, uploadChatImage, useAddMessageReaction, useChatRoom, useChatRooms,
    useCreateChatRoom, useGetOrCreateChatRoom, useMarkMessagesAsRead, useMessages,
    useRealtimeMessages, useRemoveMessageReaction, useSendMessage
} from './useChat';

// Notifications
export {
    NOTIFICATION_QUERY_KEYS, useCreateNotification, useDeleteNotification, useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useNotifications, useRealtimeNotifications, useUnreadNotificationCount, useUpdateNotification
} from './useNotifications';

// Surveys
export {
    SURVEY_QUERY_KEYS, useActiveSurveys,
    useAllSurveys, useCreateSurvey, useDeleteSurvey,
    useSubmitSurveyResponse, useSurvey,
    useSurveyResponses, useUpdateSurvey, useUserSurveyResponse
} from './useSurveys';

// Badges
export {
    BADGE_QUERY_KEYS, useBadgeDefinitions, useBadgesWithProgress,
    useStreak, useUserBadges
} from './useBadges';

// Calendar
export {
    CALENDAR_QUERY_KEYS, useCalendarData, type CalendarData, type CalendarDay
} from './useCalendar';

// Mentor-specific
export {
    MENTOR_QUERY_KEYS, useMentorStudents,
    useStudentDetail
} from './useMentorData';

// Mentor Profile
export {
    useActiveMentors, useMentorProfile,
    useUpdateMentorProfile
} from './useMentorProfile';

// Activity
export {
    ACTIVITY_QUERY_KEY, useRecentActivities, type Activity
} from './useActivity';

