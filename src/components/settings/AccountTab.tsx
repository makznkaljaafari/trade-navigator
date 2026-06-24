import { UserCircle, LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${mono ? 'font-mono tabular-nums' : ''}`}>{value}</span>
    </div>
  );
}

export function AccountTab() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({ title: 'تم تسجيل الخروج' });
  };

  return (
    <div className="bg-card rounded-xl border border-border/70 p-3.5 space-y-2.5 max-w-md shadow-card">
      <h3 className="font-bold text-[13px] flex items-center gap-2"><UserCircle className="w-3.5 h-3.5 text-primary" /> الحساب</h3>
      <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1.5">
        <Row label="البريد الإلكتروني" value={user?.email || '—'} mono />
        <Row label="معرف المستخدم" value={user?.id ? user.id.slice(0, 13) + '…' : '—'} mono />
        <Row label="آخر دخول" value={user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('ar') : '—'} />
      </div>
      <div className="p-2.5 rounded-lg bg-accent/5 border border-accent/20 flex items-start gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
        <p className="text-[10px] text-muted-foreground leading-relaxed">حسابك محمي بمصادقة آمنة وكلمات مرور مشفرة. بياناتك مخزّنة بشكل خاص.</p>
      </div>
      <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full gap-2 h-7 text-[11px] text-destructive border-destructive/40 hover:bg-destructive/10">
        <LogOut className="w-3 h-3" /> تسجيل الخروج
      </Button>
    </div>
  );
}
