"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface ToastMessage {
    id: string;
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    duration?: number; // Auto-close duration in milliseconds
}

interface ToastContextType {
    toasts: ToastMessage[];
    addToast: (toast: Omit<ToastMessage, "id">) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((toast: Omit<ToastMessage, "id">) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const duration = toast.duration || 5000; // Default 5 seconds

        setToasts(prev => [...prev, { ...toast, id }]);

        // Auto-remove after duration
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};
