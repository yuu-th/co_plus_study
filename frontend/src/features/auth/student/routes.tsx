// Student auth routes
// @see specs/features/home.md

import type { RouteObject } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export const studentAuthRoutes: RouteObject[] = [
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
];

export default studentAuthRoutes;
