-- Allow empty display_name initially for registration flow
-- Users must set it before accessing the app

-- Drop the old constraint
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_display_name_check;

-- Add new constraint that allows empty string
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_display_name_check 
CHECK (char_length(display_name) >= 0);

-- Update the trigger to create with empty display_name
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- 空の display_name で作成し、RegisterPage で入力させる
    INSERT INTO public.profiles (id, display_name, role)
    VALUES (NEW.id, '', 'student');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
