import { Menu, LogOut, User } from 'lucide-react';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { useAuth } from '@/hooks/useAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function TopBar({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('تم تسجيل الخروج');
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-30 bg-background/70 backdrop-blur-2xl border-b border-border/60">
      <div className="px-3 lg:px-5 py-2 flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="فتح القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-sm font-bold">{title}</h2>
        </div>
        <NotificationBell />
        <DropdownMenu>
          <DropdownMenuTrigger className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-primary-foreground text-xs font-bold">
            {user?.email?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs truncate">{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <User className="w-4 h-4 ml-2" /> الإعدادات
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="w-4 h-4 ml-2" /> تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
