import { useCallback, useMemo, useState } from 'react';
import { mockNotifications } from '@/shared/mockData/notifications';
import type { Notification } from '@/shared/types';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => n.read ? n : { ...n, read: true }));
    }, []);

    const addNotification = useCallback((partial: Omit<Notification, 'id' | 'createdAt' | 'read'> & { read?: boolean }) => {
        const newN: Notification = {
            id: `ntf-${Date.now()}`,
            createdAt: new Date().toISOString(),
            read: false,
            ...partial,
        };
        setNotifications(prev => [newN, ...prev]);
    }, []);

    const byCategory = useCallback((category: Notification['category'] | '') => {
        return category ? notifications.filter(n => n.category === category) : notifications;
    }, [notifications]);

    return { notifications, unreadCount, markAsRead, markAllAsRead, addNotification, byCategory };
};

export type UseNotificationsReturn = ReturnType<typeof useNotifications>;
