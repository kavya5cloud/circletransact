'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';

import {
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  Download,
  Plus,
  LogOut,
  Settings,
  Home,
  IndianRupee
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  paymentMethod: string;
  partyName: string;
}

interface DashboardStats {
  totalToday: number;
  totalAmountToday: number;
  totalAmountWeek: number;
  totalAmountMonth: number;
  totalTransactions: number;
}

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats>({
    totalToday: 0,
    totalAmountToday: 0,
    totalAmountWeek: 0,
    totalAmountMonth: 0,
    totalTransactions: 0
  });

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push('/landing');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      const statsResponse = await fetch('/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsResponse.ok) setStats(await statsResponse.json());

      const txResponse = await fetch('/api/transactions?limit=5', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (txResponse.ok) {
        const data = await txResponse.json();
        setRecentTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({})
      });

      if (response.ok) {
        const data = await response.json();
        const link = document.createElement('a');
        link.href = data.pdfData;
        link.download = `transaction-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      alert('Failed to generate report');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  /* === LOADING SCREEN === */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a1025] to-[#0d1d3a]">
        <div className="animate-spin h-16 w-16 rounded-full border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full 
        bg-[url('/mesh-net.svg')] bg-cover bg-fixed bg-center
        bg-[#050d23] text-white relative">

        {/* Blue Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br 
          from-blue-900/40 via-blue-700/20 to-transparent pointer-events-none"></div>

        {/* SIDEBAR */}
        <Sidebar className="bg-white/5 backdrop-blur-xl border-r border-white/10">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <img src="/circle-office-logo.png" className="h-12 drop-shadow-lg" />
              <span className="font-semibold text-xl text-blue-300">Circle Office</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button className="w-full px-3 py-2 text-sm rounded-md bg-blue-600/30 text-blue-100 border border-blue-500/20 hover:bg-blue-600/50 transition-all shadow-lg flex items-center gap-2">
                    <Home className="h-4 w-4" /> Dashboard
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button onClick={() => router.push('/transactions')}
                    className="w-full px-3 py-2 text-sm hover:bg-blue-700/30 rounded-md transition-all flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-300" /> Transactions
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {user.role === 'ADMIN' && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button onClick={() => router.push('/admin')}
                      className="w-full px-3 py-2 text-sm hover:bg-blue-700/30 rounded-md transition-all flex items-center gap-2">
                      <Settings className="h-4 w-4 text-blue-300" /> Admin Panel
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col">

          {/* HEADER */}
          <header className="border-b border-white/10 bg-[#0a132f]/50 backdrop-blur-xl">
            <div className="flex h-14 items-center px-4">
              <SidebarTrigger />
              <div className="ml-auto flex items-center gap-4">
                <ThemeToggle />
                <Badge variant="secondary" className="text-black">{user.role}</Badge>
                <span className="text-sm text-blue-200">{user.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}
                  className="border-blue-500/30 text-blue-300 hover:bg-blue-700/20">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto space-y-10">

              {/* TITLE */}
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-200 to-blue-500 bg-clip-text text-transparent">
                  Circle Office Dashboard
                </h1>
                <p className="text-blue-300 mt-2">
                  Welcome back, <span className="font-semibold">{user.name || user.email}</span>
                </p>
              </div>

              {/* STAT CARDS */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                <StatCard title="Today's Transactions" icon={<Calendar />} value={stats.totalToday} />

                <StatCard 
                  title="Today's Amount" 
                  icon={<IndianRupee />} 
                  value={`₹${stats.totalAmountToday.toLocaleString("en-IN")}`} 
                />

                <StatCard 
                  title="Weekly Amount" 
                  icon={<TrendingUp />} 
                  value={`₹${stats.totalAmountWeek.toLocaleString("en-IN")}`} 
                />

                <StatCard 
                  title="Monthly Amount" 
                  icon={<TrendingUp />} 
                  value={`₹${stats.totalAmountMonth.toLocaleString("en-IN")}`} 
                />
              </div>

              {/* RECENT TRANSACTIONS */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-200">Recent Transactions</CardTitle>
                  <CardDescription className="text-blue-300">Latest financial activity</CardDescription>
                </CardHeader>

                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Party</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {recentTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-blue-300">
                            No transactions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentTransactions.map((t) => (
                          <TableRow key={t.id} className="hover:bg-blue-700/20 transition-all rounded-md">
                            <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                            <TableCell>{t.partyName}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-black">{t.category}</Badge>
                            </TableCell>
                            <TableCell>{t.paymentMethod}</TableCell>
                            <TableCell className="text-right font-semibold">
                              ₹{t.amount.toLocaleString("en-IN")}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

/* === Fancy Stat Card Component === */
function StatCard({ title, value, icon }: any) {
  return (
    <Card className="bg-gradient-to-br from-white/10 to-blue-600/10 border-white/10 rounded-xl backdrop-blur-xl shadow-xl p-4 hover:scale-[1.02] transition-all">
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle className="text-sm text-blue-200">{title}</CardTitle>
        <div className="text-blue-300">{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-blue-100">{value}</p>
      </CardContent>
    </Card>
  );
}
