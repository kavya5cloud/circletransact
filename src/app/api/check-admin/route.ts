import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Check if any admin user exists
    const adminCount = await db.user.count({
      where: { role: 'ADMIN' }
    });

    return NextResponse.json({
      hasAdmin: adminCount > 0
    });

  } catch (error) {
    console.error('Check admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}