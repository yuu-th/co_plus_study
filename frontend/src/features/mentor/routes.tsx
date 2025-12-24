// Mentor feature routes
// @see specs/features/mentor.md

import type { RouteObject } from 'react-router-dom';
import MentorLayout from './components/layout/MentorLayout';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import StudentListPage from './pages/StudentListPage';
import StudentDetailPage from './pages/StudentDetailPage';
import NotificationManagePage from './pages/NotificationManagePage';
import NotificationListPage from './pages/NotificationListPage';
import SurveyCreatePage from './pages/SurveyCreatePage';
import SurveyListPage from './pages/SurveyListPage';
import SurveyResultsPage from './pages/SurveyResultsPage';
import ChatPage from './pages/ChatPage';
import MentorProfileEditPage from './pages/MentorProfileEditPage';

export const mentorRoutes: RouteObject[] = [
    {
        path: '/mentor',
        element: (
            <ProtectedRoute>
                <MentorLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: 'dashboard', element: <DashboardPage /> },
            { path: 'students', element: <StudentListPage /> },
            { path: 'students/:id', element: <StudentDetailPage /> },
            { path: 'notifications', element: <NotificationListPage /> },
            { path: 'notifications/new', element: <NotificationManagePage /> },
            { path: 'notifications/:id/edit', element: <NotificationManagePage /> },
            { path: 'surveys', element: <SurveyListPage /> },
            { path: 'surveys/new', element: <SurveyCreatePage /> },
            { path: 'surveys/:id/edit', element: <SurveyCreatePage /> },
            { path: 'surveys/:id/results', element: <SurveyResultsPage /> },
            { path: 'chat', element: <ChatPage /> },
            { path: 'profile/edit', element: <MentorProfileEditPage /> },
        ],
    },
];

export default mentorRoutes;
