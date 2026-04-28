import { Settings } from 'lucide-react';
import logoImg from '@/assets/logo.png';
import { SidebarNav } from './SidebarNav';

export function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[260px] gradient-sidebar fixed inset-y-0 right-0 z-40 border-l border-sidebar-border/50">
      <div className="p-4 pb-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-secondary shadow-colored-secondary flex items-center justify-center overflow-hidden">
          <img src={logoImg} alt="Logo" className="w-7 h-7 object-contain" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-sidebar-foreground tracking-tight">
            Auto<span className="text-secondary">Parts</span>
          </h1>
          <p className="text-[10px] text-sidebar-foreground/40 font-medium">نظام إدارة الاستيراد</p>
        </div>
      </div>

      <div className="mx-4 mb-3 h-px bg-sidebar-border/50" />

      <nav className="flex-1 py-1 overflow-y-auto">
        <SidebarNav />
      </nav>

      <div className="mx-4 px-3 py-2 bg-sidebar-accent/50 rounded-lg mb-2">
        <p className="text-[10px] text-sidebar-foreground/40 text-center">
          اضغط <kbd className="bg-sidebar-accent px-1 rounded text-[10px] font-mono">Alt+/</kbd> لعرض الاختصارات
        </p>
      </div>

      <div className="mx-4 h-px bg-sidebar-border/50" />
      <div className="p-3">
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-sidebar-accent/50">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
            م
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-sidebar-foreground truncate">مدير النظام</p>
            <p className="text-[10px] text-sidebar-foreground/40">الخطة المجانية</p>
          </div>
          <Settings className="w-4 h-4 text-sidebar-foreground/40" />
        </div>
      </div>
    </aside>
  );
}
