-- SQL untuk menjadikan user existing sebagai admin
-- Jalankan di Supabase SQL Editor

-- Jika tabel profiles belum ada, jalankan setup_profiles_table.sql terlebih dahulu

-- Update user pertama menjadi admin
-- Ganti 'your-email@example.com' dengan email akun Anda di Supabase
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-email@example.com';

-- Atau jika Anda ingin menjadikan user pertama sebagai admin:
-- UPDATE auth.users 
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
-- WHERE id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1);

-- Buat atau update profile untuk user admin
INSERT INTO public.profiles (id, name, role_id, is_active, email_verified)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)) as name,
    '1' as role_id,
    true as is_active,
    email_confirmed_at IS NOT NULL as email_verified
FROM auth.users 
WHERE email = 'your-email@example.com'
ON CONFLICT (id) 
DO UPDATE SET 
    role_id = '1',
    is_active = true,
    updated_at = NOW();

-- Verifikasi hasil
SELECT 
    u.email,
    u.raw_user_meta_data,
    p.name,
    p.role_id,
    r.name as role_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.roles r ON p.role_id = r.id
WHERE u.email = 'your-email@example.com';
