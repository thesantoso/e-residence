import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get total revenue for this month
    const thisMonthRevenue = await prisma.transaction.aggregate({
      where: {
        statusPembayaran: 'PAID',
        createdAt: {
          gte: firstDayThisMonth,
        },
      },
      _sum: {
        jumlahNominal: true,
      },
    });

    // Get last month revenue for comparison
    const lastMonthRevenue = await prisma.transaction.aggregate({
      where: {
        statusPembayaran: 'PAID',
        createdAt: {
          gte: firstDayLastMonth,
          lte: lastDayLastMonth,
        },
      },
      _sum: {
        jumlahNominal: true,
      },
    });

    // Calculate revenue growth
    const thisMonth = thisMonthRevenue._sum.jumlahNominal || 0;
    const lastMonth = lastMonthRevenue._sum.jumlahNominal || 0;
    const revenueGrowth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

    // Get pending transactions
    const pendingTransactions = await prisma.transaction.aggregate({
      where: {
        statusPembayaran: 'PENDING',
      },
      _sum: {
        jumlahNominal: true,
      },
      _count: true,
    });

    // Get transaction counts by status
    const transactionCounts = await prisma.transaction.groupBy({
      by: ['statusPembayaran'],
      _count: {
        id: true,
      },
    });

    const completedCount = transactionCounts.find(t => t.statusPembayaran === 'PAID')?._count.id || 0;
    const failedCount = (
      transactionCounts.find(t => t.statusPembayaran === 'UNPAID')?._count.id || 0
    ) + (
      transactionCounts.find(t => t.statusPembayaran === 'OVERDUE')?._count.id || 0
    );

    // Get monthly stats for the last 6 months
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthData = await prisma.transaction.aggregate({
        where: {
          statusPembayaran: 'PAID',
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: {
          jumlahNominal: true,
        },
        _count: {
          id: true,
        },
      });

      monthlyStats.push({
        month: monthStart.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        revenue: monthData._sum.jumlahNominal || 0,
        transactions: monthData._count.id || 0,
      });
    }

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        nomorUrut: true,
        jumlahNominal: true,
        statusPembayaran: true,
        createdAt: true,
        resident: {
          select: {
            namaWarga: true,
          },
        },
      },
    });

    const stats = {
      totalRevenue: thisMonth,
      revenueGrowth,
      pendingAmount: pendingTransactions._sum.jumlahNominal || 0,
      pendingCount: pendingTransactions._count || 0,
      completedCount,
      failedCount,
      monthlyStats,
      recentTransactions: recentTransactions.map(t => ({
        id: t.id,
        transactionNumber: t.nomorUrut?.toString() || t.id.slice(-6),
        amount: t.jumlahNominal,
        status: t.statusPembayaran,
        createdAt: t.createdAt.toISOString(),
        profile: {
          name: t.resident.namaWarga,
        },
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction statistics' },
      { status: 500 }
    );
  }
}
