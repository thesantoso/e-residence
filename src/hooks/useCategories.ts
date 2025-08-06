import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useCategoryStore, TransactionCategory } from '@/stores/categoryStore'

const API_BASE = '/api'

// API functions
const categoryApi = {
  getAll: async (): Promise<TransactionCategory[]> => {
    const response = await fetch(`${API_BASE}/categories`)
    if (!response.ok) throw new Error('Failed to fetch categories')
    return response.json()
  },

  create: async (data: Omit<TransactionCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<TransactionCategory> => {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create category')
    return response.json()
  },

  update: async ({ id, ...data }: Partial<TransactionCategory> & { id: string }): Promise<TransactionCategory> => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update category')
    return response.json()
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete category')
  },
}

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: string) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
}

// Hooks
export const useCategories = () => {
  const { setCategories, setLoading, setError } = useCategoryStore()

  const query = useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: categoryApi.getAll,
  })

  // Update store when data changes
  useEffect(() => {
    if (query.data) {
      setCategories(query.data)
      setError(null)
    }
    if (query.error) {
      setError(query.error.message)
    }
    setLoading(query.isLoading)
  }, [query.data, query.error, query.isLoading, setCategories, setError, setLoading])

  return query
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  const { addCategory, setError } = useCategoryStore()

  return useMutation({
    mutationFn: categoryApi.create,
    onSuccess: (newCategory) => {
      addCategory(newCategory)
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      setError(null)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  const { updateCategory, setError } = useCategoryStore()

  return useMutation({
    mutationFn: categoryApi.update,
    onSuccess: (updatedCategory) => {
      updateCategory(updatedCategory.id, updatedCategory)
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      setError(null)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  const { deleteCategory, setError } = useCategoryStore()

  return useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: (_, deletedId) => {
      deleteCategory(deletedId)
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      setError(null)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })
}
