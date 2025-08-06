import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Resident {
  id: string
  namaWarga: string
  nik?: string
  nomorRumah: string
  blok?: string
  alamatLengkap?: string
  noTelp?: string
  email?: string
  status: 'ACTIVE' | 'INACTIVE' | 'MOVED_OUT'
  profileId?: string
}

export interface IuranSummary {
  residentId: string
  namaWarga: string
  nomorRumah: string
  blok?: string
  totalPaid: number
  totalUnpaid: number
  lastPaymentDate?: Date
  unpaidCategories: Array<{
    kategoriId: string
    namaKategori: string
    nominal: number
    periode: string
  }>
}

interface ResidentStore {
  residents: Resident[]
  iuranSummaries: IuranSummary[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  
  // Actions
  setResidents: (residents: Resident[]) => void
  setIuranSummaries: (summaries: IuranSummary[]) => void
  setSearchQuery: (query: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed
  getFilteredResidents: () => Resident[]
  getResidentById: (id: string) => Resident | undefined
}

export const useResidentStore = create<ResidentStore>()(
  devtools(
    (set, get) => ({
      residents: [],
      iuranSummaries: [],
      isLoading: false,
      error: null,
      searchQuery: '',

      setResidents: (residents) => 
        set({ residents }, false, 'setResidents'),

      setIuranSummaries: (iuranSummaries) =>
        set({ iuranSummaries }, false, 'setIuranSummaries'),

      setSearchQuery: (searchQuery) => 
        set({ searchQuery }, false, 'setSearchQuery'),

      setLoading: (isLoading) => 
        set({ isLoading }, false, 'setLoading'),

      setError: (error) => 
        set({ error }, false, 'setError'),

      getFilteredResidents: () => {
        const { residents, searchQuery } = get()
        if (!searchQuery.trim()) return residents

        const query = searchQuery.toLowerCase().trim()
        return residents.filter(resident =>
          resident.namaWarga.toLowerCase().includes(query) ||
          resident.nomorRumah.toLowerCase().includes(query) ||
          resident.blok?.toLowerCase().includes(query) ||
          resident.email?.toLowerCase().includes(query) ||
          resident.nik?.includes(query)
        )
      },

      getResidentById: (id) => {
        const { residents } = get()
        return residents.find(resident => resident.id === id)
      },
    }),
    {
      name: 'resident-store',
    }
  )
)
