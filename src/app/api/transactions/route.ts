import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const periode = searchParams.get('periode')
    const kategoriId = searchParams.get('kategoriId')
    const residentId = searchParams.get('residentId')
    const metodePembayaran = searchParams.get('metodePembayaran')
    const search = searchParams.get('search')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (periode) where.periode = periode
    if (kategoriId) where.kategoriId = kategoriId
    if (residentId) where.residentId = residentId
    if (metodePembayaran) where.metodePembayaran = metodePembayaran
    
    if (startDate && endDate) {
      where.tanggalBayar = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    if (search) {
      where.OR = [
        {
          resident: {
            namaWarga: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          resident: {
            nomorRumah: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          kategori: {
            namaKategori: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          keterangan: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Get transactions with relations (optimized select)
    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          tanggalBayar: 'desc'
        },
        select: {
          id: true,
          nomorUrut: true,
          periode: true,
          jumlahNominal: true,
          metodePembayaran: true,
          tanggalBayar: true,
          tanggalJatuhTempo: true,
          keterangan: true,
          buktiPembayaran: true,
          createdAt: true,
          updatedAt: true,
          kategori: {
            select: {
              id: true,
              namaKategori: true,
              nominalDefault: true
            }
          },
          resident: {
            select: {
              id: true,
              namaWarga: true,
              nomorRumah: true,
              blok: true
            }
          },
          profile: {
            select: {
              id: true,
              fullName: true
            }
          }
        }
      }),
      prisma.transaction.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      transactions,
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      kategoriId, 
      residentId, 
      periode, 
      jumlahNominal, 
      metodePembayaran, 
      tanggalBayar,
      tanggalJatuhTempo,
      keterangan,
      buktiPembayaran,
      profileId 
    } = body

    // Validate required fields
    if (!kategoriId || !residentId || !periode || !jumlahNominal || !metodePembayaran || !tanggalBayar || !profileId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check for duplicate transaction (same resident, category, period)
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        residentId,
        kategoriId,
        periode
      }
    })

    if (existingTransaction) {
      return NextResponse.json(
        { error: 'Transaction already exists for this resident, category, and period' },
        { status: 409 }
      )
    }

    // Get the highest number for ordering
    const lastTransaction = await prisma.transaction.findFirst({
      orderBy: {
        nomorUrut: 'desc'
      },
      select: {
        nomorUrut: true
      }
    })

    const nextNomorUrut = (lastTransaction?.nomorUrut || 0) + 1

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        nomorUrut: nextNomorUrut,
        kategoriId,
        residentId,
        periode,
        jumlahNominal: parseInt(jumlahNominal),
        metodePembayaran,
        tanggalBayar: new Date(tanggalBayar),
        tanggalJatuhTempo: tanggalJatuhTempo ? new Date(tanggalJatuhTempo) : null,
        keterangan,
        buktiPembayaran,
        profileId
      },
      include: {
        kategori: {
          select: {
            id: true,
            namaKategori: true,
            nominalDefault: true
          }
        },
        resident: {
          select: {
            id: true,
            namaWarga: true,
            nomorRumah: true,
            blok: true
          }
        },
        profile: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    })

    // Create audit history
    await prisma.transactionHistory.create({
      data: {
        transactionId: transaction.id,
        action: 'CREATE',
        newData: transaction,
        adminId: profileId
      }
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}
