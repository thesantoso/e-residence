import { NextResponse } from 'next/server'
import { testDatabaseConnection, setupSampleData } from '@/lib/db-test'

export async function GET() {
  try {
    // Test connection
    const connectionTest = await testDatabaseConnection()
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: connectionTest.error
      }, { status: 500 })
    }

    // Setup sample data if connection is successful
    const sampleDataResult = await setupSampleData()
    
    return NextResponse.json({
      success: true,
      message: 'Database test completed',
      connection: connectionTest,
      sampleData: sampleDataResult
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
