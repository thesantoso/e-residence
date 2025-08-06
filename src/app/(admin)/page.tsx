import type { Metadata } from "next";
import { ResidenceStatistics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";

export const metadata: Metadata = {
  title: "Dashboard E-Residence | Sistem Manajemen Perumahan",
  description: "Dashboard utama untuk mengelola data penduduk dan statistik perumahan",
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
          Selamat Datang di Dashboard E-Residence
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Kelola data penduduk perumahan dan pantau statistik secara real-time
        </p>
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
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
