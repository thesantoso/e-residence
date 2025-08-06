import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await prisma.transactionCategory.findUnique({
      where: { id }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { namaKategori, deskripsi, nominalDefault, isActive } = body

    const category = await prisma.transactionCategory.update({
      where: { id },
      data: {
        ...(namaKategori && { namaKategori }),
        ...(deskripsi !== undefined && { deskripsi }),
        ...(nominalDefault && { nominalDefault: parseInt(nominalDefault) }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if category has any transactions
    const transactionCount = await prisma.transaction.count({
      where: { kategoriId: id }
    })

    if (transactionCount > 0) {
      // Instead of deleting, mark as inactive
      await prisma.transactionCategory.update({
        where: { id },
        data: { isActive: false }
      })

      return NextResponse.json({ 
        message: 'Category has transactions. Marked as inactive instead of deleting.' 
      })
    }

    await prisma.transactionCategory.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
