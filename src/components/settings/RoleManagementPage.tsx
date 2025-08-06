"use client";

import React, { useState } from "react";
import { useUserManagement } from "@/context/UserManagementContext";
import { PlusIcon, PencilIcon, TrashBinIcon, ShieldCheckIcon } from "@/icons";
import Button from "@/components/ui/button/Button";

const RoleManagementPage: React.FC = () => {
    const { roles, loading, deleteRole } = useUserManagement();
    // TODO: Implement add role form
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showAddForm, setShowAddForm] = useState(false);

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus role "${name}"?`)) {
            try {
                await deleteRole(id);
                alert('Role berhasil dihapus');
            } catch {
                alert('Gagal menghapus role');
            }
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getPermissionCount = (permissions: string[]) => {
        return permissions.length;
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

    const getAllPermissions = () => {
        const allPermissions = new Set<string>();
        roles.forEach(role => {
            role.permissions.forEach(permission => allPermissions.add(permission));
        });
        return Array.from(allPermissions);
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
            <div className="bg-white rounded-2xl border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                            Role Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Kelola role dan permissions sistem
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <Button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center gap-2"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Tambah Role
                        </Button>
                    </div>
                </div>
            </div>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Roles</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white/90 mt-1">
                        {roles.length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Roles</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white/90 mt-1">
                        {roles.filter(r => r.isActive).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Permissions</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white/90 mt-1">
                        {getAllPermissions().length}
                    </p>
                </div>
            </div>

            {/* Roles Table */}
            <div className="bg-white rounded-2xl border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Daftar Roles ({roles.length})
                    </h2>
                </div>

                {roles.length === 0 ? (
                    <div className="text-center py-12">
                        <ShieldCheckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            Belum ada data role.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Permissions
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {roles.map((role) => (
                                    <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRoleBadgeColor(role.name).replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')}`}>
                                                        <ShieldCheckIcon className="w-5 h-5" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white/90">
                                                        {role.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {role.description || 'No description'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {role.permissions.slice(0, 3).map((permission, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                                                    >
                                                        {permission}
                                                    </span>
                                                ))}
                                                {role.permissions.length > 3 && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                        +{role.permissions.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Total: {getPermissionCount(role.permissions)} permissions
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${role.isActive
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                                }`}>
                                                {role.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white/90">
                                            {formatDate(role.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => {/* TODO: Edit role */ }}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            {!['admin', 'warga'].includes(role.name.toLowerCase()) && (
                                                <button
                                                    onClick={() => handleDelete(role.id, role.name)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <TrashBinIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Permission Matrix */}
            <div className="bg-white rounded-2xl border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Permission Matrix
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Overview permissions untuk setiap role
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Permission
                                </th>
                                {roles.map((role) => (
                                    <th key={role.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        {role.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {getAllPermissions().map((permission) => (
                                <tr key={permission} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white/90">
                                        {permission}
                                    </td>
                                    {roles.map((role) => (
                                        <td key={role.id} className="px-6 py-4 text-center">
                                            {role.permissions.includes(permission) ? (
                                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                                    ✓
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-400 dark:bg-gray-900/30 dark:text-gray-500">
                                                    ✗
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RoleManagementPage;
