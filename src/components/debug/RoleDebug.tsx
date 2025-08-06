"use client";

import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/context/PermissionContext';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

interface ProfileData {
    id: string;
    name: string;
    role_id: string;
    is_active: boolean;
}

const RoleDebug = () => {
    const { user } = useAuth();
    const { userRole, isAdmin, loading } = usePermissions();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [profileError, setProfileError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;

            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, name, role_id, is_active')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    setProfileError(error.message);
                } else {
                    setProfileData(data);
                    setProfileError(null);
                }
            } catch (err) {
                setProfileError(err instanceof Error ? err.message : 'Unknown error');
            }
        };

        fetchProfile();
    }, [user]);

    if (!user) {
        return (
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <h3 className="font-bold text-red-800">No User Logged In</h3>
            </div>
        );
    }

    return (
        <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg space-y-3">
            <h3 className="font-bold text-blue-800">Role Debug Information</h3>

            <div className="space-y-2 text-sm">
                <div><strong>User ID:</strong> {user.id}</div>
                <div><strong>User Email:</strong> {user.email}</div>
                <div><strong>Permission Loading:</strong> {loading ? 'Yes' : 'No'}</div>
                <div><strong>User Role ID:</strong> {userRole || 'None'}</div>
                <div><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</div>

                {profileError && (
                    <div className="text-red-600">
                        <strong>Profile Error:</strong> {profileError}
                    </div>
                )}

                {profileData ? (
                    <div className="border-t pt-2 mt-2">
                        <strong>Profile Data:</strong>
                        <pre className="text-xs bg-white p-2 rounded mt-1">
                            {JSON.stringify(profileData, null, 2)}
                        </pre>
                    </div>
                ) : profileError ? (
                    <div className="text-red-600">
                        <strong>Profile:</strong> Failed to load due to error above
                    </div>
                ) : (
                    <div className="text-orange-600">
                        <strong>Profile:</strong> Loading...
                    </div>
                )}

                <div className="border-t pt-2 mt-2">
                    <strong>Raw User Metadata:</strong>
                    <pre className="text-xs bg-white p-2 rounded mt-1">
                        {JSON.stringify(user.user_metadata, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default RoleDebug;
