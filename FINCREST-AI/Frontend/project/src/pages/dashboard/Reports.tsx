import { motion } from 'framer-motion';
import { Download, Share2, FileText, FileSpreadsheet, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { monthlyIncome, categoryDistribution } from '@/lib/data';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/SectionHeading';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Reports</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Professional financial reports, ready to download and share.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />}>Excel</Button>
          <Button variant="secondary" size="sm" icon={<FileText className="w-4 h-4" />}>PDF</Button>
          <Button size="sm" icon={<Share2 className="w-4 h-4" />}>Share</Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Income (YTD)', value: 2871000, color: '#10B981', trend: '+8%' },
          { label: 'Total Expense (YTD)', value: 1856000, color: '#EF4444', trend: '-5%' },
          { label: 'Net Savings (YTD)', value: 1015000, color: '#2563EB', trend: '+15%' },
          { label: 'Avg Monthly Savings', value: 84583, color: '#7C3AED', trend: '+22%' },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{formatINR(card.value, true)}</p>
            <span className={`text-xs font-semibold ${card.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{card.trend} vs last year</span>
          </motion.div>
        ))}
      </div>

      {/* Monthly bar chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Monthly Summary</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Income vs Expense — full year</p>
          </div>
          <Badge variant="info">2026</Badge>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyIncome}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="month" stroke="rgba(148,163,184,0.5)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(148,163,184,0.5)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatINR(v, true)} />
            <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(v: any) => formatINR(Number(v))} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="income" name="Income" fill="#2563EB" radius={[6,6,0,0]} />
            <Bar dataKey="expense" name="Expense" fill="#7C3AED" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pie + Line */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Category Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryDistribution} dataKey="value" nameKey="name" outerRadius={90} label={(e: any) => `${e.name}`}>
                {categoryDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(v: any) => formatINR(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-6">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Savings Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyIncome.map(m => ({ month: m.month, savings: m.income - m.expense }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="month" stroke="rgba(148,163,184,0.5)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(148,163,184,0.5)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatINR(v, true)} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(v: any) => formatINR(Number(v))} />
              <Line type="monotone" dataKey="savings" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* AI monthly summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass gradient-border rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>AI Monthly Summary — July 2026</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <div className="space-y-2">
            <p><strong style={{ color: 'var(--text-primary)' }}>Income:</strong> {formatINR(230000)} (salary {formatINR(185000)} + freelance {formatINR(45000)})</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>Expenses:</strong> {formatINR(142000)} (5% below average)</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>Savings:</strong> {formatINR(88000)} (38% rate)</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>Investments:</strong> {formatINR(10000)} SIP + {formatINR(5000)} stocks</p>
          </div>
          <div className="space-y-2">
            <p>📈 Top category: Food ({formatINR(8420)}, 26% above avg)</p>
            <p>📉 Reduced: Shopping (-31% vs last month)</p>
            <p>🎯 Goals: 3 on track, Goa trip 80% complete</p>
            <p>💡 AI tip: Move {formatINR(15000)} idle cash to liquid fund</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
