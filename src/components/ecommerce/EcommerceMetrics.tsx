"use client";
import React from "react";
import { GroupIcon, UserCircleIcon, UserIcon } from "@/icons";
import { useResident, ResidenceStats } from "@/context/ResidentContext";

interface ResidenceStatisticsProps {
  showLiveData?: boolean;
}

export const ResidenceStatistics: React.FC<ResidenceStatisticsProps> = ({
  showLiveData = false
}) => {
  const { stats, loading, error } = useResident();

  // Default dummy data untuk fallback atau demo
  const defaultStats: ResidenceStats = {
    totalResidents: 1250,
    totalFamilies: 420,
    maleResidents: 625,
    femaleResidents: 625
  };

  // Gunakan data live jika showLiveData true, atau data default
  const displayStats = showLiveData ? stats : defaultStats;

  const MetricCard = ({
    icon,
    title,
    value,
    bgColor = "bg-blue-100 dark:bg-blue-900/20",
    iconColor = "text-blue-600 dark:text-blue-400",
    isLoading = false
  }: {
    icon: React.ReactNode;
    title: string;
    value: number;
    bgColor?: string;
    iconColor?: string;
    isLoading?: boolean;
  }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-all duration-200 hover:shadow-lg">
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${bgColor} transition-colors duration-200`}>
        <div className={`size-6 ${iconColor}`}>
          {icon}
        </div>
      </div>

      <div className="mt-5">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </span>
        {isLoading ? (
          <div className="mt-2 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ) : (
          <h4 className="mt-2 font-bold text-gray-800 text-title-lg dark:text-white/90">
            {value.toLocaleString('id-ID')}
          </h4>
        )}
      </div>
    </div>
  );

  if (error && showLiveData) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20 md:p-6">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">
            Error loading data: {error}
          </p>
          <p className="text-sm text-red-500 dark:text-red-500 mt-1">
            Menampilkan data default sebagai fallback
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showLiveData && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistik Penduduk
          </h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {loading ? 'Memuat...' : 'Live Data'}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {/* Total Penduduk */}
        <MetricCard
          icon={<GroupIcon />}
          title="Total Penduduk"
          value={displayStats.totalResidents}
          bgColor="bg-blue-100 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
          isLoading={loading && showLiveData}
        />

        {/* Total Kepala Keluarga */}
        <MetricCard
          icon={<UserCircleIcon />}
          title="Total Kepala Keluarga"
          value={displayStats.totalFamilies}
          bgColor="bg-green-100 dark:bg-green-900/20"
          iconColor="text-green-600 dark:text-green-400"
          isLoading={loading && showLiveData}
        />

        {/* Warga Laki-laki */}
        <MetricCard
          icon={<UserIcon />}
          title="Warga Laki-laki"
          value={displayStats.maleResidents}
          bgColor="bg-purple-100 dark:bg-purple-900/20"
          iconColor="text-purple-600 dark:text-purple-400"
          isLoading={loading && showLiveData}
        />

        {/* Warga Perempuan */}
        <MetricCard
          icon={<UserIcon />}
          title="Warga Perempuan"
          value={displayStats.femaleResidents}
          bgColor="bg-pink-100 dark:bg-pink-900/20"
          iconColor="text-pink-600 dark:text-pink-400"
          isLoading={loading && showLiveData}
        />
      </div>
    </div>
  );
};
