// Student feature routes
// @see specs/features/*.md

import type { RouteObject } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import ArchivePage from './pages/ArchivePage';
import DiaryPage from './pages/DiaryPage';
import ChatPage from './pages/ChatPage';
import SurveyPage from './pages/SurveyPage';
import NotificationPage from './pages/NotificationPage';
import TutorialPage from './pages/TutorialPage';

export const studentRoutes: RouteObject[] = [
    {
        element: (
            <ProtectedRoute>
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
