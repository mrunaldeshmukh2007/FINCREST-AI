import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

import { apiRequest } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { Badge } from '@/components/ui/SectionHeading';

type ApiBudget = {
  category: string;
  amount_limit?: string | number;
  spent?: string | number;
  limit?: string | number;
  color?: string;
  icon?: string;
  aiSuggestion?: string;
};

type Budget = {
  category: string;
  spent: number;
  limit: number;
  color: string;
  icon: string;
  aiSuggestion: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toAmount(value: string | number | undefined): number {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

function toApiBudget(value: unknown): ApiBudget | null {
  if (!isRecord(value) || typeof value.category !== 'string') return null;

  const amountLimit = value.amount_limit ?? value.limit;
  if (typeof amountLimit !== 'string' && typeof amountLimit !== 'number') return null;

  return {
    category: value.category,
    amount_limit: amountLimit,
    spent: typeof value.spent === 'string' || typeof value.spent === 'number' ? value.spent : undefined,
    limit: typeof value.limit === 'string' || typeof value.limit === 'number' ? value.limit : undefined,
    color: typeof value.color === 'string' ? value.color : undefined,
    icon: typeof value.icon === 'string' ? value.icon : undefined,
    aiSuggestion: typeof value.aiSuggestion === 'string' ? value.aiSuggestion : undefined,
  };
}

function toBudget(budget: ApiBudget): Budget {
  return {
    category: budget.category,
    spent: toAmount(budget.spent),
    limit: toAmount(budget.limit ?? budget.amount_limit),
    color: budget.color ?? '#3B82F6',
    icon: budget.icon ?? '•',
    aiSuggestion: budget.aiSuggestion ?? 'Keep tracking your spending to stay on target.',
  };
}

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const loadBudgets = async () => {
      try {
        setLoading(true);
        setError('');

        const data: unknown = await apiRequest('/api/budgets/');
        const responseBudgets = isRecord(data) ? data.budgets : data;
        const apiBudgets = Array.isArray(responseBudgets)
          ? responseBudgets.map(toApiBudget).filter((budget): budget is ApiBudget => budget !== null)
          : [];

        setBudgets(apiBudgets.map(toBudget));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load budgets'
        );
      } finally {
        setLoading(false);
      }
    };

    loadBudgets();
  }, []);

  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const overallPct = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Budgets</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>AI-powered budget tracking across all your spending categories.</p>
      </div>

      {loading && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading budgets...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

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
          const pct = b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0;
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
