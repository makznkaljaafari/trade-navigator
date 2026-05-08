import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <Label className="text-[11px] font-semibold text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-[10px] text-destructive font-medium">{error}</p>}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
}

export function SelectField({ label, value, onChange, options, error }: SelectFieldProps) {
  return (
    <FormField label={label} error={error}>
      <select
        className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </FormField>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}

export function TextField({ label, value, onChange, placeholder, type = 'text', error }: TextFieldProps) {
  return (
    <FormField label={label} error={error}>
      <Input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-8 text-xs ${error ? 'border-destructive' : ''}`}
      />
    </FormField>
  );
}
