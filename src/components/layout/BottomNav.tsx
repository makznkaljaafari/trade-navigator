import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { bottomNavItems } from './navConfig';
import { preloadRoute } from '@/lib/routePreload';

export function BottomNav({ onMoreClick }: { onMoreClick: () => void }) {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-card/90 backdrop-blur-2xl border-t border-border/60 z-30 safe-area-bottom">
      <div className="flex justify-around items-center py-1 px-1">
        {bottomNavItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onTouchStart={() => preloadRoute(item.path)}
              onMouseEnter={() => preloadRoute(item.path)}
              className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[9px] transition-colors duration-150 min-w-[48px] active:scale-95 ${
                isActive ? 'text-primary font-bold' : 'text-muted-foreground'
              }`}
            >
              <div className={`p-0.5 rounded-md transition-colors ${isActive ? 'bg-primary/10' : ''}`}>
                <item.icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
              </div>
              <span className="mt-0.5 truncate">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={onMoreClick}
          className="flex flex-col items-center py-1 px-1.5 rounded-lg text-[9px] text-muted-foreground min-w-[48px] active:scale-95"
        >
          <div className="p-0.5">
            <Menu className="w-4 h-4" />
          </div>
          <span className="mt-0.5">المزيد</span>
        </button>
      </div>
    </nav>
  );
}
