// Mentor auth routes
// @see specs/features/home.md

import type { RouteObject } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export const mentorAuthRoutes: RouteObject[] = [
    { path: '/mentor/login', element: <LoginPage /> },
    { path: '/mentor/register', element: <RegisterPage /> },
];

export default mentorAuthRoutes;
