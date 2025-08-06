import { Prisma } from '@prisma/client'

// ============================================================================
// TRANSACTION TYPES (matching your existing interface)
// ============================================================================

export interface TransactionIuran {
  no?: number
  namaWarga: string
  nomorRumah: string
  alamatLengkap?: string
  kategoriPembayaran: string
  periode: string
  jumlahNominal: number
  metodePembayaran: 'Cash' | 'Transfer' | 'QRIS' | 'Bank'
  statusPembayaran: 'Paid' | 'Unpaid' | 'Pending'
  tanggalBayar: Date | string
  catatan?: string
  dibuatOleh: string
}

// ============================================================================
// PRISMA TYPES
// ============================================================================

export type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: {
    resident: true
    kategori: true
    profile: true
  }
}>

export type ResidentWithProfile = Prisma.ResidentGetPayload<{
  include: {
    profile: true
    transactions: {
      include: {
        kategori: true
      }
    }
  }
}>

// ============================================================================
// DASHBOARD STATISTICS TYPES
// ============================================================================

export interface DashboardStats {
  totalWarga: number
  wargaMenunggak: number
  pemasukanBulanIni: number
  iuranBelumTerbayar: number
  ringkasanIuranWarga: {
    namaWarga: string
    nomorRumah: string
    totalTunggakan: number
    bulanTerakhirBayar: string
  }[]
  pengumumanAktif: {
    id: string
    title: string
    type: string
    publishedAt: Date
  }[]
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================================================
// FORM VALIDATION TYPES
// ============================================================================

export interface CreateResidentData {
  namaWarga: string
  nik?: string
  nomorRumah: string
  blok?: string
  alamatLengkap?: string
  phone?: string
  email?: string
  jumlahAnggota?: number
  fotoKK?: string
  fotoKTP?: string
}

export interface CreateTransactionData {
  residentId: string
  kategoriId: string
  periode: string
  jumlahNominal: number
  metodePembayaran: 'CASH' | 'TRANSFER' | 'QRIS' | 'BANK'
  tanggalJatuhTempo?: Date
  keterangan?: string
  buktiPembayaran?: string
  profileId: string
}

// ============================================================================
// FILTER & SEARCH TYPES
// ============================================================================

export interface TransactionFilters {
  residentId?: string
  kategoriId?: string
  periode?: string
  status?: 'PAID' | 'UNPAID' | 'PENDING' | 'OVERDUE'
  metodePembayaran?: 'CASH' | 'TRANSFER' | 'QRIS' | 'BANK'
  startDate?: Date
  endDate?: Date
}

export interface ResidentFilters {
  blok?: string
  status?: 'ACTIVE' | 'INACTIVE' | 'MOVED_OUT'
  search?: string // search by name, phone, email
}
