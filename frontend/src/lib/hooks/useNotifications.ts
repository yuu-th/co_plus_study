// Notification data hooks with Realtime support
// @see ADR-005: バックエンド連携アーキテクチャ

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

// Query keys
export const NOTIFICATION_QUERY_KEYS = {
    all: ['notifications'] as const,
    list: () => [...NOTIFICATION_QUERY_KEYS.all, 'list'] as const,
    unreadCount: () => [...NOTIFICATION_QUERY_KEYS.all, 'unreadCount'] as const,
    detail: (id: string) => [...NOTIFICATION_QUERY_KEYS.all, 'detail', id] as const,
};

// Types
interface NotificationRow {
    id: string;
    category: string;
    title: string;
    content: string;
    priority: string;
    icon_url: string | null;
    created_by: string | null;
    expires_at: string | null;
    created_at: string;
}

interface UserNotificationRow {
    id: string;
    notification_id: string;
    user_id: string;
    is_read: boolean;
    read_at: string | null;
}

interface NotificationWithReadStatus extends NotificationRow {
    userNotification: UserNotificationRow | null;
    isRead: boolean;
}

interface CreateNotificationInput {
    category: 'info' | 'event' | 'important';
    title: string;
    content: string;
    priority?: 'low' | 'normal' | 'high';
    icon_url?: string | null;
    created_by?: string | null;
    expires_at?: string | null;
}

// Fetch notifications for user
export function useNotifications(userId?: string) {
    return useQuery({
        queryKey: NOTIFICATION_QUERY_KEYS.list(),
        queryFn: async () => {
            const { data: notifications, error: notifError } = await supabase
                .from('notifications')
                .select('*')
                .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
                .order('created_at', { ascending: false });

            if (notifError) {
                throw new Error(notifError.message);
            }

            const notifList = (notifications || []) as NotificationRow[];

            if (!userId || notifList.length === 0) {
                return notifList.map(n => ({ ...n, userNotification: null, isRead: false }));
            }

            const { data: userNotifications, error: userNotifError } = await supabase
                .from('user_notifications')
                .select('*')
                .eq('user_id', userId);

            if (userNotifError) {
                throw new Error(userNotifError.message);
            }

            const userNotifList = (userNotifications || []) as UserNotificationRow[];
            const userNotifMap = new Map(
                userNotifList.map(un => [un.notification_id, un])
            );

            return notifList.map(n => ({
                ...n,
                userNotification: userNotifMap.get(n.id) || null,
                isRead: userNotifMap.get(n.id)?.is_read || false,
            })) as NotificationWithReadStatus[];
        },
        enabled: true,
    });
}

// Fetch unread notification count
export function useUnreadNotificationCount(userId?: string) {
    return useQuery({
        queryKey: NOTIFICATION_QUERY_KEYS.unreadCount(),
        queryFn: async () => {
            if (!userId) return 0;

            const { data: notifications, error: notifError } = await supabase
                .from('notifications')
                .select('id')
                .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

            if (notifError) {
                throw new Error(notifError.message);
            }

            const { data: readNotifs, error: readError } = await supabase
                .from('user_notifications')
                .select('notification_id')
                .eq('user_id', userId)
                .eq('is_read', true);

            if (readError) {
                throw new Error(readError.message);
            }

            const notifList = (notifications || []) as { id: string }[];
            const readList = (readNotifs || []) as { notification_id: string }[];

            const readSet = new Set(readList.map(r => r.notification_id));
            return notifList.filter(n => !readSet.has(n.id)).length;
        },
        enabled: !!userId,
    });
}

// Subscribe to new notifications (Realtime)
export function useRealtimeNotifications() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                },
                () => {
                    queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);
}

// Mark notification as read mutation
export function useMarkNotificationAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ notificationId, userId }: { notificationId: string; userId: string }) => {
            const { data: existing } = await supabase
                .from('user_notifications')
                .select('id')
                .eq('notification_id', notificationId)
                .eq('user_id', userId)
                .single();

            const existingRow = existing as { id: string } | null;

            if (existingRow) {
                const updateData = { is_read: true, read_at: new Date().toISOString() } as unknown as Record<string, unknown>;
                const { error } = await supabase
                    .from('user_notifications')
                    .update(updateData)
                    .eq('id', existingRow.id);

                if (error) throw new Error(error.message);
            } else {
                const insertData = {
                    notification_id: notificationId,
                    user_id: userId,
                    is_read: true,
                    read_at: new Date().toISOString(),
                } as unknown as Record<string, unknown>;

                const { error } = await supabase
                    .from('user_notifications')
                    .insert(insertData);

                if (error) throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
        },
    });
}

// Mark all notifications as read
export function useMarkAllNotificationsAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId: string) => {
            const { data: notifications } = await supabase
                .from('notifications')
                .select('id');

            const { data: existingUserNotifs } = await supabase
                .from('user_notifications')
                .select('notification_id')
                .eq('user_id', userId);

            const notifList = (notifications || []) as { id: string }[];
            const existingList = (existingUserNotifs || []) as { notification_id: string }[];

            const existingSet = new Set(existingList.map(un => un.notification_id));
            const notifIds = notifList.map(n => n.id);

            const newNotifs = notifIds
                .filter(id => !existingSet.has(id))
                .map(notification_id => ({
                    notification_id,
                    user_id: userId,
                    is_read: true,
                    read_at: new Date().toISOString(),
                }));

            if (newNotifs.length > 0) {
                const insertData = newNotifs as unknown as Record<string, unknown>[];
                await supabase.from('user_notifications').insert(insertData);
            }

            const updateData = { is_read: true, read_at: new Date().toISOString() } as unknown as Record<string, unknown>;
            await supabase
                .from('user_notifications')
                .update(updateData)
                .eq('user_id', userId)
                .eq('is_read', false);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
        },
    });
}

// Create notification (mentor/admin only)
export function useCreateNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (notification: CreateNotificationInput) => {
            const insertData = { ...notification } as unknown as Record<string, unknown>;
            const { data, error } = await supabase
                .from('notifications')
                .insert(insertData)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
        },
    });
}

// Update notification
export function useUpdateNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: { id: string } & Partial<NotificationRow>) => {
            const updateData = { ...updates } as unknown as Record<string, unknown>;
            const { data, error } = await supabase
                .from('notifications')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
        },
    });
}

// Delete notification
export function useDeleteNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', id);

            if (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
        },
    });
}
