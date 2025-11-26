// ルーティング設定

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import ArchivePage from './pages/ArchivePage';
import ChatPage from './pages/ChatPage';
import DiaryPage from './pages/DiaryPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SurveyPage from './pages/SurveyPage';
import TutorialPage from './pages/TutorialPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
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
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
