// Authentication context and provider
// @see ADR-005: 認証設計（段階的認証モデル）

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabase';

// Profile type (inline to avoid import issues during initial setup)
interface Profile {
    id: string;
    role: string;
    display_name: string;
    name_kana: string | null;
    avatar_url: string | null;
    grade: string | null;
    gender: string | null;
    introduction: string | null;
    last_seen_at: string | null;
    created_at: string;
    updated_at: string;
}

interface AuthState {
    /** Supabase Auth user */
    user: User | null;
    /** Current session */
    session: Session | null;
    /** User profile from profiles table */
    profile: Profile | null;
    /** Loading state during initialization */
    isLoading: boolean;
    /** Whether user is authenticated */
    isAuthenticated: boolean;
}

interface AuthActions {
    /** Sign in anonymously (Phase 1) */
    signInAnonymously: () => Promise<{ error: AuthError | null }>;
    /** Sign out */
    signOut: () => Promise<{ error: AuthError | null }>;
    /** Link with Google OAuth (Phase 2) */
    linkWithGoogle: () => Promise<{ error: AuthError | null }>;
    /** Update profile */
    updateProfile: (data: Partial<Profile>) => Promise<{ error: Error | null }>;
    /** Refresh profile data */
    refreshProfile: () => Promise<void>;
}

type AuthContextType = AuthState & AuthActions;

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user;

    // Fetch profile from database
    const fetchProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
        return data;
    };

    // Initialize auth state
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                const userProfile = await fetchProfile(session.user.id);
                setProfile(userProfile);
            }

            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    const userProfile = await fetchProfile(session.user.id);
                    setProfile(userProfile);
                } else {
                    setProfile(null);
                }

                // SIGNED_OUT イベント時にローカルデータをクリア
                if (event === 'SIGNED_OUT') {
                    setProfile(null);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Sign in anonymously
    const signInAnonymously = async () => {
        const { error } = await supabase.auth.signInAnonymously();
        return { error };
    };

    // Sign out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    // Link with Google (for upgrading anonymous account)
    const linkWithGoogle = async () => {
        const { error } = await supabase.auth.linkIdentity({
            provider: 'google',
        });
        return { error };
    };

    // Update profile
    const updateProfile = async (data: Partial<Profile>) => {
        if (!user) {
            return { error: new Error('Not authenticated') };
        }

        const { error } = await supabase
            .from('profiles')
            .update(data)
            .eq('id', user.id);

        if (!error) {
            // Refresh profile data
            const userProfile = await fetchProfile(user.id);
            setProfile(userProfile);
        }

        return { error: error ? new Error(error.message) : null };
    };

    // Refresh profile
    const refreshProfile = async () => {
        if (user) {
            const userProfile = await fetchProfile(user.id);
            setProfile(userProfile);
        }
    };

    const value: AuthContextType = {
        user,
        session,
        profile,
        isLoading,
        isAuthenticated,
        signInAnonymously,
        signOut,
        linkWithGoogle,
        updateProfile,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;
