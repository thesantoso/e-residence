import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface TransactionCategory {
  id: string
  namaKategori: string
  deskripsi?: string
  nominalDefault: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface CategoryStore {
  categories: TransactionCategory[]
  isLoading: boolean
  error: string | null
  
  // Actions
  setCategories: (categories: TransactionCategory[]) => void
  addCategory: (category: TransactionCategory) => void
  updateCategory: (id: string, category: Partial<TransactionCategory>) => void
  deleteCategory: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCategoryStore = create<CategoryStore>()(
  devtools(
    (set, get) => ({
      categories: [],
      isLoading: false,
      error: null,

      setCategories: (categories) => 
        set({ categories }, false, 'setCategories'),

      addCategory: (category) =>
        set(
          (state) => ({
            categories: [...state.categories, category]
          }),
          false,
          'addCategory'
        ),

      updateCategory: (id, updatedCategory) =>
        set(
          (state) => ({
            categories: state.categories.map(cat =>
              cat.id === id ? { ...cat, ...updatedCategory } : cat
            )
          }),
          false,
          'updateCategory'
        ),

      deleteCategory: (id) =>
        set(
          (state) => ({
            categories: state.categories.filter(cat => cat.id !== id)
          }),
          false,
          'deleteCategory'
        ),

      setLoading: (isLoading) => 
        set({ isLoading }, false, 'setLoading'),

      setError: (error) => 
        set({ error }, false, 'setError'),
    }),
    {
      name: 'category-store',
    }
  )
)
