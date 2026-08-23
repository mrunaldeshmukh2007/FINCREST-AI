import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, BellRing, Check } from 'lucide-react';
import { notifications } from '@/lib/data';
import { Badge } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

const typeConfig = {
  warning: { icon: AlertTriangle, color: '#F59E0B' },
  success: { icon: CheckCircle2, color: '#22C55E' },
  info: { icon: Info, color: '#38BDF8' },
  danger: { icon: ShieldAlert, color: '#EF4444' },
};

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Stay on top of your finances with smart, contextual alerts.</p>
        </div>
        <Button variant="secondary" size="sm" icon={<Check className="w-4 h-4" />}>Mark all read</Button>
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => {
          const config = typeConfig[n.type as keyof typeof typeConfig];
          const Icon = config.icon;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ x: 4 }}
              className={`glass rounded-2xl p-4 flex items-start gap-4 transition-all ${!n.read ? 'gradient-border' : ''}`}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${config.color}20`, color: config.color }}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{n.title}</h3>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{n.time}</p>
              </div>
              {n.type === 'danger' && <Badge variant="danger">Urgent</Badge>}
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6 text-center">
        <BellRing className="w-8 h-8 mx-auto mb-2 text-blue-400" />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>You're all caught up! We'll notify you when something needs your attention.</p>
      </motion.div>
    </div>
  );
}
