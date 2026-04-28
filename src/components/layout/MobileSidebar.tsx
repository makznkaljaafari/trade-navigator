import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import logoImg from '@/assets/logo.png';
import { SidebarNav } from './SidebarNav';

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: 280 }}
            animate={{ x: 0 }}
            exit={{ x: 280 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-[280px] gradient-sidebar z-50 lg:hidden shadow-2xl"
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-secondary shadow-colored-secondary flex items-center justify-center overflow-hidden">
                  <img src={logoImg} alt="Logo" className="w-6 h-6 object-contain" />
                </div>
                <h1 className="text-base font-extrabold text-sidebar-foreground">
                  Auto<span className="text-secondary">Parts</span>
                </h1>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mx-4 mb-2 h-px bg-sidebar-border/50" />
            <nav className="py-2 overflow-y-auto max-h-[calc(100vh-80px)]">
              <SidebarNav onNavigate={onClose} />
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
