import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
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

    // Get all users (without passwords)
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        canDownload: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Get all transactions
    const transactions = await db.transaction.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Create backup data
    const backupData = {
      timestamp: new Date().toISOString(),
      users,
      transactions,
      summary: {
        totalUsers: users.length,
        totalTransactions: transactions.length,
        totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0)
      }
    };

    // Convert to base64 for download
    const backupJson = JSON.stringify(backupData, null, 2);
    const backupBase64 = Buffer.from(backupJson).toString('base64');

    return NextResponse.json({
      message: 'Backup created successfully',
      backup: backupBase64,
      timestamp: backupData.timestamp
    });

  } catch (error) {
    console.error('Create backup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}