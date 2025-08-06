import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Transaction {
  id: string
  nomorUrut?: number
  kategoriId: string
  residentId: string
  periode: string // Format: MM/YYYY
  jumlahNominal: number
  metodePembayaran: 'CASH' | 'TRANSFER' | 'QRIS' | 'BANK'
  statusPembayaran: 'PAID'
  tanggalBayar: Date
  tanggalJatuhTempo?: Date
  keterangan?: string
  buktiPembayaran?: string
  profileId: string
  createdAt: Date
  updatedAt: Date
  
  // Relations
  kategori?: {
    id: string
    namaKategori: string
    nominalDefault: number
  }
  resident?: {
    id: string
    namaWarga: string
    nomorRumah: string
    blok?: string
  }
  profile?: {
    id: string
    fullName?: string
  }
}

export interface TransactionFilters {
  periode?: string
  kategoriId?: string
  residentId?: string
  metodePembayaran?: string
  search?: string
  startDate?: Date
  endDate?: Date
}

interface TransactionStore {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  filters: TransactionFilters
  currentPage: number
  totalPages: number
  totalCount: number
  
  // Actions
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  setFilters: (filters: Partial<TransactionFilters>) => void
  clearFilters: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setPagination: (page: number, totalPages: number, totalCount: number) => void
}

export const useTransactionStore = create<TransactionStore>()(
  devtools(
    (set, get) => ({
      transactions: [],
      isLoading: false,
      error: null,
      filters: {},
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,

      setTransactions: (transactions) => 
        set({ transactions }, false, 'setTransactions'),

      addTransaction: (transaction) =>
        set(
          (state) => ({
            transactions: [transaction, ...state.transactions],
            totalCount: state.totalCount + 1
          }),
          false,
          'addTransaction'
        ),

      updateTransaction: (id, updatedTransaction) =>
        set(
          (state) => ({
            transactions: state.transactions.map(trx =>
              trx.id === id ? { ...trx, ...updatedTransaction } : trx
            )
          }),
          false,
          'updateTransaction'
        ),

      deleteTransaction: (id) =>
        set(
          (state) => ({
            transactions: state.transactions.filter(trx => trx.id !== id),
            totalCount: state.totalCount - 1
          }),
          false,
          'deleteTransaction'
        ),

      setFilters: (newFilters) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...newFilters },
            currentPage: 1 // Reset to first page when filters change
          }),
          false,
          'setFilters'
        ),

      clearFilters: () =>
        set(
          { 
            filters: {},
            currentPage: 1
          },
          false,
          'clearFilters'
        ),

      setLoading: (isLoading) => 
        set({ isLoading }, false, 'setLoading'),

      setError: (error) => 
        set({ error }, false, 'setError'),

      setPagination: (currentPage, totalPages, totalCount) =>
        set({ currentPage, totalPages, totalCount }, false, 'setPagination'),
    }),
    {
      name: 'transaction-store',
    }
  )
)
