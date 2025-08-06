const { Client } = require('pg');

async function testConnection() {
  // Test direct connection
  const directClient = new Client({
    connectionString: "postgresql://postgres:Pendaftaran1122@db.qoxbkgymxroxdbovkpov.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
  });

  // Test pooler connection  
  const poolerClient = new Client({
    connectionString: "postgresql://postgres.qoxbkgymxroxdbovkpov:Pendaftaran1122@aws-0-us-east-2.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔄 Testing direct connection...');
    await directClient.connect();
    const directResult = await directClient.query('SELECT version()');
    console.log('✅ Direct connection successful:', directResult.rows[0].version.slice(0, 50) + '...');
    await directClient.end();
  } catch (error) {
    console.log('❌ Direct connection failed:', error.message);
  }

  try {
    console.log('🔄 Testing pooler connection...');
    await poolerClient.connect();
    const poolerResult = await poolerClient.query('SELECT version()');
    console.log('✅ Pooler connection successful:', poolerResult.rows[0].version.slice(0, 50) + '...');
    await poolerClient.end();
  } catch (error) {
    console.log('❌ Pooler connection failed:', error.message);
  }
}

testConnection().catch(console.error);
