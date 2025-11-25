// ルーティング設定

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
    path: '/',
    element: <Layout><HomePage /></Layout>,
  },
  {
    path: '/archive',
    element: <Layout><ArchivePage /></Layout>,
  },
  {
    path: '/diary',
    element: <Layout><DiaryPage /></Layout>,
  },
  {
    path: '/chat',
    element: <Layout><ChatPage /></Layout>,
  },
  {
    path: '/survey',
    element: <Layout><SurveyPage /></Layout>,
  },
  {
    path: '/tutorial',
    element: <Layout><TutorialPage /></Layout>,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
