'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  paymentMethod: string;
  partyName: string;
  invoiceImage?: string;
  requiresAuth?: boolean;
  authorizedBy?: string;
  authorizedAt?: string;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  hasTransactions: boolean;
  transactionCount: number;
  totalAmount: number;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Mock data - in real app, this would come from API
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2024-01-15',
      amount: 2500,
      category: 'Software',
      description: 'Office software license',
      paymentMethod: 'ONLINE',
      partyName: 'Tech Corp',
      requiresAuth: true,
      authorizedBy: 'Admin User',
      authorizedAt: '2024-01-14'
    },
    {
      id: '2',
      date: '2024-01-20',
      amount: 150,
      category: 'Office Supplies',
      description: 'Stationery and supplies',
      paymentMethod: 'CASH',
      partyName: 'Office Depot',
      requiresAuth: false
    },
    {
      id: '3',
      date: '2024-01-25',
      amount: 500,
      category: 'Client Meeting',
      description: 'Project kickoff meeting',
      paymentMethod: 'ONLINE',
      partyName: 'Client ABC',
      requiresAuth: false
    }
  ]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: CalendarDay[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ date: 0, isCurrentMonth: false, hasTransactions: false, transactionCount: 0, totalAmount: 0 });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = i;
      const dateObj = new Date(year, month, date);
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getFullYear() === year && 
               tDate.getMonth() === month && 
               tDate.getDate() === date;
      });
      
      days.push({
        date,
        isCurrentMonth: true,
        hasTransactions: dayTransactions.length > 0,
        transactionCount: dayTransactions.length,
        totalAmount: dayTransactions.reduce((sum, t) => sum + t.amount, 0)
      });
    }
    
    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
    setSelectedDate(clickedDate);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Circle Office Calendar</h1>
          <div className="flex items-center gap-4">
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {monthYear}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                  Next
                </Button>
              </div>
            </div>
            <CardDescription>
              Click on any date to view transaction details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={day} className="text-center">
                  <div className="text-sm font-medium mb-2">{day}</div>
                  {getDaysInMonth(currentDate).map((dayInfo, dayIndex) => {
                    if (dayIndex < index || (dayIndex - index) % 7 === 0) {
                      return <div key={dayIndex} className="h-20"></div>;
                    }
                    
                    const isSelected = selectedDate && 
                      selectedDate.getDate() === dayInfo.date &&
                      selectedDate.getMonth() === currentDate.getMonth() &&
                      selectedDate.getFullYear() === currentDate.getFullYear();
                    
                    return (
                      <div
                        key={dayIndex}
                        className={`
                          relative h-20 p-2 border rounded-lg cursor-pointer transition-colors
                          ${dayInfo.isCurrentMonth ? 'hover:bg-accent' : 'opacity-50'}
                          ${isSelected ? 'ring-2 ring-primary bg-accent' : ''}
                        `}
                        onClick={() => handleDateClick(dayInfo.date)}
                      >
                        <div className="text-sm font-medium">
                          {dayInfo.date}
                        </div>
                        
                        {dayInfo.hasTransactions && (
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center justify-center gap-1">
                              <DollarSign className="h-3 w-3 text-green-500" />
                              <span className="text-xs font-medium">
                                {formatCurrency(dayInfo.totalAmount)}
                              </span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {dayInfo.transactionCount} transaction{dayInfo.transactionCount !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                        )}
                        
                        {dayInfo.requiresAuth && (
                          <div className="absolute top-1 right-1">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedDate && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Transaction Details - {selectedDate.toLocaleDateString()}</CardTitle>
              <CardDescription>
                Transactions scheduled for this date
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions
                .filter(t => {
                  const tDate = new Date(t.date);
                  return tDate.getDate() === selectedDate.getDate() &&
                         tDate.getMonth() === selectedDate.getMonth() &&
                         tDate.getFullYear() === selectedDate.getFullYear();
                })
                .map(transaction => (
                  <div key={transaction.id} className="border rounded-lg p-4 mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{transaction.partyName}</h4>
                        <Badge variant="outline" className="mb-2">
                          {transaction.category}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {transaction.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {formatCurrency(transaction.amount)}
                        </div>
                        <Badge variant="secondary" className="mt-1">
                          {transaction.paymentMethod}
                        </Badge>
                      </div>
                    </div>
                    
                    {transaction.requiresAuth && (
                      <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          <div>
                            <p className="text-sm font-medium text-orange-800">
                              Requires Admin Authorization
                            </p>
                            {transaction.authorizedBy && (
                              <p className="text-xs text-orange-600">
                                Authorized by: {transaction.authorizedBy}
                                {transaction.authorizedAt && (
                                  <span> on {new Date(transaction.authorizedAt).toLocaleString()}</span>
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {transaction.invoiceImage && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Invoice:</p>
                        <img 
                          src={transaction.invoiceImage} 
                          alt="Invoice" 
                          className="max-w-xs rounded border cursor-pointer hover:opacity-80"
                          onClick={() => window.open(transaction.invoiceImage, '_blank')}
                        />
                      </div>
                    )}
                  </div>
                ))
              }
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}