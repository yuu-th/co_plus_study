// ルーティング設定

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { studentRoutes } from '@/features/student/routes';
import { mentorRoutes } from '@/features/mentor/routes';
import { studentAuthRoutes } from '@/features/auth/student/routes';
import { mentorAuthRoutes } from '@/features/auth/mentor/routes';

const router = createBrowserRouter([
  ...studentAuthRoutes,
  ...mentorAuthRoutes,
  ...studentRoutes,
  ...mentorRoutes,
  {
    path: '*',
    element: <ErrorBoundary />,
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
