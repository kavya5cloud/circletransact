import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const category = searchParams.get('category');
    const paymentMethod = searchParams.get('paymentMethod');
    const partyName = searchParams.get('partyName');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');

    // FIXED HERE: use decoded.id (not decoded.userId)
    const whereClause: any =
      decoded.role === 'ADMIN' ? {} : { userId: decoded.id };

    if (category) whereClause.category = category;
    if (paymentMethod) whereClause.paymentMethod = paymentMethod;

    if (partyName) {
      whereClause.partyName = { contains: partyName, mode: 'insensitive' };
    }

    if (fromDate || toDate) {
      whereClause.date = {};
      if (fromDate) whereClause.date.gte = new Date(fromDate);
      if (toDate) whereClause.date.lte = new Date(toDate);
    }

    if (minAmount || maxAmount) {
      whereClause.amount = {};
      if (minAmount) whereClause.amount.gte = parseFloat(minAmount);
      if (maxAmount) whereClause.amount.lte = parseFloat(maxAmount);
    }

    const transactions = await db.transaction.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    const total = await db.transaction.count({ where: whereClause });

    return NextResponse.json({ transactions, total, limit, offset });

  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    if (decoded.role !== 'ADMIN')
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });

    const body = await request.json();
    const { date, amount, category, description, paymentMethod, partyName, invoiceImage } = body;

    if (!date || !amount || !category || !paymentMethod || !partyName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transaction = await db.transaction.create({
      data: {
        date: new Date(date),
        amount: parseFloat(amount),
        category,
        description,
        paymentMethod,
        partyName,
        invoiceImage,
        userId: decoded.id, // FIXED HERE TOO
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({
      message: 'Transaction created successfully',
      transaction
    });

  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
