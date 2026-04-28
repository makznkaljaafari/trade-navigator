import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileSidebar } from './MobileSidebar';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { allNavItems } from './navConfig';

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useKeyboardShortcuts();

  const currentPage = allNavItems.find(item => item.path === location.pathname)?.label || 'لوحة التحكم';

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <DesktopSidebar />
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:mr-[230px] min-w-0">
        <TopBar title={currentPage} onMenuClick={() => setSidebarOpen(true)} />
        <div className="p-3 lg:p-5 pb-20 lg:pb-6">
          <Breadcrumbs />
          {children}
        </div>
      </main>

      <BottomNav onMoreClick={() => setSidebarOpen(true)} />
    </div>
  );
}
