"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUserManagement } from "@/context/UserManagementContext";
import { useToast } from "@/context/ToastContext";
import { CloseIcon, PlusIcon, EyeIcon, EyeCloseIcon } from "@/icons";

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
    const { addUser, roles, loading } = useUserManagement();
    const { addToast } = useToast();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        roleId: "2", // Default to Warga
        isActive: true,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Handle dialog open/close
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            dialog.showModal();
            // Focus the first input when dialog opens
            const firstInput = dialog.querySelector('input[type="text"]') as HTMLInputElement;
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        } else {
            dialog.close();
        }
    }, [isOpen]);

    // Handle ESC key and backdrop click
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleClose = (e: Event) => {
            if (e.target === dialog) {
                onClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        dialog.addEventListener('close', handleClose);
        dialog.addEventListener('click', handleClose);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            dialog.removeEventListener('close', handleClose);
            dialog.removeEventListener('click', handleClose);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Nama wajib diisi";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email wajib diisi";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Format email tidak valid";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password wajib diisi";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password minimal 6 karakter";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await addUser({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                roleId: formData.roleId,
                roleName: roles.find(r => r.id === formData.roleId)?.name || "Warga",
                isActive: formData.isActive,
                emailVerified: true,
                password: formData.password, // This will be handled in the API
            } as any);

            // Reset form and close modal
            setFormData({
                name: "",
                email: "",
                password: "",
                roleId: "2",
                isActive: true,
            });
            setErrors({});
            onClose();
            addToast({
                variant: "success",
                title: "User berhasil ditambahkan!",
                message: `Akun ${formData.email} berhasil dibuat dan ditambahkan ke sistem.`,
                duration: 3500,
            });
        } catch (error) {
            console.error("Error adding user:", error);
            setErrors({
                submit: error instanceof Error ? error.message : "Gagal menambahkan user"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleButtonSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await addUser({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                roleId: formData.roleId,
                roleName: roles.find(r => r.id === formData.roleId)?.name || "Warga",
                isActive: formData.isActive,
                emailVerified: true,
                password: formData.password, // This will be handled in the API
            } as any);

            // Reset form and close modal
            setFormData({
                name: "",
                email: "",
                password: "",
                roleId: "2",
                isActive: true,
            });
            setErrors({});
            onClose();
            addToast({
                variant: "success",
                title: "User berhasil ditambahkan!",
                message: `Akun ${formData.email} berhasil dibuat dan ditambahkan ke sistem.`,
                duration: 3500,
            });
        } catch (error) {
            console.error("Error adding user:", error);
            setErrors({
                submit: error instanceof Error ? error.message : "Gagal menambahkan user"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className="backdrop:bg-black/60 backdrop:backdrop-blur-sm bg-transparent p-0 max-w-md w-full mx-auto my-auto rounded-2xl shadow-2xl border-0 focus:outline-none"
            onCancel={(e) => {
                e.preventDefault();
                onClose();
            }}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <PlusIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Tambah User Baru
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Buat akun pengguna baru sistem
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Tutup dialog"
                    >
                        <CloseIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </header>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white dark:bg-gray-800">
                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
                        </div>
                    )}

                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nama Lengkap *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                                }`}
                            placeholder="Masukkan nama lengkap"
                        />
                        {errors.name && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                                }`}
                            placeholder="user@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Masukkan password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                {showPassword ? (
                                    <EyeCloseIcon className="w-5 h-5" />
                                ) : (
                                    <EyeIcon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Role Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Role *
                        </label>
                        <select
                            value={formData.roleId}
                            onChange={(e) => handleChange("roleId", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name} - {role.description}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => handleChange("isActive", e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            User aktif
                        </label>
                    </div>
                </form>

                {/* Footer */}
                <footer className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleButtonSubmit}
                        disabled={isSubmitting || loading}
                        className="min-w-[120px] px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm hover:shadow-md"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Menyimpan...</span>
                            </div>
                        ) : (
                            "Tambah User"
                        )}
                    </button>
                </footer>
            </div>
        </dialog>
    );
};

export default AddUserModal;
