import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Sparkles, Lightbulb, AlertTriangle, CheckCircle2, Info,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { formatINR } from '@/lib/utils';
import { Badge } from '@/components/ui/SectionHeading';
import { apiRequest } from '@/lib/api';

type ApiTransaction = {
  id: number;
  amount: string | number;
  transaction_type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
};

type ApiInsight = {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

const insightIcons = { warning: AlertTriangle, success: CheckCircle2, info: Info };

export default function Insights() {
  const [insights, setInsights] = useState<ApiInsight[]>([]);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [insightData, transactionData] = await Promise.all([
          apiRequest('/api/insights/'),
          apiRequest('/api/transactions/'),
        ]);

        if (cancelled) return;

        const apiInsights: ApiInsight[] = insightData.insights ?? insightData;
        const apiTransactions: ApiTransaction[] = transactionData.transactions ?? transactionData;
        setInsights(apiInsights);
        setTransactions(apiTransactions);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unable to load data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  // Calculate savings growth from real transactions (grouped by month)
  const monthlyMap = new Map<string, { savings: number; invested: number }>();
  transactions.forEach((t) => {
    const month = new Date(`${t.date}T00:00:00`).toLocaleDateString('en-IN', { month: 'short' });
    const entry = monthlyMap.get(month) ?? { savings: 0, invested: 0 };
    if (t.transaction_type === 'income') entry.savings += Number(t.amount);
    else if (t.category === 'Investments') entry.invested += Number(t.amount);
    else entry.savings -= Number(t.amount);
    monthlyMap.set(month, entry);
  });
  const savingsGrowth = Array.from(monthlyMap.entries()).map(([month, v]) => ({ month, savings: v.savings, invested: v.invested }));

  // Calculate weekday vs weekend spending from real transactions
  const weekdaySpend = { total: 0, count: 0 };
  const weekendSpend = { total: 0, count: 0 };
  transactions
    .filter((t) => t.transaction_type === 'expense')
    .forEach((t) => {
      const day = new Date(`${t.date}T00:00:00`).getDay();
      const amount = Number(t.amount);
      if (day === 0 || day === 6) {
        weekendSpend.total += amount;
        weekendSpend.count += 1;
      } else {
        weekdaySpend.total += amount;
        weekdaySpend.count += 1;
      }
    });
  const weekdayAvg = weekdaySpend.count > 0 ? weekdaySpend.total / weekdaySpend.count : 0;
  const weekendAvg = weekendSpend.count > 0 ? weekendSpend.total / weekendSpend.count : 0;
  const weekdayWeekendData = [
    { day: 'Weekday', weekday: weekdayAvg, weekend: 0 },
    { day: 'Weekend', weekday: 0, weekend: weekendAvg },
  ];

  const hasInsights = insights.length > 0;
  const hasTransactions = transactions.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Insights</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>AI-powered analytics that reveal what's happening with your money.</p>
      </div>

      {loading && (
        <div className="glass rounded-3xl p-12 flex items-center justify-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading insights...</p>
        </div>
      )}

      {error && (
        <div className="glass rounded-3xl p-6" style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
          <p className="text-sm font-medium" style={{ color: '#EF4444' }}>Unable to load data: {error}</p>
        </div>
      )}

      {!loading && !error && !hasInsights && !hasTransactions && (
        <div className="glass rounded-3xl p-12 flex items-center justify-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No personalized insights available yet.</p>
        </div>
      )}

      {!loading && !error && (hasInsights || hasTransactions) && (
        <>
          {/* Insight cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, i) => {
              const Icon = insightIcons[insight.type as keyof typeof insightIcons] || Lightbulb;
              const colors = { warning: '#F59E0B', success: '#22C55E', info: '#38BDF8' };
              const color = colors[insight.type as keyof typeof colors] || '#38BDF8';
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="glass rounded-3xl p-5 relative overflow-hidden group"
                >
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity" style={{ background: color }} />
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}20`, color }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{insight.title}</h3>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{insight.message}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6">
              <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Savings Growth</h3>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Savings vs Investments from your transactions</p>
              {savingsGrowth.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={savingsGrowth}>
                    <defs>
                      <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981" stopOpacity={0.4} /><stop offset="100%" stopColor="#10B981" stopOpacity={0} /></linearGradient>
                      <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7C3AED" stopOpacity={0.4} /><stop offset="100%" stopColor="#7C3AED" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(148,163,184,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(148,163,184,0.5)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatINR(v, true)} />
                    <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(v: any) => formatINR(Number(v))} />
                    <Area type="monotone" dataKey="savings" stroke="#10B981" strokeWidth={2} fill="url(#savGrad)" />
                    <Area type="monotone" dataKey="invested" stroke="#7C3AED" strokeWidth={2} fill="url(#invGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>No savings data available.</div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-6">
              <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Weekend vs Weekday Spending</h3>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Average daily spend pattern</p>
              {weekdaySpend.count > 0 || weekendSpend.count > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={weekdayWeekendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                    <XAxis dataKey="day" stroke="rgba(148,163,184,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(148,163,184,0.5)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatINR(v, true)} />
                    <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(v: any) => formatINR(Number(v))} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
                    <Bar dataKey="weekday" stackId="a" fill="#2563EB" radius={[6,6,0,0]} />
                    <Bar dataKey="weekend" stackId="a" fill="#7C3AED" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>No spending data available.</div>
              )}
            </motion.div>
          </div>

          {/* AI summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass gradient-border rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Weekly AI Summary</h3>
              <Badge variant="info">Unavailable</Badge>
            </div>
            <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p>AI summary is not available yet. Insights will appear once the AI service is connected.</p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}