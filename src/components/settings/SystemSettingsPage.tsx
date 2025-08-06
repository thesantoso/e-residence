"use client";

import React, { useState } from "react";
import { useSystemSettings } from "@/context/SystemSettingsContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";
import Button from "@/components/ui/button/Button";

const SystemSettingsPage: React.FC = () => {
    const { settings, loading, error, updateSettings, resetToDefault } = useSystemSettings();
    const [formData, setFormData] = useState(settings);
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await updateSettings(formData);
            alert('Pengaturan berhasil disimpan!');
        } catch (error) {
            alert('Gagal menyimpan pengaturan');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        if (window.confirm('Apakah Anda yakin ingin mereset ke pengaturan default?')) {
            try {
                await resetToDefault();
                alert('Pengaturan berhasil direset!');
            } catch (error) {
                alert('Gagal mereset pengaturan');
            }
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
                        System Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Konfigurasi pengaturan umum sistem dashboard
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={handleReset}
                        className="bg-gray-500 hover:bg-gray-600"
                        disabled={saving}
                    >
                        Reset Default
                    </Button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800">
                    <p className="text-red-600 dark:text-red-400">Error: {error}</p>
                </div>
            )}

            {/* Settings Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Settings */}
                <div className="bg-white rounded-2xl border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
                        Pengaturan Umum
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Nama Dashboard</Label>
                            <input
                                type="text"
                                value={formData.dashboardName}
                                onChange={(e) => handleInputChange('dashboardName', e.target.value)}
                                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                                placeholder="Nama dashboard"
                            />
                        </div>

                        <div>
                            <Label>Bahasa</Label>
                            <select
                                value={formData.language}
                                onChange={(e) => handleInputChange('language', e.target.value)}
                                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                            >
                                <option value="id">Bahasa Indonesia</option>
                                <option value="en">English</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <Label>Alamat Project</Label>
                            <textarea
                                value={formData.projectAddress}
                                onChange={(e) => handleInputChange('projectAddress', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                                placeholder="Alamat lengkap perumahan"
                            />
                        </div>

                        <div>
                            <Label>Timezone</Label>
                            <select
                                value={formData.timezone}
                                onChange={(e) => handleInputChange('timezone', e.target.value)}
                                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                            >
                                <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                                <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                                <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                            </select>
                        </div>

                        <div>
                            <Label>Format Tanggal</Label>
                            <select
                                value={formData.dateFormat}
                                onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                            >
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Appearance Settings */}
                <div className="bg-white rounded-2xl border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
                        Pengaturan Tampilan
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Warna Primary</Label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="color"
                                    value={formData.primaryColor}
                                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                                    className="w-12 h-11 rounded-lg border border-gray-300 dark:border-gray-700"
                                />
                                <input
                                    type="text"
                                    value={formData.primaryColor}
                                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                                    className="h-11 flex-1 rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                                    placeholder="#3B82F6"
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Warna Secondary</Label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="color"
                                    value={formData.secondaryColor}
                                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                                    className="w-12 h-11 rounded-lg border border-gray-300 dark:border-gray-700"
                                />
                                <input
                                    type="text"
                                    value={formData.secondaryColor}
                                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                                    className="h-11 flex-1 rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                                    placeholder="#10B981"
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Logo URL</Label>
                            <input
                                type="text"
                                value={formData.logoImage}
                                onChange={(e) => handleInputChange('logoImage', e.target.value)}
                                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                                placeholder="/images/logo/logo.svg"
                            />
                        </div>

                        <div>
                            <Label>Favicon URL</Label>
                            <input
                                type="text"
                                value={formData.faviconImage}
                                onChange={(e) => handleInputChange('faviconImage', e.target.value)}
                                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                                placeholder="/images/favicon.ico"
                            />
                        </div>
                    </div>
                </div>

                {/* Feature Settings */}
                <div className="bg-white rounded-2xl border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
                        Pengaturan Fitur
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-800 dark:text-white/90">
                                    Izinkan Registrasi
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Memungkinkan pengguna baru untuk mendaftar
                                </p>
                            </div>
                            <Checkbox
                                checked={formData.enableRegistration}
                                onChange={(checked) => handleInputChange('enableRegistration', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-800 dark:text-white/90">
                                    Verifikasi Email
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Wajibkan verifikasi email untuk pengguna baru
                                </p>
                            </div>
                            <Checkbox
                                checked={formData.enableEmailVerification}
                                onChange={(checked) => handleInputChange('enableEmailVerification', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-800 dark:text-white/90">
                                    Mode Maintenance
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Aktifkan mode pemeliharaan sistem
                                </p>
                            </div>
                            <Checkbox
                                checked={formData.maintenanceMode}
                                onChange={(checked) => handleInputChange('maintenanceMode', checked)}
                            />
                        </div>

                        {formData.maintenanceMode && (
                            <div>
                                <Label>Pesan Maintenance</Label>
                                <textarea
                                    value={formData.maintenanceMessage}
                                    onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                                    placeholder="Pesan yang ditampilkan saat mode maintenance"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? "Menyimpan..." : "Simpan Pengaturan"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SystemSettingsPage;
