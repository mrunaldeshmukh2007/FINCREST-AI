import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { budgets } from '@/lib/data';
import { formatINR } from '@/lib/utils';
import { Badge } from '@/components/ui/SectionHeading';

export default function Budgets() {
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const overallPct = Math.round((totalSpent / totalLimit) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Budgets</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>AI-powered budget tracking across all your spending categories.</p>
      </div>

      {/* Overall */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass gradient-border rounded-3xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Monthly Budget</p>
            <p className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{formatINR(totalSpent)} <span className="text-base font-normal" style={{ color: 'var(--text-muted)' }}>of {formatINR(totalLimit)}</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Remaining</p>
            <p className="text-2xl font-bold text-emerald-400">{formatINR(totalLimit - totalSpent)}</p>
          </div>
        </div>
        <div className="mt-4 h-3 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${overallPct}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500" />
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{overallPct}% of total budget used</p>
      </motion.div>

      {/* Budget cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {budgets.map((b, i) => {
          const pct = Math.round((b.spent / b.limit) * 100);
          const remaining = b.limit - b.spent;
          const isOver = pct >= 90;
          const isWarning = pct >= 70 && pct < 90;
          return (
            <motion.div
              key={b.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass rounded-3xl p-5 relative overflow-hidden group"
            >
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity" style={{ background: b.color }} />
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${b.color}20` }}>{b.icon}</div>
                {isOver ? <Badge variant="danger"><AlertTriangle className="w-3 h-3" /> Over</Badge> : isWarning ? <Badge variant="warning">Watch</Badge> : <Badge variant="success">On track</Badge>}
              </div>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{b.category}</h3>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{formatINR(b.spent, true)} of {formatINR(b.limit, true)}</p>
              <div className="mt-3 h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 1, delay: i * 0.05, ease: 'easeOut' }} className="h-full rounded-full" style={{ background: isOver ? '#EF4444' : isWarning ? '#F59E0B' : b.color }} />
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span style={{ color: 'var(--text-muted)' }}>{pct}% used</span>
                <span className={remaining > 0 ? 'text-emerald-400' : 'text-red-400'}>{remaining > 0 ? `${formatINR(remaining, true)} left` : `${formatINR(Math.abs(remaining), true)} over`}</span>
              </div>
              <div className="mt-3 pt-3 border-t flex items-start gap-2" style={{ borderColor: 'var(--border)' }}>
                <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{b.aiSuggestion}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI suggestion banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass gradient-border rounded-3xl p-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>AI Budget Recommendation</span>
            <Badge variant="info"><Sparkles className="w-3 h-3" /> Smart</Badge>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Based on your spending patterns, reallocating ₹2,000 from Entertainment to Investments would let you hit your SIP goal 3 months earlier — with zero lifestyle impact.</p>
        </div>
      </motion.div>
    </div>
  );
}
