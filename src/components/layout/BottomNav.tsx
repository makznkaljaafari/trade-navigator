import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { bottomNavItems } from './navConfig';

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
              className={`flex flex-col items-center py-2 px-2 rounded-xl text-[10px] transition-all duration-200 min-w-[56px] active:scale-95 ${
                isActive ? 'text-primary font-bold' : 'text-muted-foreground'
              }`}
            >
              <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-primary/10' : ''}`}>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              </div>
              <span className="mt-0.5 truncate">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={onMoreClick}
          className="flex flex-col items-center py-2 px-2 rounded-xl text-[10px] text-muted-foreground min-w-[56px] active:scale-95"
        >
          <div className="p-1">
            <Menu className="w-5 h-5" />
          </div>
          <span className="mt-0.5">المزيد</span>
        </button>
      </div>
    </nav>
  );
}
