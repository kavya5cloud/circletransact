import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, checkDatabaseHealth } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const success = await initializeDatabase();
    
    if (success) {
      return NextResponse.json({
        message: 'Database initialized successfully',
        status: 'success'
      });
    } else {
      return NextResponse.json({
        message: 'Database initialization failed',
        status: 'error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Database init error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const health = await checkDatabaseHealth();
    return NextResponse.json(health);
  } catch (error) {
    console.error('Database health check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}