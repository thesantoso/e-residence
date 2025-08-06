import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qoxbkgymxroxdbovkpov.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFveGJrZ3lteHJveGRib3ZrcG92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjYzNDAsImV4cCI6MjA2OTkwMjM0MH0.mjQ2xUEWqw-Es_tT24T9-WEs9Z3WlMdmMAVAt4KbnvQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSupabaseConnection() {
  try {
    console.log('🔄 Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase.from('information_schema.tables').select('*').limit(1)
    
    if (error) {
      console.log('❌ Supabase connection failed:', error.message)
      return
    }
    
    console.log('✅ Supabase connection successful!')
    
    // Try to create tables using SQL
    const { data: sqlResult, error: sqlError } = await supabase.rpc('create_tables_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS transaction_categories (
          id TEXT PRIMARY KEY,
          name TEXT UNIQUE NOT NULL,
          description TEXT,
          default_amount INTEGER,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT now(),
          updated_at TIMESTAMP DEFAULT now()
        );
      `
    })
    
    if (sqlError) {
      console.log('⚠️ SQL execution failed, but connection works:', sqlError.message)
    } else {
      console.log('✅ SQL execution successful!')
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
}

testSupabaseConnection()
