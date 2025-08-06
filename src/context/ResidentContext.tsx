'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Interface untuk data warga
export interface Resident {
    id: string
    nik: string
    name: string
    gender: 'MALE' | 'FEMALE'
    birthDate: string
    birthPlace: string
    address: string
    familyHeadId?: string | null
    isHeadOfFamily: boolean
    religion: string
    maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED'
    occupation: string
    education: string
    phone?: string
    createdAt: string
    updatedAt: string
}

// Interface untuk statistik penduduk
export interface ResidenceStats {
    totalResidents: number
    totalFamilies: number
    maleResidents: number
    femaleResidents: number
}

// Context type
type ResidentContextType = {
    residents: Resident[]
    stats: ResidenceStats
    loading: boolean
    error: string | null
    addResident: (resident: Omit<Resident, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
    updateResident: (id: string, resident: Partial<Resident>) => Promise<void>
    deleteResident: (id: string) => Promise<void>
    refreshStats: () => void
}

const ResidentContext = createContext<ResidentContextType | undefined>(undefined)

export const useResident = () => {
    const context = useContext(ResidentContext)
    if (context === undefined) {
        throw new Error('useResident must be used within a ResidentProvider')
    }
    return context
}

export const ResidentProvider = ({ children }: { children: React.ReactNode }) => {
    const [residents, setResidents] = useState<Resident[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Calculate statistics from residents data
    const calculateStats = (residentsData: Resident[]): ResidenceStats => {
        const totalResidents = residentsData.length
        const totalFamilies = residentsData.filter(resident => resident.isHeadOfFamily).length
        const maleResidents = residentsData.filter(resident => resident.gender === 'MALE').length
        const femaleResidents = residentsData.filter(resident => resident.gender === 'FEMALE').length

        return {
            totalResidents,
            totalFamilies,
            maleResidents,
            femaleResidents
        }
    }

    const [stats, setStats] = useState<ResidenceStats>({
        totalResidents: 0,
        totalFamilies: 0,
        maleResidents: 0,
        femaleResidents: 0
    })

    // Simulate API calls - replace with actual Supabase calls later
    const loadResidents = async () => {
        try {
            setLoading(true)
            setError(null)

            // Dummy data for now - replace with Supabase query
            const dummyResidents: Resident[] = [
                {
                    id: '1',
                    nik: '3201010101010001',
                    name: 'Raga Murthada',
                    gender: 'MALE',
                    birthDate: '1985-05-15',
                    birthPlace: 'Bekasi',
                    address: 'Jl. Tambun No. 1, Blok A',
                    isHeadOfFamily: true,
                    religion: 'Islam',
                    maritalStatus: 'MARRIED',
                    occupation: 'Karyawan Swasta',
                    education: 'S1',
                    phone: '081234567890',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z'
                },
                {
                    id: '2',
                    nik: '3201010101010002',
                    name: 'Raya Murthada',
                    gender: 'FEMALE',
                    birthDate: '1988-08-20',
                    birthPlace: 'Bekasi',
                    address: 'Jl. Tambun No. 1, Blok A',
                    familyHeadId: '1',
                    isHeadOfFamily: false,
                    religion: 'Islam',
                    maritalStatus: 'MARRIED',
                    occupation: 'Ibu Rumah Tangga',
                    education: 'SMA',
                    phone: '081234567891',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z'
                },
                {
                    id: '3',
                    nik: '3201010101010003',
                    name: 'Budi Santoso',
                    gender: 'MALE',
                    birthDate: '1975-12-10',
                    birthPlace: 'Surabaya',
                    address: 'Jl. Melati No. 5, Blok B',
                    isHeadOfFamily: true,
                    religion: 'Kristen',
                    maritalStatus: 'MARRIED',
                    occupation: 'Wiraswasta',
                    education: 'SMA',
                    phone: '081234567892',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z'
                },
                {
                    id: '4',
                    nik: '3201010101010004',
                    name: 'Maria Gonzalez',
                    gender: 'FEMALE',
                    birthDate: '1990-03-25',
                    birthPlace: 'Medan',
                    address: 'Jl. Anggrek No. 3, Blok C',
                    isHeadOfFamily: true,
                    religion: 'Katolik',
                    maritalStatus: 'SINGLE',
                    occupation: 'Guru',
                    education: 'S1',
                    phone: '081234567893',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z'
                }
            ]

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            setResidents(dummyResidents)
            setStats(calculateStats(dummyResidents))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load residents')
        } finally {
            setLoading(false)
        }
    }

    const addResident = async (newResident: Omit<Resident, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            setLoading(true)
            setError(null)

            // Simulate API call
            const resident: Resident = {
                ...newResident,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            const updatedResidents = [...residents, resident]
            setResidents(updatedResidents)
            setStats(calculateStats(updatedResidents))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add resident')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const updateResident = async (id: string, updatedData: Partial<Resident>) => {
        try {
            setLoading(true)
            setError(null)

            const updatedResidents = residents.map(resident =>
                resident.id === id
                    ? { ...resident, ...updatedData, updatedAt: new Date().toISOString() }
                    : resident
            )

            setResidents(updatedResidents)
            setStats(calculateStats(updatedResidents))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update resident')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const deleteResident = async (id: string) => {
        try {
            setLoading(true)
            setError(null)

            const updatedResidents = residents.filter(resident => resident.id !== id)
            setResidents(updatedResidents)
            setStats(calculateStats(updatedResidents))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete resident')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const refreshStats = () => {
        setStats(calculateStats(residents))
    }

    useEffect(() => {
        loadResidents()
    }, [])

    const value = {
        residents,
        stats,
        loading,
        error,
        addResident,
        updateResident,
        deleteResident,
        refreshStats
    }

    return (
        <ResidentContext.Provider value={value}>
            {children}
        </ResidentContext.Provider>
    )
}
