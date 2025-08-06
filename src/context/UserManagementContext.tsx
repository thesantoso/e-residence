'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

// Interface untuk role
export interface Role {
    id: string
    name: string
    description: string
    permissions: string[]
    isActive: boolean
    isSystemRole: boolean
    createdAt: string
    updatedAt: string
}

// Interface untuk user - disesuaikan dengan Supabase auth
export interface SystemUser {
    id: string
    email: string
    name: string
    avatar?: string
    roleId: string
    roleName: string
    isActive: boolean
    lastLogin?: string
    emailVerified: boolean
    createdAt: string
    updatedAt: string
}

// Available permissions
export const AVAILABLE_PERMISSIONS = [
    'dashboard.view',
    'residents.view',
    'residents.create',
    'residents.edit',
    'residents.delete',
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'roles.view',
    'roles.create',
    'roles.edit',
    'roles.delete',
    'settings.view',
    'settings.edit',
    'reports.view',
    'reports.export'
] as const

export type Permission = typeof AVAILABLE_PERMISSIONS[number]

// Context type
type UserManagementContextType = {
    users: SystemUser[]
    roles: Role[]
    loading: boolean
    error: string | null
    addUser: (user: Omit<SystemUser, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
    updateUser: (id: string, user: Partial<SystemUser>) => Promise<void>
    deleteUser: (id: string) => Promise<void>
    addRole: (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
    updateRole: (id: string, role: Partial<Role>) => Promise<void>
    deleteRole: (id: string) => Promise<void>
    checkPermission: (permission: Permission) => boolean
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined)

export const useUserManagement = () => {
    const context = useContext(UserManagementContext)
    if (context === undefined) {
        throw new Error('useUserManagement must be used within a UserManagementProvider')
    }
    return context
}

export const UserManagementProvider = ({ children }: { children: React.ReactNode }) => {
    const [users, setUsers] = useState<SystemUser[]>([])
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Default roles
    const defaultRoles: Role[] = [
        {
            id: '1',
            name: 'Admin',
            description: 'Administrator dengan akses penuh ke semua fitur',
            permissions: [...AVAILABLE_PERMISSIONS],
            isActive: true,
            isSystemRole: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
        },
        {
            id: '2',
            name: 'Warga',
            description: 'Warga perumahan dengan akses terbatas',
            permissions: ['dashboard.view', 'residents.view'],
            isActive: true,
            isSystemRole: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
        }
    ]

    // Load data
    const loadData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Use API route instead of direct admin calls
            const response = await fetch('/api/admin/users')

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to load users')
            }

            const { users: authUsers, profiles, roles: rolesData } = await response.json()

            // Set roles
            if (rolesData && rolesData.length > 0) {
                const transformedRoles: Role[] = rolesData.map((role: any) => ({
                    id: role.id,
                    name: role.name,
                    description: role.description || '',
                    permissions: Array.isArray(role.permissions) ? role.permissions : [],
                    isActive: role.is_active,
                    isSystemRole: role.is_system_role,
                    createdAt: role.created_at,
                    updatedAt: role.updated_at
                }))
                setRoles(transformedRoles)
            } else {
                setRoles(defaultRoles)
            }

            // Transform auth users ke format SystemUser
            const transformedUsers: SystemUser[] = authUsers.map((authUser: any) => {
                const profile = profiles?.find((p: any) => p.id === authUser.id)
                const roleId = profile?.role_id || '2'
                const role = (rolesData || defaultRoles).find((r: any) => r.id === roleId)

                return {
                    id: authUser.id,
                    email: authUser.email || '',
                    name: profile?.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Unknown User',
                    avatar: profile?.avatar || authUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User')}&background=3B82F6&color=fff`,
                    roleId: roleId,
                    roleName: role?.name || 'Warga',
                    isActive: profile?.is_active !== false && !(authUser as any).banned_until,
                    lastLogin: authUser.last_sign_in_at || undefined,
                    emailVerified: !!authUser.email_confirmed_at,
                    createdAt: authUser.created_at,
                    updatedAt: authUser.updated_at || authUser.created_at
                }
            })

            setUsers(transformedUsers)
        } catch (err) {
            console.error('Error loading data:', err)
            setError(err instanceof Error ? err.message : 'Failed to load data')
            // Fallback ke dummy data jika benar-benar gagal
            setRoles(defaultRoles)
            setUsers([]) // Don't show dummy users if API fails
        } finally {
            setLoading(false)
        }
    }

    const addUser = async (newUser: Omit<SystemUser, 'id' | 'createdAt' | 'updatedAt'> & { password?: string }) => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'create',
                    userData: newUser
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to create user')
            }

            // Reload data to get fresh user list
            await loadData()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add user')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const updateUser = async (id: string, updatedData: Partial<SystemUser>) => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: id,
                    userData: updatedData
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to update user')
            }

            // Reload data to reflect changes
            await loadData()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update user')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const deleteUser = async (id: string) => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`/api/admin/users?userId=${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to delete user')
            }

            // Reload data to reflect changes
            await loadData()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete user')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const addRole = async (newRole: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            setLoading(true)
            setError(null)

            const role: Role = {
                ...newRole,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            setRoles(prev => [...prev, role])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add role')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const updateRole = async (id: string, updatedData: Partial<Role>) => {
        try {
            setLoading(true)
            setError(null)

            setRoles(prev => prev.map(role =>
                role.id === id
                    ? { ...role, ...updatedData, updatedAt: new Date().toISOString() }
                    : role
            ))

            // Update roleName in users if role name changed
            if (updatedData.name) {
                setUsers(prev => prev.map(user =>
                    user.roleId === id
                        ? { ...user, roleName: updatedData.name! }
                        : user
                ))
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update role')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const deleteRole = async (id: string) => {
        try {
            setLoading(true)
            setError(null)

            // Check if role is being used by users
            const usersWithRole = users.filter(user => user.roleId === id)
            if (usersWithRole.length > 0) {
                throw new Error(`Cannot delete role. ${usersWithRole.length} users are still assigned to this role.`)
            }

            setRoles(prev => prev.filter(role => role.id !== id))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete role')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const checkPermission = (permission: Permission): boolean => {
        // TODO: Get current user role and check permissions
        // For now, return true for demo
        return true
    }

    useEffect(() => {
        loadData()
    }, [])

    const value = {
        users,
        roles,
        loading,
        error,
        addUser,
        updateUser,
        deleteUser,
        addRole,
        updateRole,
        deleteRole,
        checkPermission
    }

    return (
        <UserManagementContext.Provider value={value}>
            {children}
        </UserManagementContext.Provider>
    )
}
