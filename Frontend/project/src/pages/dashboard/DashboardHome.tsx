import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Wallet, TrendingUp, TrendingDown, PiggyBank, LineChart, Brain,
  ArrowUpRight, ArrowDownRight, Sparkles, Bot,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadialBarChart, RadialBar,
} from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/SectionHeading';
import { apiRequest } from '@/lib/api';
import { formatINR } from '@/lib/utils';

type ApiTransaction = {
  id: number;
  amount: string | number;
  transaction_type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
};

type DashboardTransaction = ApiTransaction & { amount: number };

const categoryColors = ['#2563EB', '#7C3AED', '#10B981', '#38BDF8', '#F59E0B', '#EF4444'];

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-[200px] flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
      {message}
    </div>
  );
}

function UnavailableStatCard({ label, icon, gradient }: { label: string; icon: React.ReactNode; gradient: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass gradient-border p-6 rounded-3xl relative overflow-hidden">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4" style={{ background: gradient }}>
        {icon}
      </div>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-muted)' }}>Unavailable</p>
    </motion.div>
  );
}

export default function DashboardHome() {
  const [transactions, setTransactions] = useState<DashboardTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0,
  });

  const [healthScore, setHealthScore] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const [transactionData, summaryData, digitalTwinData] = await Promise.all([
          apiRequest('/api/transactions/'),
          apiRequest('/api/transactions/summary/'),
          apiRequest('/api/digital-twin/'),
        ]);

        if (cancelled) return;

        const apiTransactions: ApiTransaction[] = transactionData.transactions ?? transactionData;
        setTransactions(apiTransactions.map((transaction) => ({
          ...transaction,
          amount: Number(transaction.amount),
        })));
        setSummary({
          total_income: Number(summaryData.total_income),
          total_expense: Number(summaryData.total_expense),
          balance: Number(summaryData.balance),
        });

        setHealthScore(Number(digitalTwinData.healthScore));

      } catch (requestError) {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : 'Failed to load dashboard data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboard();
    return () => { cancelled = true; };
  }, []);

  const monthlyIncome = transactions.reduce<{ month: string; income: number; expense: number }[]>((months, transaction) => {
    const month = new Date(`${transaction.date}T00:00:00`).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    const existing = months.find((item) => item.month === month);
    if (existing) {
      existing[transaction.transaction_type] += transaction.amount;
    } else {
      months.push({ month, income: transaction.transaction_type === 'income' ? transaction.amount : 0, expense: transaction.transaction_type === 'expense' ? transaction.amount : 0 });
    }
    return months;
  }, []).slice(-12);

  const categoryDistribution = Object.values(transactions.reduce<Record<string, { name: string; value: number; color: string }>>((categories, transaction) => {
    if (transaction.transaction_type !== 'expense') return categories;
    const category = categories[transaction.category] ?? {
      name: transaction.category,
      value: 0,
      color: categoryColors[Object.keys(categories).length % categoryColors.length],
    };
    category.value += transaction.amount;
    categories[transaction.category] = category;
    return categories;
  }, {}));

  const cashFlow = Object.values(transactions.reduce<Record<string, { day: string; inflow: number; outflow: number }>>((weeks, transaction) => {
    const week = `W${Math.ceil(new Date(`${transaction.date}T00:00:00`).getDate() / 7)}`;
    const current = weeks[week] ?? { day: week, inflow: 0, outflow: 0 };
    current[transaction.transaction_type === 'income' ? 'inflow' : 'outflow'] += transaction.amount;
    weeks[week] = current;
    return weeks;
  }, {})).sort((a, b) => a.day.localeCompare(b.day));

  const hasData = transactions.length > 0;

  return (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Financial dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Here's your financial snapshot for today.</p>
      </div>
      <div className="glass rounded-2xl px-4 py-2.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center"><Brain className="w-5 h-5 text-emerald-400" /></div>
        <div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>AI Health Score</p>
          <p className="text-lg font-bold text-emerald-400">
            {healthScore === null ? 'Unavailable' : `${healthScore}/100`}
          </p>
        </div>
      </div>
    </div>

      {/* Stat cards */}
      {error && <div className="glass rounded-2xl p-4 text-sm text-red-400">{error}</div>}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading ? <MetricPlaceholder /> : <StatCard label="Current Balance" value={summary.balance} icon={<Wallet className="w-5 h-5" />} gradient="linear-gradient(135deg,#2563EB,#7C3AED)" delay={0} />}
        {loading ? <MetricPlaceholder /> : <StatCard label="Total Income" value={summary.total_income} icon={<TrendingUp className="w-5 h-5" />} gradient="linear-gradient(135deg,#10B981,#38BDF8)" delay={0.05} />}
        {loading ? <MetricPlaceholder /> : <StatCard label="Total Expense" value={summary.total_expense} icon={<TrendingDown className="w-5 h-5" />} gradient="linear-gradient(135deg,#EF4444,#F59E0B)" delay={0.1} />}
        <UnavailableStatCard label="Total Savings" icon={<PiggyBank className="w-5 h-5" />} gradient="linear-gradient(135deg,#7C3AED,#38BDF8)" />
        <UnavailableStatCard label="Investments" icon={<LineChart className="w-5 h-5" />} gradient="linear-gradient(135deg,#22C55E,#10B981)" />
        {loading || healthScore === null ? (
          <UnavailableStatCard
            label="AI Health Score"
            icon={<Brain className="w-5 h-5" />}
            gradient="linear-gradient(135deg,#F59E0B,#EF4444)"
          />
        ) : (
          <StatCard
            label="AI Health Score"
            value={healthScore}
            format="plain"
            icon={<Brain className="w-5 h-5" />}
            gradient="linear-gradient(135deg,#F59E0B,#EF4444)"
            delay={0.2}
          />
        )}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Income vs Expense */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-3xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Income vs Expense</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Last 12 months</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}><span className="w-2 h-2 rounded-full bg-blue-500" /> Income</span>
              <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}><span className="w-2 h-2 rounded-full bg-purple-500" /> Expense</span>
            </div>
          </div>
          {hasData ? <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyIncome}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563EB" stopOpacity={0.4} /><stop offset="100%" stopColor="#2563EB" stopOpacity={0} /></linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7C3AED" stopOpacity={0.4} /><stop offset="100%" stopColor="#7C3AED" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="month" stroke="rgba(148,163,184,0.5)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(148,163,184,0.5)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatINR(v, true)} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(v: any) => formatINR(Number(v))} />
              <Area type="monotone" dataKey="income" stroke="#2563EB" strokeWidth={2} fill="url(#incomeGrad)" />
              <Area type="monotone" dataKey="expense" stroke="#7C3AED" strokeWidth={2} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer> : <EmptyChart message="No transaction history available." />}
        </motion.div>

        {/* Category distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass rounded-3xl p-6">
          <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Spending by Category</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>This month</p>
          {hasData ? <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {categoryDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(v: any) => formatINR(Number(v))} />
            </PieChart>
          </ResponsiveContainer> : <EmptyChart message="No spending categories available." />}
          {hasData && <div className="mt-2 space-y-1.5">
            {categoryDistribution.slice(0, 4).map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}><span className="w-2 h-2 rounded-full" style={{ background: c.color }} /> {c.name}</span>
                <span style={{ color: 'var(--text-primary)' }}>{formatINR(c.value, true)}</span>
              </div>
            ))}
          </div>}
        </motion.div>
      </div>

      {/* Cash flow + Health score */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-3xl p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Weekly Cash Flow</h3>
          {hasData ? <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cashFlow}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="day" stroke="rgba(148,163,184,0.5)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(148,163,184,0.5)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatINR(v, true)} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(v: any) => formatINR(Number(v))} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
              <Bar dataKey="inflow" fill="#10B981" radius={[6,6,0,0]} />
              <Bar dataKey="outflow" fill="#EF4444" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer> : <EmptyChart message="No cash-flow history available." />}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass rounded-3xl p-6">
          <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Financial Health</h3>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>6-month trend</p>
          {healthScore === null ? (
            <EmptyChart message="Financial health score is not available yet." />
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center">
              <p className="text-5xl font-bold text-emerald-400">{healthScore}</p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                AI Financial Health Score
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* AI Insight banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass gradient-border rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 animate-pulse-glow">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>AI Insight</span>
            <Badge variant="info"><Sparkles className="w-3 h-3" /> New</Badge>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Personalized insights will appear when financial analysis is available.</p>
        </div>
      </motion.div>

      {/* Recent transactions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Transactions</h3>
          <button className="text-sm text-blue-400 hover:underline">View all</button>
        </div>
        <div className="space-y-2">
          {loading && <EmptyChart message="Loading transactions..." />}
          {!loading && !hasData && <EmptyChart message="No transactions found." />}
          {!loading && transactions.slice(0, 6).map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.05 }} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.transaction_type === 'income' ? 'bg-emerald-500/15' : 'bg-red-500/10'}`}>
                {t.transaction_type === 'income' ? <ArrowUpRight className="w-5 h-5 text-emerald-400" /> : <ArrowDownRight className="w-5 h-5 text-red-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{t.description}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.category} · -</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${t.transaction_type === 'income' ? 'text-emerald-400' : ''}`} style={{ color: t.transaction_type === 'income' ? undefined : 'var(--text-primary)' }}>
                  {t.transaction_type === 'income' ? '+' : '-'}{formatINR(t.amount)}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function MetricPlaceholder() {
  return (
    <div className="glass gradient-border p-6 rounded-3xl animate-pulse">
      <div className="w-12 h-12 rounded-2xl mb-4" style={{ background: 'var(--border)' }} />
      <div className="h-4 w-24 rounded" style={{ background: 'var(--border)' }} />
      <div className="h-8 w-32 rounded mt-2" style={{ background: 'var(--border)' }} />
    </div>
  );
}
