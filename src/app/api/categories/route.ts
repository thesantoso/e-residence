import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const categories = await prisma.transactionCategory.findMany({
      orderBy: [
        { isActive: 'desc' },
        { namaKategori: 'asc' }
      ]
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { namaKategori, deskripsi, nominalDefault } = body

    if (!namaKategori || !nominalDefault) {
      return NextResponse.json(
        { error: 'namaKategori and nominalDefault are required' },
        { status: 400 }
      )
    }

    const category = await prisma.transactionCategory.create({
      data: {
        namaKategori,
        deskripsi: deskripsi || null,
        nominalDefault: parseInt(nominalDefault)
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
