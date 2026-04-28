import { motion } from 'framer-motion';
import { StatusBadge, StarRating } from '@/components/shared';
import { Plane, Ship, Users, Warehouse } from 'lucide-react';
import { Trip, Supplier, Shipment, InventoryItem } from '@/types';

interface RecentActivityProps {
  trips: Trip[];
  suppliers: Supplier[];
  shipments: Shipment[];
  inventory: InventoryItem[];
}

export function RecentActivity({ trips, suppliers, shipments, inventory }: RecentActivityProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-3">
      {/* Active Trips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-xl border border-border/60 p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-xs flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5 text-primary" />
            الرحلات النشطة
          </h3>
          <span className="text-[9px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{trips.length} رحلة</span>
        </div>
        <div className="space-y-2">
          {trips.map(trip => (
            <div key={trip.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
              <div>
                <p className="font-semibold text-xs">{trip.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{trip.city} • {trip.start_date}</p>
              </div>
              <StatusBadge status={trip.status} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Shipment Tracking */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-card rounded-xl border border-border/60 p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-xs flex items-center gap-1.5">
            <Ship className="w-3.5 h-3.5 text-info" />
            تتبع الشحنات
          </h3>
          <span className="text-[9px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{shipments.length} شحنة</span>
        </div>
        <div className="space-y-2">
          {shipments.map(shipment => (
            <div key={shipment.id} className="p-2.5 rounded-lg bg-muted/40">
              <div className="flex items-center justify-between mb-1.5">
                <p className="font-semibold text-xs">{shipment.shipment_number}</p>
                <StatusBadge status={shipment.status} />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-medium">{shipment.departure_port}</span>
                <div className="flex-1 h-px bg-border relative">
                  <Ship className="w-3 h-3 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card rounded" />
                </div>
                <span className="font-medium">{shipment.arrival_port}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{shipment.shipping_company} • {shipment.cartons_count} كرتون</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Suppliers */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card rounded-xl border border-border/60 p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-xs flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-secondary" />
            أفضل الموردين
          </h3>
        </div>
        <div className="space-y-2">
          {[...suppliers].sort((a, b) => b.rating - a.rating).map((sup, i) => (
            <div key={sup.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center text-[11px] font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-xs">{sup.name}</p>
                  <p className="text-[11px] text-muted-foreground">{sup.company_name}</p>
                </div>
              </div>
              <StarRating rating={sup.rating} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Inventory Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="bg-card rounded-xl border border-border/60 p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-xs flex items-center gap-1.5">
            <Warehouse className="w-3.5 h-3.5 text-accent" />
            حالة المخزون
          </h3>
        </div>
        <div className="space-y-2.5">
          {inventory.map(item => {
            const pct = Math.round((item.quantity_available / item.quantity_purchased) * 100);
            const isLow = pct < 30;
            return (
              <div key={item.id} className="p-2.5 rounded-lg bg-muted/40">
                <div className="flex justify-between items-center mb-1.5">
                  <p className="font-semibold text-xs">{item.product_name}</p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isLow ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'
                  }`}>
                    {item.quantity_available} متوفر
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      pct > 50 ? 'bg-accent' : pct > 20 ? 'bg-secondary' : 'bg-destructive'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
