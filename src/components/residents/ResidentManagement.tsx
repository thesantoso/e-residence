"use client";

import React, { useState } from "react";
import { useResident } from "@/context/ResidentContext";
import { ResidenceStatistics } from "@/components/ecommerce/EcommerceMetrics";
import { PlusIcon, PencilIcon, TrashBinIcon, UserIcon } from "@/icons";
import Button from "@/components/ui/button/Button";

const ResidentManagement: React.FC = () => {
    const { residents, loading, error, deleteResident } = useResident();
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingResident, setEditingResident] = useState<string | null>(null);

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus data warga "${name}"?`)) {
            try {
                await deleteResident(id);
                alert('Data warga berhasil dihapus');
            } catch (error) {
                alert('Gagal menghapus data warga');
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getMaritalStatusText = (status: string) => {
        const statusMap = {
            'SINGLE': 'Belum Menikah',
            'MARRIED': 'Menikah',
            'DIVORCED': 'Cerai',
            'WIDOWED': 'Janda/Duda'
        };
        return statusMap[status as keyof typeof statusMap] || status;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                        Data Warga Perumahan
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Kelola data penduduk dan lihat statistik perumahan
                    </p>
                </div>
                <Button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2"
                >
                    <PlusIcon className="w-4 h-4" />
                    Tambah Warga
                </Button>
            </div>

            {/* Statistics Cards */}
            <ResidenceStatistics showLiveData={true} />

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800">
                    <p className="text-red-600 dark:text-red-400">Error: {error}</p>
                </div>
            )}

            {/* Residents Table */}
            <div className="bg-white rounded-2xl border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Daftar Warga ({residents.length} orang)
                    </h2>
                </div>

                {residents.length === 0 ? (
                    <div className="text-center py-12">
                        <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            Belum ada data warga. Tambahkan data warga pertama.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        NIK / Nama
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Jenis Kelamin
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Tanggal Lahir
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Alamat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {residents.map((resident) => (
                                    <tr key={resident.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white/90">
                                                    {resident.name}
                                                    {resident.isHeadOfFamily && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                            Kepala Keluarga
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    NIK: {resident.nik}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${resident.gender === 'MALE'
                                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                                    : 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400'
                                                }`}>
                                                {resident.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white/90">
                                            <div>
                                                {formatDate(resident.birthDate)}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {resident.birthPlace}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white/90">
                                            <div>{getMaritalStatusText(resident.maritalStatus)}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {resident.occupation}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {resident.address}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => setEditingResident(resident.id)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(resident.id, resident.name)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                <TrashBinIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Kepala Keluarga</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white/90 mt-1">
                        {residents.filter(r => r.isHeadOfFamily).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status Menikah</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white/90 mt-1">
                        {residents.filter(r => r.maritalStatus === 'MARRIED').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Belum Menikah</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white/90 mt-1">
                        {residents.filter(r => r.maritalStatus === 'SINGLE').length}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResidentManagement;
