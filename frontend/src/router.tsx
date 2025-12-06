// ルーティング設定

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import AccountRegistrationPage from './pages/AccountRegistrationPage';
import ArchivePage from './pages/ArchivePage';
import ChatPage from './pages/ChatPage';
import DiaryPage from './pages/DiaryPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MentorDashboardPage from './pages/MentorDashboardPage';
import NotificationManagePage from './pages/NotificationManagePage';
import ProfilePage from './pages/ProfilePage';
import StudentDetailPage from './pages/StudentDetailPage';
import StudentListPage from './pages/StudentListPage';
import SurveyPage from './pages/SurveyPage';
import TutorialPage from './pages/TutorialPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <AccountRegistrationPage />,
  },
  {
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/archive',
        element: <ArchivePage />,
      },
      {
        path: '/diary',
        element: <DiaryPage />,
      },
      {
        path: '/chat',
        element: <ChatPage />,
      },
      {
        path: '/survey',
        element: <SurveyPage />,
      },
      {
        path: '/tutorial',
        element: <TutorialPage />,
      },
    ],
  },
  // メンター関連ルート（/mentor 配下）
  {
    path: '/mentor',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'dashboard',
        element: <MentorDashboardPage />,
      },
      {
        path: 'students',
        element: <StudentListPage />,
      },
      {
        path: 'students/:id',
        element: <StudentDetailPage />,
      },
      {
        path: 'notifications',
        element: <NotificationManagePage />,
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
