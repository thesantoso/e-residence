import type { Metadata } from "next";
import { ResidenceStatistics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentTransaction from "@/components/residents/RecentTransaction";


export const metadata: Metadata = {
  title: "Dashboard E-Residence | Sistem Manajemen Perumahan",
  description: "Dashboard utama untuk mengelola data penduduk dan statistik perumahan",
};


export default async function Dashboard() {
  // Test database connection (will show error if not connected)
  let dbStatus = { connected: false, error: null as string | null }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'http://localhost:3000' : ''}/api/test-db`, {
      cache: 'no-store'
    })
    if (response.ok) {
      dbStatus.connected = true
    }
  } catch (error) {
    dbStatus.error = 'Database not configured'
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
              Selamat Datang di Dashboard E-Residence
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola data penduduk perumahan dan pantau statistik secara real-time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${dbStatus.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-500">
              {dbStatus.connected ? 'Database Connected' : 'Database Disconnected'}
            </span>
          </div>
        </div>

        {dbStatus.error && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Database belum dikonfigurasi. Silakan update DATABASE_URL di .env.local dengan password Supabase Anda.
            </p>
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <ResidenceStatistics showLiveData={true} />

      {/* Charts and Analytics */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* <div className="col-span-12 xl:col-span-7">
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div> */}

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12">
          <RecentTransaction isDashboard={true} maxRows={5} />
        </div>
      </div>
    </div>
  );
}
