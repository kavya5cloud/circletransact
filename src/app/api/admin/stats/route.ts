import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get token from request
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get total users
    const totalUsers = await db.user.count();
    
    // Get active users
    const activeUsers = await db.user.count({
      where: { isActive: true }
    });

    // Get total transactions
    const totalTransactions = await db.transaction.count();

    // Get total amount
    const totalAmountResult = await db.transaction.aggregate({
      _sum: {
        amount: true
      }
    });
    const totalAmount = totalAmountResult._sum.amount || 0;

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalTransactions,
      totalAmount
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}