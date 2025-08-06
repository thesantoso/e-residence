import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTransactionStore, Transaction, TransactionFilters } from '@/stores/transactionStore'

const API_BASE = '/api'

// API functions
const transactionApi = {
  getAll: async (filters: TransactionFilters = {}, page = 1, limit = 20): Promise<{
    transactions: Transaction[]
    totalCount: number
    totalPages: number
    currentPage: number
  }> => {
    const searchParams = new URLSearchParams()
    
    if (filters.periode) searchParams.set('periode', filters.periode)
    if (filters.kategoriId) searchParams.set('kategoriId', filters.kategoriId)
    if (filters.residentId) searchParams.set('residentId', filters.residentId)
    if (filters.metodePembayaran) searchParams.set('metodePembayaran', filters.metodePembayaran)
    if (filters.search) searchParams.set('search', filters.search)
    if (filters.startDate) searchParams.set('startDate', filters.startDate.toISOString())
    if (filters.endDate) searchParams.set('endDate', filters.endDate.toISOString())
    
    searchParams.set('page', page.toString())
    searchParams.set('limit', limit.toString())

    const response = await fetch(`${API_BASE}/transactions?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch transactions')
    return response.json()
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await fetch(`${API_BASE}/transactions/${id}`)
    if (!response.ok) throw new Error('Failed to fetch transaction')
    return response.json()
  },

  create: async (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
    const response = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create transaction')
    return response.json()
  },

  update: async ({ id, ...data }: Partial<Transaction> & { id: string }): Promise<Transaction> => {
    const response = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update transaction')
    return response.json()
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete transaction')
  },

  uploadProof: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE}/upload/payment-proof`, {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) throw new Error('Failed to upload file')
    return response.json()
  },

  // Server-side data fetching (for SSR)
  getServerSideData: async (filters: TransactionFilters = {}): Promise<{
    transactions: Transaction[]
    totalCount: number
  }> => {
    // This will be called from server components
    const searchParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.set(key, value.toString())
    })

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/transactions/server?${searchParams}`, {
      cache: 'no-store', // Always fresh data for admin
    })
    
    if (!response.ok) throw new Error('Failed to fetch server data')
    return response.json()
  }
}

// Query Keys
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: TransactionFilters) => [...transactionKeys.lists(), { filters }] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  infinite: (filters: TransactionFilters) => [...transactionKeys.all, 'infinite', { filters }] as const,
}

// Hooks
export const useTransactions = (filters: TransactionFilters = {}, page = 1, limit = 20) => {
  const { setTransactions, setLoading, setError, setPagination } = useTransactionStore()

  const query = useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionApi.getAll(filters, page, limit),
    staleTime: 30 * 1000, // 30 seconds for transaction data
    gcTime: 5 * 60 * 1000, // 5 minutes
  })

  useEffect(() => {
    if (query.data) {
      setTransactions(query.data.transactions)
      setPagination(query.data.currentPage, query.data.totalPages, query.data.totalCount)
      setError(null)
    }
    if (query.error) {
      setError(query.error.message)
    }
    setLoading(query.isLoading)
  }, [query.data, query.error, query.isLoading, setTransactions, setError, setLoading, setPagination])

  return query
}

// Infinite scroll for mobile/large datasets
export const useInfiniteTransactions = (filters: TransactionFilters = {}) => {
  return useInfiniteQuery({
    queryKey: transactionKeys.infinite(filters),
    queryFn: ({ pageParam }: { pageParam: number }) => transactionApi.getAll(filters, pageParam, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      return lastPage.currentPage < lastPage.totalPages 
        ? lastPage.currentPage + 1 
        : undefined
    },
    staleTime: 30 * 1000,
  })
}

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionApi.getById(id),
    enabled: !!id,
    staleTime: 60 * 1000, // Individual transactions are more stable
  })
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  const { addTransaction, setError } = useTransactionStore()

  return useMutation({
    mutationFn: transactionApi.create,
    onSuccess: (newTransaction) => {
      addTransaction(newTransaction)
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      setError(null)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })
}

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()
  const { updateTransaction, setError } = useTransactionStore()

  return useMutation({
    mutationFn: transactionApi.update,
    onSuccess: (updatedTransaction) => {
      updateTransaction(updatedTransaction.id, updatedTransaction)
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(updatedTransaction.id) })
      setError(null)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })
}

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()
  const { deleteTransaction, setError } = useTransactionStore()

  return useMutation({
    mutationFn: transactionApi.delete,
    onSuccess: (_, deletedId) => {
      deleteTransaction(deletedId)
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      setError(null)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })
}

export const useUploadPaymentProof = () => {
  return useMutation({
    mutationFn: transactionApi.uploadProof,
    onError: (error: Error) => {
      console.error('Upload error:', error.message)
    },
  })
}
