import { prisma } from './prisma'
import { TransactionFilters, TransactionWithRelations, CreateTransactionData, DashboardStats } from './types'

// ============================================================================
// TRANSACTION CRUD OPERATIONS
// ============================================================================

export async function getTransactions(filters?: TransactionFilters) {
  const where: any = {}
  
  if (filters?.residentId) where.residentId = filters.residentId
  if (filters?.kategoriId) where.kategoriId = filters.kategoriId
  if (filters?.periode) where.periode = filters.periode
  if (filters?.status) where.statusPembayaran = filters.status
  if (filters?.metodePembayaran) where.metodePembayaran = filters.metodePembayaran
  
  if (filters?.startDate || filters?.endDate) {
    where.tanggalBayar = {}
    if (filters.startDate) where.tanggalBayar.gte = filters.startDate
    if (filters.endDate) where.tanggalBayar.lte = filters.endDate
  }

  return await prisma.transaction.findMany({
    where,
    include: {
      resident: true,
      kategori: true,
      profile: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function getRecentTransactions(limit: number = 5): Promise<TransactionWithRelations[]> {
  return await prisma.transaction.findMany({
    take: limit,
    include: {
      resident: true,
      kategori: true,
      profile: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function createTransaction(data: CreateTransactionData) {
  return await prisma.transaction.create({
    data: {
      ...data,
      statusPembayaran: 'UNPAID',
      tanggalBayar: new Date(),
      profileId: data.profileId // Ensure profileId is included
    },
    include: {
      resident: true,
      kategori: true,
      profile: true
    }
  })
}

export async function updateTransactionStatus(
  transactionId: string, 
  status: 'PAID' | 'UNPAID' | 'PENDING' | 'OVERDUE',
  buktiPembayaran?: string
) {
  const updateData: any = { 
    statusPembayaran: status,
    buktiPembayaran
  }
  
  if (status === 'PAID') {
    updateData.tanggalBayar = new Date()
  }

  return await prisma.transaction.update({
    where: { id: transactionId },
    data: updateData,
    include: {
      resident: true,
      kategori: true,
      profile: true
    }
  })
}

// ============================================================================
// RESIDENT OPERATIONS
// ============================================================================

export async function getResidents() {
  return await prisma.resident.findMany({
    include: {
      profile: true,
      transactions: {
        include: {
          kategori: true
        }
      }
    },
    orderBy: {
      namaWarga: 'asc'
    }
  })
}

export async function getResidentById(id: string) {
  return await prisma.resident.findUnique({
    where: { id },
    include: {
      profile: true,
      transactions: {
        include: {
          kategori: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })
}

// ============================================================================
// TRANSACTION CATEGORIES
// ============================================================================

export async function getTransactionCategories() {
  return await prisma.transactionCategory.findMany({
    where: { isActive: true },
    orderBy: { namaKategori: 'asc' }
  })
}

// ============================================================================
// DASHBOARD STATISTICS
// ============================================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalWarga,
    wargaMenunggak,
    pemasukanBulanIni,
    iuranBelumTerbayar,
    pengumumanAktif
  ] = await Promise.all([
    // Total warga aktif
    prisma.resident.count({
      where: { status: 'ACTIVE' }
    }),
    
    // Warga yang memiliki tunggakan
    prisma.resident.count({
      where: {
        status: 'ACTIVE',
        transactions: {
          some: {
            statusPembayaran: 'UNPAID'
          }
        }
      }
    }),
    
    // Total pemasukan bulan ini
    prisma.transaction.aggregate({
      where: {
        statusPembayaran: 'PAID',
        tanggalBayar: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        }
      },
      _sum: {
        jumlahNominal: true
      }
    }),
    
    // Total iuran yang belum terbayar
    prisma.transaction.aggregate({
      where: {
        statusPembayaran: 'UNPAID'
      },
      _sum: {
        jumlahNominal: true
      }
    }),
    
    // Pengumuman aktif
    prisma.announcement.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ])

  // Ringkasan iuran per warga
  const ringkasanIuranWarga = await prisma.resident.findMany({
    where: {
      status: 'ACTIVE',
      transactions: {
        some: {
          statusPembayaran: 'UNPAID'
        }
      }
    },
    include: {
      transactions: {
        where: { statusPembayaran: 'UNPAID' },
        include: { kategori: true }
      }
    },
    take: 10
  })

  return {
    totalWarga,
    wargaMenunggak,
    pemasukanBulanIni: pemasukanBulanIni._sum.jumlahNominal || 0,
    iuranBelumTerbayar: iuranBelumTerbayar._sum.jumlahNominal || 0,
    ringkasanIuranWarga: ringkasanIuranWarga.map(resident => ({
      namaWarga: resident.namaWarga,
      nomorRumah: resident.nomorRumah,
      totalTunggakan: resident.transactions.reduce((sum, trx) => sum + trx.jumlahNominal, 0),
      bulanTerakhirBayar: resident.transactions[0]?.periode || 'Belum ada pembayaran'
    })),
    pengumumanAktif: pengumumanAktif.map(ann => ({
      id: ann.id,
      title: ann.title,
      type: ann.type,
      publishedAt: ann.createdAt
    }))
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function convertPrismaToTransactionIuran(transaction: TransactionWithRelations) {
  return {
    no: parseInt(transaction.id.slice(-3)), // Extract number from ID
    namaWarga: transaction.resident.namaWarga,
    nomorRumah: transaction.resident.nomorRumah,
    alamatLengkap: transaction.resident.alamatLengkap,
    kategoriPembayaran: transaction.kategori.namaKategori,
    periode: transaction.periode,
    jumlahNominal: transaction.jumlahNominal,
    metodePembayaran: transaction.metodePembayaran as 'Cash' | 'Transfer' | 'QRIS' | 'Bank',
    statusPembayaran: transaction.statusPembayaran as 'Paid' | 'Unpaid' | 'Pending',
    tanggalBayar: transaction.tanggalBayar || transaction.createdAt,
    catatan: transaction.keterangan,
    dibuatOleh: transaction.profile?.fullName || 'System'
  }
}
