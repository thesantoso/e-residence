import { prisma } from '@/lib/prisma'

export async function testDatabaseConnection() {
  try {
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Test query
    const result = await prisma.$queryRaw`SELECT version()`
    console.log('✅ Database query successful:', result)
    
    return { success: true, message: 'Database connected successfully' }
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  } finally {
    await prisma.$disconnect()
  }
}

export async function setupSampleData() {
  try {
    // Check if we already have data
    const existingCategories = await prisma.transactionCategory.count()
    
    if (existingCategories > 0) {
      console.log('✅ Sample data already exists')
      return { success: true, message: 'Data already exists' }
    }

    // Create transaction categories
    const categories = await prisma.transactionCategory.createMany({
      data: [
        { namaKategori: 'Iuran Rutin', deskripsi: 'Iuran bulanan warga perumahan', nominalDefault: 150000 },
        { namaKategori: 'Sampah', deskripsi: 'Biaya pengelolaan sampah', nominalDefault: 50000 },
        { namaKategori: 'Keamanan', deskripsi: 'Biaya jaga keamanan', nominalDefault: 100000 },
        { namaKategori: 'Listrik Umum', deskripsi: 'Biaya listrik area umum', nominalDefault: 75000 },
        { namaKategori: 'Kebersihan', deskripsi: 'Biaya kebersihan area umum', nominalDefault: 30000 }
      ],
      skipDuplicates: true
    })

    console.log('✅ Sample categories created:', categories.count)
    return { success: true, message: `Created ${categories.count} categories` }
  } catch (error) {
    console.error('❌ Failed to setup sample data:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
