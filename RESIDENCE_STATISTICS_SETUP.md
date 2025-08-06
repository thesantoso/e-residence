# E-Residence - Residence Statistics Component

Komponen `ResidenceStatistics` telah diubah dari `EcommerceMetrics` untuk menampilkan statistik penduduk perumahan.

## Fitur Utama

### ✅ Statistik yang Ditampilkan:
1. **Total Penduduk** - Jumlah keseluruhan warga
2. **Total Kepala Keluarga** - Jumlah KK
3. **Warga Laki-laki** - Jumlah penduduk laki-laki
4. **Warga Perempuan** - Jumlah penduduk perempuan

### ✅ Data Integration:
- **Live Data Mode**: Data real-time dari ResidentContext
- **Demo Mode**: Data dummy untuk demo/fallback
- **Error Handling**: Menampilkan error state dengan fallback data
- **Loading State**: Skeleton loading untuk UX yang baik

### ✅ Responsive Design:
- Grid layout responsive (1 kolom di mobile, 4 kolom di desktop)
- Color-coded cards dengan tema yang konsisten
- Hover effects dan animasi smooth

## Penggunaan

### 1. Dalam Dashboard (Live Data)
```tsx
<ResidenceStatistics showLiveData={true} />
```

### 2. Standalone (Demo Data)
```tsx
<ResidenceStatistics showLiveData={false} />
```

## Struktur Data

### ResidenceStats Interface
```typescript
interface ResidenceStats {
  totalResidents: number;    // Total penduduk
  totalFamilies: number;     // Total kepala keluarga  
  maleResidents: number;     // Warga laki-laki
  femaleResidents: number;   // Warga perempuan
}
```

### Resident Interface
```typescript
interface Resident {
  id: string;
  nik: string;                    // NIK
  name: string;                   // Nama lengkap
  gender: 'MALE' | 'FEMALE';      // Jenis kelamin
  birthDate: string;              // Tanggal lahir
  birthPlace: string;             // Tempat lahir
  address: string;                // Alamat
  familyHeadId?: string | null;   // ID kepala keluarga
  isHeadOfFamily: boolean;        // Status kepala keluarga
  religion: string;               // Agama
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  occupation: string;             // Pekerjaan
  education: string;              // Pendidikan
  phone?: string;                 // Nomor telepon
  createdAt: string;
  updatedAt: string;
}
```

## Context Provider

### ResidentProvider
Provider untuk mengelola state data warga:

```tsx
// Di layout.tsx
<ResidentProvider>
  {children}
</ResidentProvider>
```

### Hook useResident
```tsx
const { residents, stats, loading, error } = useResident();
```

## Halaman Data Warga

Terdapat halaman khusus `/data-warga` untuk:
- ✅ Menampilkan tabel daftar warga
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Filter dan pencarian
- ✅ Statistik summary

## Menu Navigation

Menu "Data Warga" telah ditambahkan ke sidebar dengan:
- Icon: GroupIcon
- Path: `/data-warga`
- Posisi: Setelah Dashboard, sebelum Calendar

## Color Scheme

### Card Colors:
- **Total Penduduk**: Blue (`bg-blue-100 text-blue-600`)
- **Kepala Keluarga**: Green (`bg-green-100 text-green-600`)  
- **Laki-laki**: Purple (`bg-purple-100 text-purple-600`)
- **Perempuan**: Pink (`bg-pink-100 text-pink-600`)

## State Management

### Loading States:
- Skeleton loading untuk cards
- Loading indicator di header
- Disabled states untuk buttons

### Error Handling:
- Error boundary dengan fallback UI
- Toast notifications untuk CRUD operations
- Retry mechanisms

## Dummy Data

Saat ini menggunakan dummy data dengan 4 contoh penduduk:
1. Ahmad Suryadi (Kepala Keluarga, Laki-laki)
2. Siti Nurhaliza (Perempuan, Istri)
3. Budi Santoso (Kepala Keluarga, Laki-laki) 
4. Maria Gonzalez (Kepala Keluarga, Perempuan)

## Integrasi Supabase (Future)

Untuk integrasi dengan Supabase database:

### 1. Database Schema
```sql
-- Tabel residents
CREATE TABLE residents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nik VARCHAR(16) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  gender VARCHAR(6) CHECK (gender IN ('MALE', 'FEMALE')),
  birth_date DATE NOT NULL,
  birth_place VARCHAR(255),
  address TEXT,
  family_head_id UUID REFERENCES residents(id),
  is_head_of_family BOOLEAN DEFAULT false,
  religion VARCHAR(50),
  marital_status VARCHAR(10) CHECK (marital_status IN ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED')),
  occupation VARCHAR(255),
  education VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Supabase Queries
```typescript
// Fetch residents
const { data: residents, error } = await supabase
  .from('residents')
  .select('*')
  .order('name');

// Add resident  
const { data, error } = await supabase
  .from('residents')
  .insert([newResident]);

// Update resident
const { data, error } = await supabase
  .from('residents')
  .update(updates)
  .eq('id', id);
```

## Testing

### Manual Testing Checklist:
- [ ] Komponen render dengan data dummy
- [ ] Live data mode berfungsi
- [ ] Loading states tampil dengan benar
- [ ] Error handling berfungsi
- [ ] Responsive design di berbagai ukuran layar
- [ ] Color scheme konsisten dengan design system
- [ ] Navigation ke halaman Data Warga

## Deployment Notes

1. Pastikan ResidentProvider di-wrap di layout
2. Environment variables untuk Supabase sudah diset
3. Menu Data Warga muncul di sidebar
4. Komponen terintegrasi di dashboard utama

---

## Hasil Implementasi

✅ **ResidenceStatistics Component**: Menggantikan EcommerceMetrics dengan data penduduk
✅ **ResidentContext**: State management untuk data warga
✅ **Data Warga Page**: Halaman lengkap untuk CRUD operations
✅ **Dashboard Integration**: Statistik live di dashboard utama
✅ **Sidebar Menu**: Menu navigasi ke Data Warga
✅ **Responsive Design**: Layout adaptif untuk semua device
✅ **Loading & Error States**: UX yang baik dengan proper feedback

Komponen siap untuk integrasi dengan database Supabase untuk data warga yang sesungguhnya!
