# Setup User Management dengan Supabase

## 📋 Langkah Setup

### 1. Setup Database Tables (Opsional tapi Direkomendasikan)

Jalankan SQL script berikut di **Supabase SQL Editor**:

```sql
-- Buka file setup_profiles_table.sql dan copy-paste isinya ke Supabase SQL Editor
```

File `setup_profiles_table.sql` akan membuat:
- ✅ Tabel `profiles` untuk informasi tambahan user
- ✅ Tabel `roles` untuk sistem role
- ✅ RLS (Row Level Security) policies
- ✅ Triggers untuk auto-update timestamps
- ✅ Function untuk auto-create profile saat user baru signup

### 2. Setup Service Role Key (Untuk Admin Functions)

Untuk menggunakan admin functions seperti `listUsers`, `createUser`, `deleteUser`, Anda perlu:

1. **Buka Supabase Dashboard** → Settings → API
2. **Copy Service Role Key** (bukan Anon Public key)
3. **Tambahkan ke file `.env.local`**:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Tambahkan ini
```

### 3. Update Supabase Client untuk Admin

Buat file `src/utils/supabase/admin.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
```

### 4. Fitur yang Sudah Tersedia

#### ✅ **Real Data dari Supabase Auth**
- Data user diambil dari `auth.users` di Supabase
- Informasi tambahan dari tabel `profiles`
- Avatar menggunakan UI Avatars API sebagai fallback

#### ✅ **User Management Operations**
- **Create User**: Membuat user di auth + profile
- **Update User**: Update metadata auth + profile
- **Delete User**: Hapus dari auth + profile
- **Ban/Unban**: Menggunakan Supabase auth ban system

#### ✅ **Role System**
- Role tersimpan di database `roles` table
- Default roles: Admin & Warga
- Permission-based access control

### 5. Data Yang Ditampilkan

User Management sekarang menampilkan:
- ✅ **Real users** dari Supabase auth yang sudah Anda buat
- ✅ **Email verification status** yang sebenarnya
- ✅ **Last login time** yang real
- ✅ **Role assignment** berdasarkan profile
- ✅ **Active/inactive status** berdasarkan ban status

### 6. Fallback System

Jika terjadi error atau tabel belum dibuat:
- ✅ System akan fallback ke dummy data
- ✅ Error akan di-log tapi tidak crash
- ✅ User tetap bisa melihat interface

## 🚀 Cara Test

1. **Buat beberapa user** di Supabase Auth Dashboard
2. **Jalankan SQL script** untuk membuat tables
3. **Restart development server**: `npm run dev`
4. **Buka User Management page**: `/settings/users`
5. **Lihat data real** dari Supabase Anda!

## 🔧 Customization

### Menambah Field User
Edit interface `SystemUser` dan update:
- SQL script untuk kolom baru di `profiles`
- Transform function di `loadData`
- Form components untuk input

### Menambah Role Baru
1. Insert ke table `roles` via SQL
2. Update `AVAILABLE_PERMISSIONS` jika perlu
3. Role akan otomatis muncul di interface

## 📈 Next Steps

- [ ] Implement actual permission checking
- [ ] Add user forms for create/edit
- [ ] Add email invitation system
- [ ] Add user activity logging
