'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Interface untuk system settings
export interface SystemSettings {
    id: string
    dashboardName: string
    projectAddress: string
    logoImage: string
    faviconImage: string
    primaryColor: string
    secondaryColor: string
    timezone: string
    dateFormat: string
    language: string
    enableRegistration: boolean
    enableEmailVerification: boolean
    maintenanceMode: boolean
    maintenanceMessage: string
    createdAt: string
    updatedAt: string
}

// Context type
type SystemSettingsContextType = {
    settings: SystemSettings
    loading: boolean
    error: string | null
    updateSettings: (settings: Partial<SystemSettings>) => Promise<void>
    resetToDefault: () => Promise<void>
}

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined)

export const useSystemSettings = () => {
    const context = useContext(SystemSettingsContext)
    if (context === undefined) {
        throw new Error('useSystemSettings must be used within a SystemSettingsProvider')
    }
    return context
}

export const SystemSettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Default settings
    const defaultSettings: SystemSettings = {
        id: '1',
        dashboardName: 'E-Residence Dashboard',
        projectAddress: 'Perumahan Griya Asri, Jl. Mawar Indah No. 123, Jakarta Selatan',
        logoImage: '/images/logo/logo.svg',
        faviconImage: '/images/favicon.ico',
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        timezone: 'Asia/Jakarta',
        dateFormat: 'DD/MM/YYYY',
        language: 'id',
        enableRegistration: true,
        enableEmailVerification: true,
        maintenanceMode: false,
        maintenanceMessage: 'Sistem sedang dalam pemeliharaan. Silakan coba lagi nanti.',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }

    const [settings, setSettings] = useState<SystemSettings>(defaultSettings)

    // Load settings from localStorage or API
    const loadSettings = async () => {
        try {
            setLoading(true)
            setError(null)

            // Try to load from localStorage first
            const storedSettings = localStorage.getItem('systemSettings')
            if (storedSettings) {
                const parsedSettings = JSON.parse(storedSettings)
                setSettings({ ...defaultSettings, ...parsedSettings })
            } else {
                setSettings(defaultSettings)
            }

            // TODO: Replace with actual Supabase call
            // const { data, error } = await supabase
            //   .from('system_settings')
            //   .select('*')
            //   .single()

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load settings')
            setSettings(defaultSettings) // Fallback to default
        } finally {
            setLoading(false)
        }
    }

    const updateSettings = async (updatedData: Partial<SystemSettings>) => {
        try {
            setLoading(true)
            setError(null)

            const newSettings = {
                ...settings,
                ...updatedData,
                updatedAt: new Date().toISOString()
            }

            // Save to localStorage
            localStorage.setItem('systemSettings', JSON.stringify(newSettings))
            setSettings(newSettings)

            // TODO: Replace with actual Supabase call
            // const { error } = await supabase
            //   .from('system_settings')
            //   .update(updatedData)
            //   .eq('id', settings.id)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update settings')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const resetToDefault = async () => {
        try {
            setLoading(true)
            setError(null)

            localStorage.removeItem('systemSettings')
            setSettings(defaultSettings)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reset settings')
            throw err
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSettings()
    }, [])

    const value = {
        settings,
        loading,
        error,
        updateSettings,
        resetToDefault
    }

    return (
        <SystemSettingsContext.Provider value={value}>
            {children}
        </SystemSettingsContext.Provider>
    )
}
