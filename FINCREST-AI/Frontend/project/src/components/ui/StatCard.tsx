import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useCountUp, formatINR } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  format?: 'inr' | 'percent' | 'plain';
  icon: ReactNode;
  gradient: string;
  trend?: { value: number; positive: boolean };
  delay?: number;
}

export function StatCard({ label, value, format = 'inr', icon, gradient, trend, delay = 0 }: StatCardProps) {
  const animated = useCountUp(value, 1800);
  const display =
    format === 'inr' ? formatINR(animated, true) :
    format === 'percent' ? `${animated.toFixed(0)}%` :
    animated.toFixed(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="glass gradient-border p-6 rounded-3xl relative overflow-hidden group"
    >
      <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40`} style={{ background: gradient }} />
      <div className="relative flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white`} style={{ background: gradient }}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${trend.positive ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{display}</p>
    </motion.div>
  );
}
