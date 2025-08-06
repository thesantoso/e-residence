-- Initial setup for E-Residence database
-- Run this in Supabase SQL Editor

-- ============================================================================
-- TRANSACTION CATEGORIES (Default categories for the app)
-- ============================================================================

INSERT INTO transaction_categories (id, name, description, default_amount, is_active) VALUES
  ('cat_001', 'Iuran Rutin', 'Iuran bulanan warga perumahan', 150000, true),
  ('cat_002', 'Sampah', 'Biaya pengelolaan sampah', 50000, true),
  ('cat_003', 'Keamanan', 'Biaya jaga keamanan', 100000, true),
  ('cat_004', 'Listrik Umum', 'Biaya listrik area umum', 75000, true),
  ('cat_005', 'Kebersihan', 'Biaya kebersihan area umum', 30000, true)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SAMPLE RESIDENTS DATA
-- ============================================================================

INSERT INTO residents (id, nama_warga, nomor_rumah, blok, alamat_lengkap, phone, email, jumlah_anggota, status) VALUES
  ('res_001', 'Ahmad Santoso', 'A/1', 'A', 'Jl. Melati No. 1 Blok A', '081234567890', 'ahmad.santoso@email.com', 4, 'ACTIVE'),
  ('res_002', 'Siti Nurhaliza', 'B/2', 'B', 'Jl. Mawar No. 2 Blok B', '081234567891', 'siti.nurhaliza@email.com', 3, 'ACTIVE'),
  ('res_003', 'Rizky Pratama', 'C/5', 'C', 'Jl. Kenanga No. 5 Blok C', '081234567892', 'rizky.pratama@email.com', 2, 'ACTIVE'),
  ('res_004', 'Maya Sari', 'A/3', 'A', 'Jl. Melati No. 3 Blok A', '081234567893', 'maya.sari@email.com', 5, 'ACTIVE'),
  ('res_005', 'Budi Setiawan', 'D/1', 'D', 'Jl. Anggrek No. 1 Blok D', '081234567894', 'budi.setiawan@email.com', 3, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SAMPLE TRANSACTIONS DATA (matching your RecentTransaction component)
-- ============================================================================

INSERT INTO transactions (id, kategori_id, resident_id, periode, jumlah_nominal, metode_pembayaran, status_pembayaran, tanggal_bayar, catatan) VALUES
  ('trx_001', 'cat_001', 'res_001', 'Agustus 2025', 150000, 'TRANSFER', 'PAID', '2025-08-01', 'Pembayaran tepat waktu'),
  ('trx_002', 'cat_002', 'res_002', 'Agustus 2025', 50000, 'CASH', 'PAID', '2025-08-03', null),
  ('trx_003', 'cat_003', 'res_003', 'Agustus 2025', 100000, 'QRIS', 'PENDING', '2025-08-05', 'Menunggu konfirmasi'),
  ('trx_004', 'cat_001', 'res_004', 'Juli 2025', 150000, 'BANK', 'UNPAID', '2025-07-28', 'Terlambat 1 minggu'),
  ('trx_005', 'cat_001', 'res_005', 'Agustus 2025', 150000, 'TRANSFER', 'PAID', '2025-08-02', 'Bayar untuk 2 bulan sekaligus')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SAMPLE ANNOUNCEMENTS
-- ============================================================================

INSERT INTO announcements (id, title, content, type, is_active, published_at) VALUES
  ('ann_001', 'Pembayaran Iuran Bulan Agustus', 'Dimohon untuk segera melakukan pembayaran iuran bulan Agustus sebelum tanggal 15.', 'INFO', true, now()),
  ('ann_002', 'Perbaikan Jalan Area Blok C', 'Akan dilakukan perbaikan jalan di area Blok C pada tanggal 10-12 Agustus 2025.', 'WARNING', true, now()),
  ('ann_003', 'Rapat Bulanan RT', 'Rapat bulanan RT akan dilaksanakan pada hari Minggu, 15 Agustus 2025 pukul 19.00 WIB.', 'INFO', true, now())
ON CONFLICT (id) DO NOTHING;
