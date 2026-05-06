import { Settings } from 'lucide-react';
import logoImg from '@/assets/logo.png';
import { SidebarNav } from './SidebarNav';

export function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[210px] gradient-sidebar fixed inset-y-0 right-0 z-40 border-l border-sidebar-border/50">
      <div className="p-3 pb-2 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg gradient-secondary shadow-colored-secondary flex items-center justify-center overflow-hidden">
          <img src={logoImg} alt="Logo" className="w-6 h-6 object-contain" />
        </div>
        <div>
          <h1 className="text-sm font-extrabold text-sidebar-foreground tracking-tight leading-tight">
            Auto<span className="text-secondary">Parts</span>
          </h1>
          <p className="text-[9px] text-sidebar-foreground/40 font-medium">نظام إدارة الاستيراد</p>
        </div>
      </div>

      <div className="mx-3 mb-2 h-px bg-sidebar-border/50" />

      <nav className="flex-1 py-1 overflow-y-auto">
        <SidebarNav />
      </nav>

      <div className="mx-3 px-2.5 py-1.5 bg-sidebar-accent/50 rounded-md mb-2">
        <p className="text-[9px] text-sidebar-foreground/40 text-center">
          اضغط <kbd className="bg-sidebar-accent px-1 rounded text-[9px] font-mono">Alt+/</kbd> للاختصارات
        </p>
      </div>

      <div className="mx-3 h-px bg-sidebar-border/50" />
      <div className="p-2.5">
        <div className="flex items-center gap-2 p-2 rounded-md bg-sidebar-accent/50">
          <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-[11px] font-bold text-primary-foreground">
            م
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-sidebar-foreground truncate">مدير النظام</p>
            <p className="text-[9px] text-sidebar-foreground/40">الخطة المجانية</p>
          </div>
          <Settings className="w-3.5 h-3.5 text-sidebar-foreground/40" />
        </div>
      </div>
    </aside>
  );
}
