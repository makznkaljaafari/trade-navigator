import { lazyWithPreload } from './lazyWithPreload';

export const routes = {
  '/': lazyWithPreload(() => import('@/pages/Dashboard')),
  '/trips': lazyWithPreload(() => import('@/pages/TripsPage')),
  '/suppliers': lazyWithPreload(() => import('@/pages/SuppliersPage')),
  '/products': lazyWithPreload(() => import('@/pages/ProductsPage')),
  '/quotations': lazyWithPreload(() => import('@/pages/QuotationsPage')),
  '/purchases': lazyWithPreload(() => import('@/pages/PurchasesPage')),
  '/shipping': lazyWithPreload(() => import('@/pages/ShippingPage')),
  '/inventory': lazyWithPreload(() => import('@/pages/InventoryPage')),
  '/sales': lazyWithPreload(() => import('@/pages/SalesPage')),
  '/customers': lazyWithPreload(() => import('@/pages/CustomersPage')),
  '/payments': lazyWithPreload(() => import('@/pages/PaymentsPage')),
  '/reports': lazyWithPreload(() => import('@/pages/ReportsPage')),
  '/expenses': lazyWithPreload(() => import('@/pages/ExpensesPage')),
  '/currency': lazyWithPreload(() => import('@/pages/CurrencyPage')),
  '/settings': lazyWithPreload(() => import('@/pages/SettingsPage')),
} as const;

export type AppRoute = keyof typeof routes;

export function preloadRoute(path: string) {
  const r = (routes as any)[path];
  if (r?.preload) r.preload();
}

/** Preload all secondary routes after the app becomes idle. */
export function preloadAllOnIdle() {
  const run = () => Object.values(routes).forEach(r => r.preload());
  if (typeof (window as any).requestIdleCallback === 'function') {
    (window as any).requestIdleCallback(run, { timeout: 3000 });
  } else {
    setTimeout(run, 1500);
  }
}
