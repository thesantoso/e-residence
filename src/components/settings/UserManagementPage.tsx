"use client";

import React, { useState } from "react";
import { useUserManagement } from "@/context/UserManagementContext";
import { PlusIcon, PencilIcon, TrashBinIcon, UserIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import AddUserModal from "./AddUserModal";

const UserManagementPage: React.FC = () => {
    const { users, roles, loading, error, deleteUser } = useUserManagement();
    const [showAddForm, setShowAddForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ show: boolean, user?: any }>({ show: false });

    const handleDelete = async (user: any) => {
        setShowDeleteConfirm({ show: true, user });
    };

    const confirmDelete = async () => {
        if (!showDeleteConfirm.user) return;

        try {
            await deleteUser(showDeleteConfirm.user.id);
            setShowDeleteConfirm({ show: false });
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRoleBadgeColor = (roleName: string) => {
        switch (roleName.toLowerCase()) {
            case 'admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'warga':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
                        User Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Kelola pengguna sistem dan role mereka
                    </p>
                </div>
                <Button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2"
                >
                    <PlusIcon className="w-4 h-4" />
                    Tambah User
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white/90 mt-1">
                        {users.length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Admin</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white/90 mt-1">
                        {users.filter(u => u.roleName === 'Admin').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Warga</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white/90 mt-1">
                        {users.filter(u => u.roleName === 'Warga').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white/90 mt-1">
                        {users.filter(u => u.isActive).length}
                    </p>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800">
                    <p className="text-red-600 dark:text-red-400">Error: {error}</p>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Daftar Users ({users.length})
                    </h2>
                </div>

                {users.length === 0 ? (
                    <div className="text-center py-12">
                        <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            Belum ada data user.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Last Login
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0">
                                                    {user.avatar ? (
                                                        <Image
                                                            src={user.avatar}
                                                            alt={user.name}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                            <UserIcon className="w-5 h-5 text-gray-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white/90">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.roleName)}`}>
                                                {user.roleName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.isActive
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                                    }`}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                                {user.emailVerified ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                        Email Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                        Email Unverified
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white/90">
                                            {formatDate(user.lastLogin)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => {/* TODO: Edit user */ }}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user)}
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

            {/* Add User Modal */}
            <AddUserModal
                isOpen={showAddForm}
                onClose={() => setShowAddForm(false)}

            />

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm.show && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Konfirmasi Hapus User
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Apakah Anda yakin ingin menghapus user <strong>{showDeleteConfirm.user?.name}</strong>?
                                Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex items-center justify-end gap-3">
                                <Button
                                    onClick={() => setShowDeleteConfirm({ show: false })}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg"
                                >
                                    Batal
                                </Button>
                                <Button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                >
                                    Hapus
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;
