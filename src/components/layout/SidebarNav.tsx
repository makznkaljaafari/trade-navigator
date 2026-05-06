import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { navGroups } from './navConfig';

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <div className="space-y-2">
      {navGroups.map(group => (
        <div key={group.label}>
          <p className="px-3.5 mb-0.5 text-[8px] font-bold uppercase tracking-widest text-sidebar-foreground/30">
            {group.label}
          </p>
          {group.items.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={`flex items-center gap-2 px-2.5 py-1.5 mx-2 rounded-md text-[12px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'gradient-secondary shadow-colored-secondary text-secondary-foreground'
                    : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
              >
                <item.icon className={`w-3.5 h-3.5 ${isActive ? '' : 'opacity-70'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="mr-auto w-1 h-1 rounded-full bg-secondary-foreground"
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
