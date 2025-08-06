-- SQL untuk debug dan fix admin role assignment
-- Jalankan di Supabase SQL Editor setelah login dengan akun admin Anda

-- 1. Check if profiles table exists and has data
SELECT 'Profiles table structure:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check existing users in auth.users
SELECT 'Current users in auth.users:' as info;
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    raw_user_meta_data
FROM auth.users
ORDER BY created_at;

-- 3. Check existing profiles
SELECT 'Current profiles:' as info;
SELECT 
    p.id,
    p.name,
    p.role_id,
    p.is_active,
    u.email
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at;

-- 4. Check roles table
SELECT 'Current roles:' as info;
SELECT * FROM public.roles ORDER BY id;

-- 5. FORCE CREATE/UPDATE admin profile
-- Replace 'your-email@example.com' with your actual email
DO $$
DECLARE
    user_uuid UUID;
    user_email TEXT := 'your-email@example.com'; -- CHANGE THIS TO YOUR EMAIL
BEGIN
    -- Get user ID from email
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = user_email;
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE 'User with email % not found', user_email;
    ELSE
        RAISE NOTICE 'Found user ID: % for email: %', user_uuid, user_email;
        
        -- Force insert/update profile with admin role
        INSERT INTO public.profiles (id, name, role_id, is_active, email_verified)
        VALUES (
            user_uuid,
            COALESCE(
                (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = user_uuid),
                split_part(user_email, '@', 1)
            ),
            '1', -- Admin role
            true,
            true
        )
        ON CONFLICT (id) 
        DO UPDATE SET 
            role_id = '1',
            is_active = true,
            updated_at = NOW();
            
        RAISE NOTICE 'Profile updated/created for user %', user_email;
    END IF;
END $$;

-- 6. Final verification
SELECT 'Final verification:' as info;
SELECT 
    u.email,
    u.id,
    u.raw_user_meta_data,
    p.name,
    p.role_id,
    r.name as role_name,
    p.is_active
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.roles r ON p.role_id = r.id
WHERE u.email = 'your-email@example.com'; -- CHANGE THIS TO YOUR EMAIL
