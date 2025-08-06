console.log('🚀 Testing database connection...');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Simple connection test
prisma.$connect()
  .then(() => {
    console.log('✅ Connected to database successfully!');
    return prisma.$disconnect();
  })
  .then(() => {
    console.log('✅ Disconnected successfully!');
  })
  .catch((error) => {
    console.error('❌ Connection failed:', error.message);
  });
