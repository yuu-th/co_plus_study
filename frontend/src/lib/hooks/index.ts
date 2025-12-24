// Hooks exports
// @see ADR-005: バックエンド連携アーキテクチャ

// User
export { useCurrentUser, CURRENT_USER_QUERY_KEY } from './useCurrentUser';

// Diary
export {
    useDiaryPosts,
    useDiaryPost,
    useCreateDiaryPost,
    useUpdateDiaryPost,
    useDeleteDiaryPost,
    useAddDiaryReaction,
    useRemoveDiaryReaction,
    DIARY_QUERY_KEYS,
} from './useDiary';

// Chat
export {
    useChatRooms,
    useChatRoom,
    useMessages,
    useRealtimeMessages,
    useSendMessage,
    useMarkMessagesAsRead,
    useAddMessageReaction,
    useRemoveMessageReaction,
    uploadChatImage,
    CHAT_QUERY_KEYS,
} from './useChat';

// Notifications
export {
    useNotifications,
    useUnreadNotificationCount,
    useRealtimeNotifications,
    useMarkNotificationAsRead,
    useMarkAllNotificationsAsRead,
    useCreateNotification,
    useUpdateNotification,
    useDeleteNotification,
    NOTIFICATION_QUERY_KEYS,
} from './useNotifications';

// Surveys
export {
    useActiveSurveys,
    useAllSurveys,
    useSurvey,
    useSurveyResponses,
    useUserSurveyResponse,
    useCreateSurvey,
    useUpdateSurvey,
    useDeleteSurvey,
    useSubmitSurveyResponse,
    SURVEY_QUERY_KEYS,
} from './useSurveys';

// Badges
export {
    useBadgeDefinitions,
    useUserBadges,
    useBadgesWithProgress,
    useStreak,
    BADGE_QUERY_KEYS,
} from './useBadges';

// Calendar
export {
    useCalendarData,
    CALENDAR_QUERY_KEYS,
    type CalendarDay,
    type CalendarData,
} from './useCalendar';

// Mentor-specific
export {
    useMentorStudents,
    useStudentDetail,
    MENTOR_QUERY_KEYS,
} from './useMentorData';

// Mentor Profile
export {
    useMentorProfile,
    useUpdateMentorProfile,
    useActiveMentors,
} from './useMentorProfile';

// Activity
export {
    useRecentActivities,
    ACTIVITY_QUERY_KEY,
    type Activity,
} from './useActivity';

