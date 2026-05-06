import { Plane, Users, Ship, Package } from 'lucide-react';

interface QuickCountsProps {
  trips: number;
  suppliers: number;
  shipments: number;
  products: number;
}

export function QuickCounts({ trips, suppliers, shipments, products }: QuickCountsProps) {
  const items = [
    { label: 'الرحلات', value: trips, icon: Plane, color: 'text-primary' },
    { label: 'الموردين', value: suppliers, icon: Users, color: 'text-secondary' },
    { label: 'الشحنات', value: shipments, icon: Ship, color: 'text-info' },
    { label: 'المنتجات', value: products, icon: Package, color: 'text-accent' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((item, i) => (
        <div
          key={item.label}}}}
          className="bg-card rounded-lg border border-border/60 p-2.5 shadow-card text-center"
        >
          <item.icon className={`w-4 h-4 mx-auto mb-1 ${item.color}`} />
          <p className="text-base lg:text-lg font-extrabold leading-tight">{item.value}</p>
          <p className="text-[9px] text-muted-foreground font-medium">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
