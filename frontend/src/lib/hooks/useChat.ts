// Chat data hooks with Realtime support
// @see ADR-005: バックエンド連携アーキテクチャ

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../supabase';

// Query keys
export const CHAT_QUERY_KEYS = {
    all: ['chat'] as const,
    rooms: () => [...CHAT_QUERY_KEYS.all, 'rooms'] as const,
    room: (id: string) => [...CHAT_QUERY_KEYS.all, 'room', id] as const,
    messages: (roomId: string) => [...CHAT_QUERY_KEYS.all, 'messages', roomId] as const,
};

// Types
interface ChatRoomWithParticipants {
    id: string;
    student_id: string;
    mentor_id: string;
    created_at: string;
    student: {
        id: string;
        display_name: string;
        avatar_url: string | null;
    };
    mentor: {
        id: string;
        display_name: string;
        avatar_url: string | null;
        gender: string | null;
    };
}

interface MessageWithSender {
    id: string;
    room_id: string;
    sender_id: string;
    message_type: string;
    content: string | null;
    image_url: string | null;
    is_read: boolean;
    created_at: string;
    sender: {
        id: string;
        display_name: string;
        avatar_url: string | null;
        role: string;
    };
    reactions: {
        emoji: string;
        user_id: string;
    }[];
}

interface SendMessageInput {
    room_id: string;
    sender_id: string;
    message_type?: 'text' | 'image';
    content?: string | null;
    image_url?: string | null;
}

interface AddReactionInput {
    message_id: string;
    user_id: string;
    emoji: string;
}

// Fetch user's chat rooms
export function useChatRooms(userId?: string) {
    return useQuery({
        queryKey: CHAT_QUERY_KEYS.rooms(),
        queryFn: async () => {
            let query = supabase
                .from('chat_rooms')
                .select(`
                    *,
                    student:profiles!student_id(id, display_name, avatar_url),
                    mentor:profiles!mentor_id(id, display_name, avatar_url, gender)
                `);

            if (userId) {
                query = query.or(`student_id.eq.${userId},mentor_id.eq.${userId}`);
            }

            const { data, error } = await query;

            if (error) {
                throw new Error(error.message);
            }

            return data as unknown as ChatRoomWithParticipants[];
        },
        enabled: !!userId,
    });
}

// Fetch single chat room
export function useChatRoom(roomId: string) {
    return useQuery({
        queryKey: CHAT_QUERY_KEYS.room(roomId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('chat_rooms')
                .select(`
                    *,
                    student:profiles!student_id(id, display_name, avatar_url),
                    mentor:profiles!mentor_id(id, display_name, avatar_url, gender)
                `)
                .eq('id', roomId)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data as unknown as ChatRoomWithParticipants;
        },
        enabled: !!roomId,
    });
}

// Fetch messages with pagination
export function useMessages(roomId: string, limit = 50) {
    return useInfiniteQuery({
        queryKey: CHAT_QUERY_KEYS.messages(roomId),
        queryFn: async ({ pageParam = 0 }) => {
            const { data, error } = await supabase
                .from('messages')
                .select(`
                    *,
                    sender:profiles!sender_id(id, display_name, avatar_url, role),
                    reactions:message_reactions(emoji, user_id)
                `)
                .eq('room_id', roomId)
                .order('created_at', { ascending: false })
                .range(pageParam, pageParam + limit - 1);

            if (error) {
                throw new Error(error.message);
            }

            const messages = (data || []) as unknown as MessageWithSender[];

            return {
                data: messages.reverse(),
                nextPage: data && data.length === limit ? pageParam + limit : undefined,
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 0,
        enabled: !!roomId,
    });
}

// Subscribe to new messages (Realtime)
export function useRealtimeMessages(roomId: string) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!roomId) return;

        const channel = supabase
            .channel(`messages:${roomId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `room_id=eq.${roomId}`,
                },
                () => {
                    queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(roomId) });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'messages',
                    filter: `room_id=eq.${roomId}`,
                },
                () => {
                    queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(roomId) });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, queryClient]);
}

// Send message mutation
export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (message: SendMessageInput) => {
            const insertData = { ...message } as unknown as Record<string, unknown>;
            const { data, error } = await supabase
                .from('messages')
                .insert(insertData)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data as { id: string; room_id: string };
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(data.room_id) });
        },
    });
}

// Mark messages as read mutation
export function useMarkMessagesAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ roomId, userId }: { roomId: string; userId: string }) => {
            const updateData = { is_read: true } as unknown as Record<string, unknown>;
            const { error } = await supabase
                .from('messages')
                .update(updateData)
                .eq('room_id', roomId)
                .neq('sender_id', userId)
                .eq('is_read', false);

            if (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(variables.roomId) });
        },
    });
}

// Add message reaction mutation
export function useAddMessageReaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (reaction: AddReactionInput) => {
            const insertData = { ...reaction } as unknown as Record<string, unknown>;
            const { data, error } = await supabase
                .from('message_reactions')
                .insert(insertData)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data as { message_id: string };
        },
        onSuccess: async (data) => {
            const { data: message } = await supabase
                .from('messages')
                .select('room_id')
                .eq('id', data.message_id)
                .single();

            if (message) {
                const msg = message as { room_id: string };
                queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(msg.room_id) });
            }
        },
    });
}

// Remove message reaction mutation
export function useRemoveMessageReaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ messageId, userId, emoji }: { messageId: string; userId: string; emoji: string }) => {
            const { data: message } = await supabase
                .from('messages')
                .select('room_id')
                .eq('id', messageId)
                .single();

            const { error } = await supabase
                .from('message_reactions')
                .delete()
                .eq('message_id', messageId)
                .eq('user_id', userId)
                .eq('emoji', emoji);

            if (error) {
                throw new Error(error.message);
            }

            return { roomId: (message as { room_id?: string })?.room_id };
        },
        onSuccess: (data) => {
            if (data.roomId) {
                queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(data.roomId) });
            }
        },
    });
}

// Create a new chat room
export function useCreateChatRoom() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ studentId, mentorId }: { studentId: string; mentorId: string }) => {
            const insertData = {
                student_id: studentId,
                mentor_id: mentorId,
            } as unknown as Record<string, unknown>;

            const { data, error } = await supabase
                .from('chat_rooms')
                .insert(insertData)
                .select(`
                    *,
                    student:profiles!student_id(id, display_name, avatar_url),
                    mentor:profiles!mentor_id(id, display_name, avatar_url, gender)
                `)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data as unknown as ChatRoomWithParticipants;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.rooms() });
        },
    });
}

// Get or create a chat room between student and mentor
export function useGetOrCreateChatRoom() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ studentId, mentorId }: { studentId: string; mentorId: string }) => {
            // First, check if a room already exists
            const { data: existingRoom } = await supabase
                .from('chat_rooms')
                .select(`
                    *,
                    student:profiles!student_id(id, display_name, avatar_url),
                    mentor:profiles!mentor_id(id, display_name, avatar_url, gender)
                `)
                .eq('student_id', studentId)
                .eq('mentor_id', mentorId)
                .maybeSingle();

            if (existingRoom) {
                return existingRoom as unknown as ChatRoomWithParticipants;
            }

            // Create a new room
            const insertData = {
                student_id: studentId,
                mentor_id: mentorId,
            } as unknown as Record<string, unknown>;

            const { data, error } = await supabase
                .from('chat_rooms')
                .insert(insertData)
                .select(`
                    *,
                    student:profiles!student_id(id, display_name, avatar_url),
                    mentor:profiles!mentor_id(id, display_name, avatar_url, gender)
                `)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data as unknown as ChatRoomWithParticipants;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.rooms() });
        },
    });
}

// Upload chat image
export async function uploadChatImage(roomId: string, userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${roomId}/${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(fileName, file);

    if (uploadError) {
        throw new Error(uploadError.message);
    }

    const { data: { publicUrl } } = supabase.storage
        .from('chat-images')
        .getPublicUrl(fileName);

    return publicUrl;
}
