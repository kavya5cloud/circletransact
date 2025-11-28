'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/landing');
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-3 flex-1">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <img 
              src="/circle-office-logo.png" 
              alt="Circle Office" 
              className="h-8 w-8"
            />
            <span className="font-semibold text-lg hidden sm:inline-block">
              Circle Office
            </span>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <Badge variant="secondary">{user.role}</Badge>
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              {user.name || user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2 sm:mr-0" />
              <span className="hidden sm:inline-block">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}