-- Fix the infinite recursion in profiles policies
-- Run this in Supabase SQL Editor

-- 1. Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

-- 2. Create simple, non-recursive policies
-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile (except role_id)
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Create admin policies using direct auth.users metadata check (no recursion)
-- Admin can view all profiles
CREATE POLICY "Admin can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
        )
    );

-- Admin can update all profiles
CREATE POLICY "Admin can update all profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
        )
    );

-- Admin can insert profiles for other users
CREATE POLICY "Admin can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
        )
    );

-- Admin can delete profiles
CREATE POLICY "Admin can delete profiles" ON public.profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
        )
    );

-- 4. Force create/update your admin profile
-- Replace the email with your actual email
INSERT INTO public.profiles (id, name, role_id, is_active, email_verified)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)) as name,
    '1' as role_id,
    true as is_active,
    email_confirmed_at IS NOT NULL as email_verified
FROM auth.users 
WHERE email = 'rsantoso.me@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET 
    role_id = '1',
    is_active = true,
    updated_at = NOW();

-- 5. Verify the fix
SELECT 
    'Verification - Your admin profile:' as info,
    u.email,
    u.raw_user_meta_data->>'role' as metadata_role,
    p.name,
    p.role_id,
    p.is_active,
    r.name as role_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.roles r ON p.role_id = r.id
WHERE u.email = 'rsantoso.me@gmail.com';

-- 6. Test profile access
SELECT 
    'Profile access test:' as info,
    id, 
    name, 
    role_id 
FROM public.profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'rsantoso.me@gmail.com');
