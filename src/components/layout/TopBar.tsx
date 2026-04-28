import { Menu } from 'lucide-react';
import { NotificationBell } from '@/components/shared/NotificationBell';

export function TopBar({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
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
      </div>
    </header>
  );
}
