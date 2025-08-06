const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showDatabaseStats() {
  try {
    console.log('📊 DATABASE STATISTICS');
    console.log('========================');

    // Count all records
    const profileCount = await prisma.profile.count();
    const residentCount = await prisma.resident.count();
    const transactionCount = await prisma.transaction.count();
    const categoryCount = await prisma.transactionCategory.count();
    const announcementCount = await prisma.announcement.count();

    console.log(`👥 Profiles: ${profileCount}`);
    console.log(`🏠 Residents: ${residentCount}`);
    console.log(`💰 Transactions: ${transactionCount}`);
    console.log(`📋 Categories: ${categoryCount}`);
    console.log(`📢 Announcements: ${announcementCount}`);

    console.log('\n👑 ADMIN PROFILES');
    console.log('==================');
    const admins = await prisma.profile.findMany({
      where: {
        role: { in: ['SUPER_ADMIN', 'ADMIN'] }
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (admins.length === 0) {
      console.log('❌ No admin users found');
    } else {
      admins.forEach(admin => {
        console.log(`- ${admin.fullName} (${admin.email}) - ${admin.role}`);
      });
    }

    console.log('\n📋 TRANSACTION CATEGORIES');
    console.log('===========================');
    const categories = await prisma.transactionCategory.findMany({
      select: {
        namaKategori: true,
        deskripsi: true,
        isActive: true
      }
    });

    categories.forEach(cat => {
      console.log(`- ${cat.namaKategori}: ${cat.deskripsi} ${cat.isActive ? '✅' : '❌'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

showDatabaseStats();
