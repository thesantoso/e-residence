'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories'
import { useCategoryStore } from '@/stores/categoryStore'

interface CategoryFormData {
    namaKategori: string
    deskripsi: string
    nominalDefault: string
}

const initialFormData: CategoryFormData = {
    namaKategori: '',
    deskripsi: '',
    nominalDefault: '',
}

export default function CategoriesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState<CategoryFormData>(initialFormData)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const { categories, isLoading, error } = useCategoryStore()
    const { data, isLoading: queryLoading } = useCategories()
    const createCategory = useCreateCategory()
    const updateCategory = useUpdateCategory()
    const deleteCategory = useDeleteCategory()

    const filteredCategories = categories.filter(cat =>
        cat.namaKategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.namaKategori || !formData.nominalDefault) {
            return
        }

        try {
            if (editingId) {
                await updateCategory.mutateAsync({
                    id: editingId,
                    namaKategori: formData.namaKategori,
                    deskripsi: formData.deskripsi || undefined,
                    nominalDefault: parseInt(formData.nominalDefault),
                })
            } else {
                await createCategory.mutateAsync({
                    namaKategori: formData.namaKategori,
                    deskripsi: formData.deskripsi || undefined,
                    nominalDefault: parseInt(formData.nominalDefault),
                    isActive: true,
                })
            }

            setIsDialogOpen(false)
            setFormData(initialFormData)
            setEditingId(null)
        } catch (error) {
            console.error('Error saving category:', error)
        }
    }

    const handleEdit = (category: any) => {
        setFormData({
            namaKategori: category.namaKategori,
            deskripsi: category.deskripsi || '',
            nominalDefault: category.nominalDefault.toString(),
        })
        setEditingId(category.id)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            await deleteCategory.mutateAsync(id)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Kategori Iuran
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Kelola kategori iuran dan nominal default untuk setiap kategori
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => {
                                setFormData(initialFormData)
                                setEditingId(null)
                            }}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Kategori
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingId
                                    ? 'Ubah informasi kategori iuran'
                                    : 'Buat kategori iuran baru dengan nominal default'
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="namaKategori">Nama Kategori *</Label>
                                    <Input
                                        id="namaKategori"
                                        value={formData.namaKategori}
                                        onChange={(e) => setFormData(prev => ({ ...prev, namaKategori: e.target.value }))}
                                        placeholder="e.g., Iuran Bulanan"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nominalDefault">Nominal Default (Rp) *</Label>
                                    <Input
                                        id="nominalDefault"
                                        type="number"
                                        value={formData.nominalDefault}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nominalDefault: e.target.value }))}
                                        placeholder="e.g., 100000"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="deskripsi">Deskripsi</Label>
                                    <Textarea
                                        id="deskripsi"
                                        value={formData.deskripsi}
                                        onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
                                        placeholder="Deskripsi kategori iuran..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createCategory.isPending || updateCategory.isPending}>
                                    {(createCategory.isPending || updateCategory.isPending) ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Cari kategori..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border">
                <Table>
                    <TableCaption>
                        Daftar kategori iuran yang tersedia
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Kategori</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Nominal Default</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Dibuat</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading || queryLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredCategories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    {searchQuery ? 'Tidak ada kategori yang sesuai dengan pencarian' : 'Belum ada kategori yang dibuat'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCategories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">
                                        {category.namaKategori}
                                    </TableCell>
                                    <TableCell>
                                        {category.deskripsi || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {formatCurrency(category.nominalDefault)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={category.isActive ? 'default' : 'secondary'}>
                                            {category.isActive ? 'Aktif' : 'Nonaktif'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(category.createdAt).toLocaleDateString('id-ID')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(category)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(category.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    Error: {error}
                </div>
            )}
        </div>
    )
}
