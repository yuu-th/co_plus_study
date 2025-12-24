-- ADR-005: Initial Schema
-- CO+ Study Database Schema
-- @see project/decisions/005-backend-integration-preparation.md

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- 教科タイプ
CREATE TYPE subject_type AS ENUM (
    '国語', '数学', '理科', '社会', '英語', 'その他'
);

-- リアクション絵文字
CREATE TYPE reaction_emoji AS ENUM ('👍', '❤️', '🎉', '👏', '🔥');

-- メッセージタイプ
CREATE TYPE message_type AS ENUM ('text', 'image');

-- バッジランク
CREATE TYPE badge_rank AS ENUM ('platinum', 'gold', 'silver', 'bronze');

-- アンケートステータス
CREATE TYPE survey_status AS ENUM ('draft', 'scheduled', 'active', 'closed');

-- 通知カテゴリ
CREATE TYPE notification_category AS ENUM ('info', 'event', 'important');

-- 通知優先度
CREATE TYPE notification_priority AS ENUM ('low', 'normal', 'high');

-- メンターステータス
CREATE TYPE mentor_status AS ENUM ('active', 'inactive');

-- ============================================================================
-- TABLES
-- ============================================================================

-- 1. profiles (ユーザープロフィール拡張)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'student'
        CHECK (role IN ('student', 'mentor', 'admin')),
    display_name TEXT NOT NULL CHECK (char_length(display_name) >= 1),
    name_kana TEXT CHECK (name_kana ~ '^[ぁ-んァ-ヶー\s]+$' OR name_kana IS NULL),
    avatar_url TEXT,
    grade TEXT CHECK (
        grade IS NULL OR 
        grade IN ('小学1年','小学2年','小学3年','小学4年','小学5年','小学6年',
                  '中学1年','中学2年','中学3年')
    ),
    gender TEXT CHECK (gender IS NULL OR gender IN ('male', 'female')),
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. mentor_profiles (メンター固有情報)
CREATE TABLE public.mentor_profiles (
    user_id UUID PRIMARY KEY REFERENCES profiles ON DELETE CASCADE,
    specialties JSONB DEFAULT '[]'::jsonb,
    introduction TEXT,
    status mentor_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. diary_posts (学習日報)
CREATE TABLE public.diary_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
    subject subject_type NOT NULL,
    duration_minutes INT NOT NULL CHECK (duration_minutes BETWEEN 1 AND 59999),
    content TEXT NOT NULL CHECK (
        char_length(content) >= 1 AND char_length(content) <= 500
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_diary_posts_user_id ON diary_posts(user_id);
CREATE INDEX idx_diary_posts_created_at ON diary_posts(created_at DESC);

-- 4. diary_reactions (日報リアクション)
CREATE TABLE public.diary_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES diary_posts ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
    reaction_type reaction_emoji NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (post_id, user_id, reaction_type)
);

-- 5. chat_rooms (チャットルーム)
CREATE TABLE public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (student_id, mentor_id)
);

-- 6. messages (チャットメッセージ)
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES chat_rooms ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
    message_type message_type NOT NULL DEFAULT 'text',
    content TEXT CHECK (
        (message_type = 'text' AND char_length(content) BETWEEN 1 AND 500) OR
        (message_type = 'image' AND (content IS NULL OR char_length(content) <= 200))
    ),
    image_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (message_type = 'text' OR image_url IS NOT NULL)
);

CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- 7. message_reactions (メッセージリアクション)
CREATE TABLE public.message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
    emoji reaction_emoji NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (message_id, user_id, emoji)
);

-- 8. badge_definitions (バッジ定義マスタ)
CREATE TABLE public.badge_definitions (
    id TEXT PRIMARY KEY CHECK (id ~ '^[a-z][a-z0-9_]*$'),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    condition_description TEXT NOT NULL,
    rank badge_rank NOT NULL,
    category TEXT NOT NULL,
    condition_logic TEXT NOT NULL,
    icon_url TEXT,
    sort_order INT NOT NULL DEFAULT 0
);

-- 9. user_badges (ユーザー獲得バッジ)
CREATE TABLE public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
    badge_id TEXT NOT NULL REFERENCES badge_definitions ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, badge_id)
);

-- 10. surveys (アンケート)
CREATE TABLE public.surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL CHECK (char_length(title) >= 1),
    description TEXT,
    questions JSONB NOT NULL,
    release_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    status survey_status NOT NULL DEFAULT 'draft',
    created_by UUID NOT NULL REFERENCES profiles,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (status IN ('draft') OR release_date IS NOT NULL)
);

-- 11. survey_responses (アンケート回答)
CREATE TABLE public.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES surveys ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
    answers JSONB NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (survey_id, user_id)
);

-- 12. notifications (お知らせ)
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category notification_category NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority notification_priority NOT NULL DEFAULT 'normal',
    icon_url TEXT,
    created_by UUID REFERENCES profiles,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. user_notifications (ユーザー別通知状態)
CREATE TABLE public.user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL REFERENCES notifications ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMPTZ,
    UNIQUE (notification_id, user_id)
);

-- ============================================================================
-- ENABLE RLS
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
