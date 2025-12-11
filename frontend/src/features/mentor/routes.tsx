// Mentor feature routes
// @see specs/features/mentor.md

import type { RouteObject } from 'react-router-dom';
import MentorLayout from './components/layout/MentorLayout';
import DashboardPage from './pages/DashboardPage';
import StudentListPage from './pages/StudentListPage';
import StudentDetailPage from './pages/StudentDetailPage';
import NotificationManagePage from './pages/NotificationManagePage';
import NotificationListPage from './pages/NotificationListPage';
import SurveyCreatePage from './pages/SurveyCreatePage';
import ChatPage from './pages/ChatPage';

export const mentorRoutes: RouteObject[] = [
    {
        path: '/mentor',
        element: <MentorLayout />,
        children: [
            { path: 'dashboard', element: <DashboardPage /> },
            { path: 'students', element: <StudentListPage /> },
            { path: 'students/:id', element: <StudentDetailPage /> },
            { path: 'notifications', element: <NotificationListPage /> },
            { path: 'notifications/new', element: <NotificationManagePage /> },
            { path: 'notifications/:id/edit', element: <NotificationManagePage /> },
            { path: 'surveys/new', element: <SurveyCreatePage /> },
            { path: 'chat', element: <ChatPage /> },
        ],
    },
];

export default mentorRoutes;
