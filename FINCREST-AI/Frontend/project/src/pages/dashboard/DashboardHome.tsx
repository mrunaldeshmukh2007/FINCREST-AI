import { motion } from 'framer-motion';
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
import { monthlyIncome, cashFlow, categoryDistribution, healthTrend, transactions } from '@/lib/data';
import { formatINR } from '@/lib/utils';

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Good morning, Arjun 👋</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Here's your financial snapshot for today.</p>
        </div>
        <div className="glass rounded-2xl px-4 py-2.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center"><Brain className="w-5 h-5 text-emerald-400" /></div>
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>AI Health Score</p>
            <p className="text-lg font-bold text-gradient-emerald">84<span className="text-sm" style={{ color: 'var(--text-muted)' }}>/100</span></p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Current Balance" value={482350} icon={<Wallet className="w-5 h-5" />} gradient="linear-gradient(135deg,#2563EB,#7C3AED)" trend={{ value: 12, positive: true }} delay={0} />
        <StatCard label="Monthly Income" value={230000} icon={<TrendingUp className="w-5 h-5" />} gradient="linear-gradient(135deg,#10B981,#38BDF8)" trend={{ value: 8, positive: true }} delay={0.05} />
        <StatCard label="Monthly Expense" value={142000} icon={<TrendingDown className="w-5 h-5" />} gradient="linear-gradient(135deg,#EF4444,#F59E0B)" trend={{ value: 5, positive: false }} delay={0.1} />
        <StatCard label="Total Savings" value={388000} icon={<PiggyBank className="w-5 h-5" />} gradient="linear-gradient(135deg,#7C3AED,#38BDF8)" trend={{ value: 15, positive: true }} delay={0.15} />
        <StatCard label="Investments" value={165000} icon={<LineChart className="w-5 h-5" />} gradient="linear-gradient(135deg,#22C55E,#10B981)" trend={{ value: 22, positive: true }} delay={0.2} />
        <StatCard label="AI Health Score" value={84} format="plain" icon={<Brain className="w-5 h-5" />} gradient="linear-gradient(135deg,#F59E0B,#EF4444)" delay={0.25} />
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
          <ResponsiveContainer width="100%" height={260}>
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
          </ResponsiveContainer>
        </motion.div>

        {/* Category distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass rounded-3xl p-6">
          <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Spending by Category</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>This month</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {categoryDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(v: any) => formatINR(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {categoryDistribution.slice(0, 4).map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}><span className="w-2 h-2 rounded-full" style={{ background: c.color }} /> {c.name}</span>
                <span style={{ color: 'var(--text-primary)' }}>{formatINR(c.value, true)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Cash flow + Health score */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-3xl p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Weekly Cash Flow</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cashFlow}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="day" stroke="rgba(148,163,184,0.5)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(148,163,184,0.5)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatINR(v, true)} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(v: any) => formatINR(Number(v))} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
              <Bar dataKey="inflow" fill="#10B981" radius={[6,6,0,0]} />
              <Bar dataKey="outflow" fill="#EF4444" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass rounded-3xl p-6">
          <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Financial Health</h3>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>6-month trend</p>
          <ResponsiveContainer width="100%" height={120}>
            <RadialBarChart data={[{ name: 'score', value: 84, fill: '#10B981' }]} innerRadius="65%" outerRadius="100%" startAngle={90} endAngle={-270}>
              <RadialBar background={{ fill: 'rgba(148,163,184,0.1)' }} dataKey="value" cornerRadius={20} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="-mt-20 text-center mb-12">
            <p className="text-4xl font-bold text-gradient-emerald">84</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Excellent</p>
          </div>
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={healthTrend}>
              <defs><linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981" stopOpacity={0.5} /><stop offset="100%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
              <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} fill="url(#healthGrad)" />
              <XAxis dataKey="month" stroke="rgba(148,163,184,0.4)" fontSize={10} tickLine={false} axisLine={false} />
            </AreaChart>
          </ResponsiveContainer>
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
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>You're on track to save <strong className="text-emerald-400">₹88,000</strong> this month — 15% above your 6-month average. Moving ₹15,000 idle cash to a liquid fund could add ₹3,200/yr in returns.</p>
        </div>
      </motion.div>

      {/* Recent transactions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Transactions</h3>
          <button className="text-sm text-blue-400 hover:underline">View all</button>
        </div>
        <div className="space-y-2">
          {transactions.slice(0, 6).map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.05 }} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/15' : 'bg-red-500/10'}`}>
                {t.type === 'income' ? <ArrowUpRight className="w-5 h-5 text-emerald-400" /> : <ArrowDownRight className="w-5 h-5 text-red-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{t.merchant}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.category} · {t.paymentMode}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-400' : ''}`} style={{ color: t.type === 'income' ? undefined : 'var(--text-primary)' }}>
                  {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
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
