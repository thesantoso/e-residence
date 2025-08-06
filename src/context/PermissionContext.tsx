"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface PermissionContextType {
    userRole: string | null;
    hasPermission: (permission: string) => boolean;
    isAdmin: boolean;
    loading: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const usePermissions = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error('usePermissions must be used within a PermissionProvider');
    }
    return context;
};

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserRole = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    // First, try to get role from profile table
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('role_id')
                        .eq('id', user.id)
                        .single();

                    if (profile && !profileError) {
                        setUserRole(profile.role_id);
                    } else {
                        // Fallback to user metadata if profile fails (e.g., due to policy issues)
                        console.log('Profile access failed, using metadata fallback:', profileError);
                        const metadataRole = user.user_metadata?.role;
                        if (metadataRole === 'admin') {
                            setUserRole('1'); // Admin
                        } else {
                            setUserRole('2'); // Default to Warga
                        }
                    }
                } else {
                    setUserRole('2'); // Default to Warga for unauthenticated users
                }
            } catch (error) {
                console.error('Error getting user role:', error);
                setUserRole('2'); // Default to Warga
            } finally {
                setLoading(false);
            }
        };

        getUserRole();
    }, []);

    const hasPermission = (permission: string): boolean => {
        if (userRole === '1') return true; // Admin has all permissions

        // Define permissions for each role
        const rolePermissions: Record<string, string[]> = {
            '1': ['*'], // Admin - all permissions
            '2': ['dashboard.view', 'residents.view'], // Warga - limited permissions
        };

        const permissions = rolePermissions[userRole || '2'] || [];
        return permissions.includes('*') || permissions.includes(permission);
    };

    const isAdmin = userRole === '1';

    return (
        <PermissionContext.Provider value={{ userRole, hasPermission, isAdmin, loading }}>
            {children}
        </PermissionContext.Provider>
    );
};
