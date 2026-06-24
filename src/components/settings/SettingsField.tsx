import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SettingsField({
  label, value, onChange, type = 'text', mono, className = '',
}: { label: string; value: string; onChange: (v: string) => void; type?: string; mono?: boolean; className?: string }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <Label className="text-[10px] font-semibold text-muted-foreground">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-7 text-[11px] ${mono ? 'font-mono tabular-nums' : ''}`}
        step={type === 'number' ? '0.0001' : undefined}
      />
    </div>
  );
}
