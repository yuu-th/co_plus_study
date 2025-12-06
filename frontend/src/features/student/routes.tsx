// Student feature routes
// @see specs/features/*.md

import type { RouteObject } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ArchivePage from './pages/ArchivePage';
import DiaryPage from './pages/DiaryPage';
import ChatPage from './pages/ChatPage';
import SurveyPage from './pages/SurveyPage';
import TutorialPage from './pages/TutorialPage';

export const studentRoutes: RouteObject[] = [
    {
        element: <Layout />,
        children: [
            { path: '/', element: <HomePage /> },
            { path: '/profile', element: <ProfilePage /> },
            { path: '/archive', element: <ArchivePage /> },
            { path: '/diary', element: <DiaryPage /> },
            { path: '/chat', element: <ChatPage /> },
            { path: '/survey', element: <SurveyPage /> },
            { path: '/tutorial', element: <TutorialPage /> },
        ],
    },
];

export default studentRoutes;
