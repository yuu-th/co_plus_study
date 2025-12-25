-- 010: Allow students to create chat rooms with mentors
-- Students can initiate chat with any active mentor

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Admins can create chat rooms" ON chat_rooms;

-- Students can create chat rooms where they are the student
CREATE POLICY "Students can create chat rooms"
    ON chat_rooms FOR INSERT
    TO authenticated
    WITH CHECK (
        -- The authenticated user must be the student in the chat room
        auth.uid() = student_id
        AND
        -- The mentor must exist and be active
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN mentor_profiles mp ON mp.user_id = p.id
            WHERE p.id = mentor_id 
              AND p.role = 'mentor'
              AND mp.status = 'active'
        )
    );

-- Mentors can also create chat rooms (for reaching out to students)
CREATE POLICY "Mentors can create chat rooms"
    ON chat_rooms FOR INSERT
    TO authenticated
    WITH CHECK (
        -- The authenticated user must be the mentor in the chat room
        auth.uid() = mentor_id
        AND
        -- The student must exist
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = student_id AND role = 'student'
        )
        AND
        -- The authenticated user must be a mentor
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'mentor'
        )
    );

-- Admins can create any chat room
CREATE POLICY "Admins can create any chat room"
    ON chat_rooms FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
