import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { navGroups } from './navConfig';

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <div className="space-y-3">
      {navGroups.map(group => (
        <div key={group.label}>
          <p className="px-4 mb-1 text-[9px] font-bold uppercase tracking-widest text-sidebar-foreground/30">
            {group.label}
          </p>
          {group.items.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={`flex items-center gap-2.5 px-3 py-2 mx-2 rounded-md text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'gradient-secondary shadow-colored-secondary text-secondary-foreground'
                    : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? '' : 'opacity-70'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="mr-auto w-1.5 h-1.5 rounded-full bg-secondary-foreground"
                  />
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
