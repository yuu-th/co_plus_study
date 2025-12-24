-- ADR-005: RLS Policies
-- Row Level Security policies for all tables

-- ============================================================================
-- PROFILES
-- ============================================================================

-- Anyone authenticated can view profiles
CREATE POLICY "Profiles are viewable by authenticated users"
    ON profiles FOR SELECT
    TO authenticated
    USING (true);

-- Users can update their own profile only
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Profiles are auto-created by trigger, no manual INSERT needed
CREATE POLICY "Profiles can be inserted by trigger"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================================================
-- MENTOR_PROFILES
-- ============================================================================

-- Anyone authenticated can view mentor profiles
CREATE POLICY "Mentor profiles are viewable by authenticated users"
    ON mentor_profiles FOR SELECT
    TO authenticated
    USING (true);

-- Mentors can update their own mentor profile
CREATE POLICY "Mentors can update own mentor profile"
    ON mentor_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Mentors can create their own mentor profile
CREATE POLICY "Mentors can create own mentor profile"
    ON mentor_profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- DIARY_POSTS
-- ============================================================================

-- Anyone authenticated can view all diary posts
CREATE POLICY "Diary posts are viewable by authenticated users"
    ON diary_posts FOR SELECT
    TO authenticated
    USING (true);

-- Users can create their own diary posts
CREATE POLICY "Users can create own diary posts"
    ON diary_posts FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own diary posts
CREATE POLICY "Users can update own diary posts"
    ON diary_posts FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own diary posts
CREATE POLICY "Users can delete own diary posts"
    ON diary_posts FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================================================
-- DIARY_REACTIONS
-- ============================================================================

-- Anyone authenticated can view reactions
CREATE POLICY "Diary reactions are viewable by authenticated users"
    ON diary_reactions FOR SELECT
    TO authenticated
    USING (true);

-- Mentors can add reactions
CREATE POLICY "Mentors can add diary reactions"
    ON diary_reactions FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('mentor', 'admin')
        )
    );

-- Users can delete their own reactions
CREATE POLICY "Users can delete own diary reactions"
    ON diary_reactions FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================================================
-- CHAT_ROOMS
-- ============================================================================

-- Users can view rooms they're part of
CREATE POLICY "Users can view own chat rooms"
    ON chat_rooms FOR SELECT
    TO authenticated
    USING (
        auth.uid() = student_id OR 
        auth.uid() = mentor_id
    );

-- Admins can create chat rooms
CREATE POLICY "Admins can create chat rooms"
    ON chat_rooms FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================================
-- MESSAGES
-- ============================================================================

-- Users can view messages in their rooms
CREATE POLICY "Users can view messages in own rooms"
    ON messages FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM chat_rooms 
            WHERE id = room_id AND (student_id = auth.uid() OR mentor_id = auth.uid())
        )
    );

-- Users can send messages in their rooms
CREATE POLICY "Users can send messages in own rooms"
    ON messages FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM chat_rooms 
            WHERE id = room_id AND (student_id = auth.uid() OR mentor_id = auth.uid())
        )
    );

-- Users can update messages (mark as read, edit content)
CREATE POLICY "Users can update messages in own rooms"
    ON messages FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM chat_rooms 
            WHERE id = room_id AND (student_id = auth.uid() OR mentor_id = auth.uid())
        )
    );

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages"
    ON messages FOR DELETE
    TO authenticated
    USING (auth.uid() = sender_id);

-- ============================================================================
-- MESSAGE_REACTIONS
-- ============================================================================

-- Users can view reactions in their rooms
CREATE POLICY "Users can view message reactions in own rooms"
    ON message_reactions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM messages m
            JOIN chat_rooms cr ON m.room_id = cr.id
            WHERE m.id = message_id 
            AND (cr.student_id = auth.uid() OR cr.mentor_id = auth.uid())
        )
    );

-- Users can add reactions to messages in their rooms
CREATE POLICY "Users can add message reactions in own rooms"
    ON message_reactions FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM messages m
            JOIN chat_rooms cr ON m.room_id = cr.id
            WHERE m.id = message_id 
            AND (cr.student_id = auth.uid() OR cr.mentor_id = auth.uid())
        )
    );

-- Users can delete their own reactions
CREATE POLICY "Users can delete own message reactions"
    ON message_reactions FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================================================
-- BADGE_DEFINITIONS
-- ============================================================================

-- Everyone can view badge definitions
CREATE POLICY "Badge definitions are viewable by everyone"
    ON badge_definitions FOR SELECT
    TO authenticated
    USING (true);

-- Only admins can manage badge definitions
CREATE POLICY "Admins can manage badge definitions"
    ON badge_definitions FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================================
-- USER_BADGES
-- ============================================================================

-- Users can view their own badges
CREATE POLICY "Users can view own badges"
    ON user_badges FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Mentors can view their students' badges
CREATE POLICY "Mentors can view student badges"
    ON user_badges FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM chat_rooms 
            WHERE mentor_id = auth.uid() AND student_id = user_badges.user_id
        )
    );

-- ============================================================================
-- SURVEYS
-- ============================================================================

-- Everyone can view active surveys
CREATE POLICY "Active surveys are viewable by authenticated users"
    ON surveys FOR SELECT
    TO authenticated
    USING (status = 'active');

-- Mentors/admins can view all surveys
CREATE POLICY "Mentors and admins can view all surveys"
    ON surveys FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('mentor', 'admin')
        )
    );

-- Mentors/admins can create surveys
CREATE POLICY "Mentors and admins can create surveys"
    ON surveys FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = created_by AND
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('mentor', 'admin')
        )
    );

-- Survey creators can update their surveys
CREATE POLICY "Survey creators can update own surveys"
    ON surveys FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

-- Survey creators can delete their surveys
CREATE POLICY "Survey creators can delete own surveys"
    ON surveys FOR DELETE
    TO authenticated
    USING (auth.uid() = created_by);

-- ============================================================================
-- SURVEY_RESPONSES
-- ============================================================================

-- Users can view their own responses
CREATE POLICY "Users can view own survey responses"
    ON survey_responses FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Survey creators can view all responses
CREATE POLICY "Survey creators can view all responses"
    ON survey_responses FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM surveys 
            WHERE id = survey_id AND created_by = auth.uid()
        )
    );

-- Users can submit responses (once per survey)
CREATE POLICY "Users can submit survey responses"
    ON survey_responses FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

-- Everyone can view notifications
CREATE POLICY "Notifications are viewable by authenticated users"
    ON notifications FOR SELECT
    TO authenticated
    USING (true);

-- Mentors/admins can create notifications
CREATE POLICY "Mentors and admins can create notifications"
    ON notifications FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('mentor', 'admin')
        )
    );

-- Notification creators can update their notifications
CREATE POLICY "Notification creators can update own notifications"
    ON notifications FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

-- Notification creators can delete their notifications
CREATE POLICY "Notification creators can delete own notifications"
    ON notifications FOR DELETE
    TO authenticated
    USING (auth.uid() = created_by);

-- ============================================================================
-- USER_NOTIFICATIONS
-- ============================================================================

-- Users can view their own notification states
CREATE POLICY "Users can view own notification states"
    ON user_notifications FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Users can update their own notification states (mark as read)
CREATE POLICY "Users can update own notification states"
    ON user_notifications FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- System can insert notification states for users
CREATE POLICY "System can create user notification states"
    ON user_notifications FOR INSERT
    TO authenticated
    WITH CHECK (true);
