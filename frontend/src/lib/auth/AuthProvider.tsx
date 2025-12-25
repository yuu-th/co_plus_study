// Authentication context and provider
// @see ADR-005: 認証設計（段階的認証モデル）

import type { AuthError, Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { isMockModeEnabled, supabase } from '../supabase';

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

interface SignUpData {
    email: string;
    password: string;
    displayName: string;
    nameKana: string;
    grade: string;
}

interface AuthActions {
    /** Sign up with email, password, and profile data */
    signUp: (data: SignUpData) => Promise<{ error: Error | null }>;
    /** Sign in with email and password */
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    /** Sign out */
    signOut: () => Promise<{ error: AuthError | null }>;
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
    
    // 初期化フラグ
    const isMounted = useRef(true);
    const initializationStarted = useRef(false);
    const initializationResolved = useRef(false);

    const isAuthenticated = !!user;

    // 初期化完了をマークする関数
    const resolveInitialization = (reason: string) => {
        if (isMounted.current && !initializationResolved.current) {
            console.log(`[AuthProvider] Resolving initialization (Reason: ${reason})`);
            initializationResolved.current = true;
            setIsLoading(false);
        } else {
            console.log(`[AuthProvider] resolveInitialization called but skipped (Reason: ${reason}, isMounted: ${isMounted.current}, alreadyResolved: ${initializationResolved.current})`);
        }
    };

    // Fetch profile from database
    const fetchProfile = async (userId: string): Promise<Profile | null> => {
        console.log('[AuthProvider] fetchProfile started for:', userId);
        
        try {
            // タイムアウト付きのフェッチ
            const fetchPromise = supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
                
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Profile fetch timeout')), 8000)
            );

            console.log('[AuthProvider] fetchProfile: awaiting supabase call...');
            const result = await Promise.race([fetchPromise, timeoutPromise]) as any;
            
            if (result instanceof Error) throw result;
            const { data, error } = result;

            if (error) {
                console.error('[AuthProvider] Error fetching profile:', error);
                return null;
            }
            console.log('[AuthProvider] fetchProfile success:', !!data);
            return data as Profile;
        } catch (err) {
            console.error('[AuthProvider] Unexpected error fetching profile:', err);
            return null;
        }
    };

    // Initialize auth state
    useEffect(() => {
        isMounted.current = true;

        if (initializationStarted.current) {
            return;
        }
        initializationStarted.current = true;

        console.log('[AuthProvider] useEffect initialization started');

        // セーフティタイマー: 15秒経っても初期化が終わらない場合は強制的に完了させる
        const safetyTimeout = setTimeout(() => {
            resolveInitialization('Safety timeout');
        }, 15000);

        // モックモードの場合は認証をスキップ
        if (isMockModeEnabled) {
            console.warn('[AuthProvider] Mock mode enabled, skipping real auth');
            setUser({ id: 'mock-user-id', email: 'mock@example.com' } as User);
            setProfile({
                id: 'mock-user-id',
                role: 'student',
                display_name: 'テストユーザー',
                name_kana: null,
                avatar_url: null,
                grade: '中学1年生',
                gender: null,
                introduction: null,
                last_seen_at: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
            resolveInitialization('Mock mode');
            return;
        }

        // 初期化関数
        const initializeAuth = async () => {
            console.log('[AuthProvider] initializeAuth function called');
            try {
                // セッション取得
                console.log('[AuthProvider] Calling getSession...');
                const { data: { session: currentSession }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.warn('[AuthProvider] Session error:', error.message);
                }
                
                if (!isMounted.current) return;

                console.log('[AuthProvider] getSession result:', { hasSession: !!currentSession });
                setSession(currentSession);
                setUser(currentSession?.user ?? null);

                // プロフィールを取得
                if (currentSession?.user) {
                    const userProfile = await fetchProfile(currentSession.user.id);
                    if (!isMounted.current) return;
                    setProfile(userProfile);
                }
            } catch (err) {
                console.error('[AuthProvider] Failed to initialize auth:', err);
            } finally {
                resolveInitialization('initializeAuth finished');
            }
        };

        initializeAuth();

        // Listen for auth changes
        console.log('[AuthProvider] Registering onAuthStateChange');
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
                console.log('[AuthProvider] Auth state changed event:', event);
                
                if (!isMounted.current) return;

                setSession(newSession);
                setUser(newSession?.user ?? null);

                if (newSession?.user) {
                    // すでにプロフィールがある場合でも、最新情報を取得
                    const userProfile = await fetchProfile(newSession.user.id);
                    if (!isMounted.current) return;
                    setProfile(userProfile);
                } else {
                    setProfile(null);
                }

                // SIGNED_OUT イベント時にローカルデータをクリア
                if (event === 'SIGNED_OUT') {
                    setProfile(null);
                }

                // イベントが発生した＝認証状態が確定したとみなして初期化完了
                resolveInitialization(`onAuthStateChange: ${event}`);
            }
        );

        return () => {
            console.log('[AuthProvider] useEffect cleanup');
            isMounted.current = false;
            clearTimeout(safetyTimeout);
            subscription.unsubscribe();
        };
    }, []);

    // Sign up with email, password, and profile data
    const signUp = async (data: SignUpData) => {
        try {
            // 1. アカウント作成
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
            });

            if (authError) {
                return { error: authError };
            }

            if (!authData.user) {
                return { error: new Error('アカウント作成に失敗しました') };
            }

            // 2. プロフィール更新（トリガーで作成済みのprofileを更新）
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    display_name: data.displayName,
                    name_kana: data.nameKana,
                    grade: data.grade,
                })
                .eq('id', authData.user.id);

            if (profileError) {
                console.error('[AuthProvider] Profile update failed:', profileError);
                return { error: new Error('プロフィール設定に失敗しました') };
            }

            // 3. プロフィールを取得して状態を更新
            const userProfile = await fetchProfile(authData.user.id);
            setProfile(userProfile);

            return { error: null };
        } catch (err) {
            console.error('[AuthProvider] SignUp error:', err);
            return { error: err instanceof Error ? err : new Error('予期しないエラーが発生しました') };
        }
    };

    // Sign in with email and password
    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        // ログイン成功時、プロフィールを取得して状態を更新
        if (!error && data.user) {
            const userProfile = await fetchProfile(data.user.id);
            setProfile(userProfile);
            setUser(data.user);
            setSession(data.session);
        }

        return { error };
    };

    // Sign out
    const signOut = async () => {
        setProfile(null);
        setUser(null);
        setSession(null);
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    // Update profile
    const updateProfile = async (data: Partial<Profile>) => {
        // セッションから直接ユーザーIDを取得（状態に依存しない）
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData?.session?.user?.id ?? user?.id;

        if (!currentUserId) {
            return { error: new Error('Not authenticated') };
        }

        const { error } = await supabase
            .from('profiles')
            .update(data)
            .eq('id', currentUserId);

        if (!error) {
            // Refresh profile data
            const userProfile = await fetchProfile(currentUserId);
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
        signUp,
        signIn,
        signOut,
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
