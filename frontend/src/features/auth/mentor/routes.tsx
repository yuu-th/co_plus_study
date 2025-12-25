// Mentor auth routes
// @see specs/features/auth.md

import type { RouteObject } from 'react-router-dom';
import MentorLoginPage from './pages/MentorLoginPage';

export const mentorAuthRoutes: RouteObject[] = [
    { path: '/mentor/login', element: <MentorLoginPage /> },
];

export default mentorAuthRoutes;
