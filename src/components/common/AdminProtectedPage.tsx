"use client";

import { usePermissions } from "@/context/PermissionContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminProtectedPageProps {
    children: React.ReactNode;
}

const AdminProtectedPage: React.FC<AdminProtectedPageProps> = ({ children }) => {
    const { isAdmin, loading } = usePermissions();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push("/"); // Redirect to dashboard if not admin
        }
    }, [isAdmin, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Access Denied
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        You don&apos;t have permission to access this page. Admin access required.
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AdminProtectedPage;
