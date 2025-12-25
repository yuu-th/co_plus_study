// Student feature routes
// @see specs/features/*.md

import ProtectedRoute from '@/shared/components/ProtectedRoute';
import type { RouteObject } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ArchivePage from './pages/ArchivePage';
import ChatPage from './pages/ChatPage';
import DiaryPage from './pages/DiaryPage';
import HomePage from './pages/HomePage';
import NotificationPage from './pages/NotificationPage';
import ProfileEditPage from './pages/ProfileEditPage';
import ProfilePage from './pages/ProfilePage';
import SurveyPage from './pages/SurveyPage';
import TutorialPage from './pages/TutorialPage';

export const studentRoutes: RouteObject[] = [
    {
        element: (
            <ProtectedRoute requireRole="student">
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            { path: '/', element: <HomePage /> },
            { path: '/profile', element: <ProfilePage /> },
            { path: '/profile/edit', element: <ProfileEditPage /> },
            { path: '/archive', element: <ArchivePage /> },
            { path: '/diary', element: <DiaryPage /> },
            { path: '/chat', element: <ChatPage /> },
            { path: '/survey', element: <SurveyPage /> },
            { path: '/notifications', element: <NotificationPage /> },
            { path: '/tutorial', element: <TutorialPage /> },
        ],
    },
];

export default studentRoutes;
