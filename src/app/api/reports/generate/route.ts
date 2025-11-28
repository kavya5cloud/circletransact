import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import jsPDF from 'jspdf';

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

    // Check if user has permission to download reports
    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || (user.role !== 'ADMIN' && !user.canDownload)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to download reports' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { fromDate, toDate, category, paymentMethod } = body;

    // Build where clause
    const whereClause: any = decoded.role === 'ADMIN' ? {} : { userId: decoded.userId };

    if (fromDate || toDate) {
      whereClause.date = {};
      if (fromDate) {
        whereClause.date.gte = new Date(fromDate);
      }
      if (toDate) {
        whereClause.date.lte = new Date(toDate);
      }
    }

    if (category) {
      whereClause.category = category;
    }

    if (paymentMethod) {
      whereClause.paymentMethod = paymentMethod;
    }

    // Get transactions
    const transactions = await db.transaction.findMany({
      where: whereClause,
      orderBy: {
        date: 'desc'
      },
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

    // Calculate statistics
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalTransactions = transactions.length;

    // Generate PDF
    const pdf = new jsPDF();
    
    // Define professional colors
    const primaryColor = [41, 98, 255]; // Blue
    const secondaryColor = [107, 114, 128]; // Gray
    const accentColor = [34, 197, 94]; // Green
    
    // Add professional header with background
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(0, 0, 210, 40);
    
    // Add Circle Office logo text
    pdf.setFontSize(24);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text('⭕ CIRCLE OFFICE', 20, 25);
    
    // Add tagline
    pdf.setFontSize(10);
    pdf.setTextColor(200, 200, 200);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Transaction Management System', 20, 32);
    
    // Add decorative line
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(20, 38, 190, 38);
    
    // Report title section
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TRANSACTION REPORT', 105, 55, { align: 'center' });
    
    // Date range section with background
    pdf.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.roundedRect(15, 65, 180, 25, 3, 3);
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    const dateRange = fromDate && toDate 
      ? `Period: ${new Date(fromDate).toLocaleDateString()} - ${new Date(toDate).toLocaleDateString()}`
      : `Period: All Transactions`;
    pdf.text(dateRange, 105, 82, { align: 'center' });
    
    // Generated timestamp
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 105, 95, { align: 'center' });
    
    // Summary section with professional styling
    pdf.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.roundedRect(15, 105, 180, 60, 3, 3);
    
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EXECUTIVE SUMMARY', 105, 120, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    // Summary metrics in two columns
    const summaryY = 135;
    pdf.text(`Total Transactions: ${totalTransactions}`, 25, summaryY);
    pdf.text(`Total Amount: $${totalAmount.toFixed(2)}`, 25, summaryY + 15);
    
    if (category) {
      pdf.text(`Category Filter: ${category}`, 105, summaryY + 30);
    }
    
    if (paymentMethod) {
      pdf.text(`Payment Method: ${paymentMethod}`, 105, summaryY + 45);
    }
    
    // Add visual separator
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setLineWidth(1);
    pdf.line(15, summaryY + 65, 195, summaryY + 65);
    
    // Professional transactions table
    pdf.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    pdf.roundedRect(15, 205, 180, 3, 3);
    
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TRANSACTION DETAILS', 105, 220, { align: 'center' });
    
    // Table headers with alternating row colors
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    
    let yPosition = 235;
    
    // Header row with background
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(15, yPosition - 5, 180, 12, 'FD');
    
    pdf.text('Date', 20, yPosition);
    pdf.text('Party Name', 60, yPosition);
    pdf.text('Category', 100, yPosition);
    pdf.text('Method', 140, yPosition);
    pdf.text('Amount', 170, yPosition);
    
    yPosition += 15;
    
    // Table rows with alternating colors
    transactions.forEach((transaction, index) => {
      if (yPosition > 260) {
        pdf.addPage();
        
        // Repeat header on new page
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.rect(15, 15, 180, 12, 'FD');
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        
        pdf.text('Date', 20, 25);
        pdf.text('Party Name', 60, 25);
        pdf.text('Category', 100, 25);
        pdf.text('Method', 140, 25);
        pdf.text('Amount', 170, 25);
        
        yPosition = 45;
      }
      
      // Alternating row colors
      if (index % 2 === 0) {
        pdf.setFillColor(245, 245, 245); // Light gray
      } else {
        pdf.setFillColor(255, 255, 255); // White
      }
      
      pdf.rect(15, yPosition - 5, 180, 12, 'FD');
      
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      
      pdf.text(new Date(transaction.date).toLocaleDateString(), 20, yPosition);
      pdf.text(transaction.partyName.substring(0, 20), 60, yPosition);
      pdf.text(transaction.category.substring(0, 15), 100, yPosition);
      pdf.text(transaction.paymentMethod, 140, yPosition);
      pdf.text(`$${transaction.amount.toFixed(2)}`, 170, yPosition);
      
      yPosition += 12;
    });
    
      // Add watermark on each page
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      
      // Add subtle watermark
      pdf.setFontSize(40);
      pdf.setTextColor(240, 240, 240); // Very light gray
      pdf.setFont('helvetica', 'bold');
      pdf.text('CIRCLE OFFICE', 105, 150, { align: 'center', angle: 45 });
      
      // Footer background
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(0, 275, 210, 25);
      
      // Footer text
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
      pdf.text('Generated by Circle Office Transaction Tracker', 105, 292, { align: 'center' });
      pdf.text(`© ${new Date().getFullYear()} Circle Office. All rights reserved.`, 105, 298, { align: 'center' });
    }
    
    // Return PDF as base64
    const pdfBase64 = pdf.output('datauristring');
    
    return NextResponse.json({
      message: 'Report generated successfully',
      pdfData: pdfBase64
    });

  } catch (error) {
    console.error('Generate report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}