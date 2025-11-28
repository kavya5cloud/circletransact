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

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get transactions based on user role
    const whereClause = decoded.role === 'ADMIN' ? {} : { userId: decoded.userId };

    // Today's transactions
    const todayTransactions = await db.transaction.findMany({
      where: {
        ...whereClause,
        date: {
          gte: today
        }
      }
    });

    // Week's transactions
    const weekTransactions = await db.transaction.findMany({
      where: {
        ...whereClause,
        date: {
          gte: weekAgo
        }
      }
    });

    // Month's transactions
    const monthTransactions = await db.transaction.findMany({
      where: {
        ...whereClause,
        date: {
          gte: monthAgo
        }
      }
    });

    // Calculate stats
    const totalToday = todayTransactions.length;
    const totalAmountToday = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalAmountWeek = weekTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalAmountMonth = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Get total transactions count
    const totalTransactions = await db.transaction.count({
      where: whereClause
    });

    return NextResponse.json({
      totalToday,
      totalAmountToday,
      totalAmountWeek,
      totalAmountMonth,
      totalTransactions
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}