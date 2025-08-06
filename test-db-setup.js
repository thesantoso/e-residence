const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDatabase() {
  try {
    // Check if tables exist
    const result = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('profiles', 'residents', 'transactions', 'transaction_categories', 'announcements')
      ORDER BY table_name;
    `;
    
    console.log('✅ Database tables created successfully:');
    result.forEach(row => console.log('  -', row.table_name));
    
    // Test creating a transaction category
    const category = await prisma.transactionCategory.create({
      data: {
        namaKategori: 'Iuran Bulanan',
        deskripsi: 'Iuran warga setiap bulan'
      }
    });
    console.log('✅ Sample category created:', category.namaKategori);
    
    // Get all categories
    const categories = await prisma.transactionCategory.findMany();
    console.log('📋 All categories:', categories.length);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
