import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Share2, FileText, FileSpreadsheet, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
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

const categoryColors = ['#2563EB', '#7C3AED', '#10B981', '#38BDF8', '#F59E0B', '#EF4444'];

export default function Reports() {
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiRequest('/api/transactions/');
        if (cancelled) return;

        const apiTransactions: ApiTransaction[] = data.transactions ?? data;
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

  // Calculate from real transactions
  const totalIncome = transactions
    .filter((t) => t.transaction_type === 'income')
    .reduce((s, t) => s + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.transaction_type === 'expense')
    .reduce((s, t) => s + Number(t.amount), 0);

  const netSavings = totalIncome - totalExpense;

  // Group by month
  const monthlyMap = new Map<string, { income: number; expense: number }>();

  transactions.forEach((t) => {
    const month = new Date(`${t.date}T00:00:00`).toLocaleDateString('en-IN', {
      month: 'short',
    });

    const entry = monthlyMap.get(month) ?? { income: 0, expense: 0 };

    if (t.transaction_type === 'income') {
      entry.income += Number(t.amount);
    } else {
      entry.expense += Number(t.amount);
    }

    monthlyMap.set(month, entry);
  });

  const monthlyData = Array.from(monthlyMap.entries()).map(([month, v]) => ({
    month,
    income: v.income,
    expense: v.expense,
  }));

  const avgMonthlySavings =
    monthlyData.length > 0 ? netSavings / monthlyData.length : 0;

  // Category distribution
  const categoryMap = new Map<string, number>();

  transactions
    .filter((t) => t.transaction_type === 'expense')
    .forEach((t) => {
      categoryMap.set(
        t.category,
        (categoryMap.get(t.category) ?? 0) + Number(t.amount)
      );
    });

  const categoryData = Array.from(categoryMap.entries()).map(
    ([name, value], i) => ({
      name,
      value,
      color: categoryColors[i % categoryColors.length],
    })
  );

  // Top category
  const topCategory =
    categoryData.length > 0
      ? categoryData.reduce((a, b) => (a.value > b.value ? a : b))
      : null;

  const hasData = transactions.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Reports
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            Professional financial reports, ready to download and share.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<FileSpreadsheet className="w-4 h-4" />}
          >
            Excel
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<FileText className="w-4 h-4" />}
          >
            PDF
          </Button>

          <Button
            size="sm"
            icon={<Share2 className="w-4 h-4" />}
          >
            Share
          </Button>
        </div>
      </div>

      {loading && (
        <div className="glass rounded-3xl p-12 flex items-center justify-center">
          <p
            className="text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            Loading reports...
          </p>
        </div>
      )}

      {error && (
        <div
          className="glass rounded-3xl p-6"
          style={{ border: '1px solid rgba(239,68,68,0.3)' }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: '#EF4444' }}
          >
            Unable to load data: {error}
          </p>
        </div>
      )}

      {!loading && !error && !hasData && (
        <div className="glass rounded-3xl p-12 flex items-center justify-center">
          <p
            className="text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            No transaction data available yet.
          </p>
        </div>
      )}

      {!loading && !error && hasData && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Income',
                value: totalIncome,
                color: '#10B981',
              },
              {
                label: 'Total Expense',
                value: totalExpense,
                color: '#EF4444',
              },
              {
                label: 'Net Savings',
                value: netSavings,
                color: '#2563EB',
              },
              {
                label: 'Avg Monthly Savings',
                value: avgMonthlySavings,
                color: '#7C3AED',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5"
              >
                <p
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {card.label}
                </p>

                <p
                  className="text-xl font-bold mt-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {formatINR(card.value, true)}
                </p>

                <span
                  className="text-xs font-semibold"
                  style={{ color: card.color }}
                >
                  From your transactions
                </span>
              </motion.div>
            ))}
          </div>

          {/* Monthly bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className="font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Monthly Summary
                </h3>

                <p
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Income vs Expense — from your transactions
                </p>
              </div>

              <Badge variant="info">Real Data</Badge>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.1)"
                />

                <XAxis
                  dataKey="month"
                  stroke="rgba(148,163,184,0.5)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="rgba(148,163,184,0.5)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatINR(v, true)}
                />

                <Tooltip
                  contentStyle={{
                    background: 'rgba(15,23,42,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    color: '#fff',
                  }}
                  formatter={(v: string | number) => formatINR(Number(v))}
                  cursor={{ fill: 'rgba(148,163,184,0.05)' }}
                />

                <Legend wrapperStyle={{ fontSize: 12 }} />

                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#2563EB"
                  radius={[6, 6, 0, 0]}
                />

                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#7C3AED"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie + Line */}
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6"
            >
              <h3
                className="font-semibold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Category Distribution
              </h3>

              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={90}
                      label={(e: { name?: string }) => `${e.name ?? ''}`}
                    >
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        background: 'rgba(15,23,42,0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        color: '#fff',
                      }}
                      formatter={(v: string | number) => formatINR(Number(v))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div
                  className="h-[200px] flex items-center justify-center text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  No expense categories available.
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-3xl p-6"
            >
              <h3
                className="font-semibold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Savings Trend
              </h3>

              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={monthlyData.map((m) => ({
                    month: m.month,
                    savings: m.income - m.expense,
                  }))}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148,163,184,0.1)"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="rgba(148,163,184,0.5)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="rgba(148,163,184,0.5)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => formatINR(v, true)}
                  />

                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15,23,42,0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      color: '#fff',
                    }}
                    formatter={(v: string | number) => formatINR(Number(v))}
                  />

                  <Line
                    type="monotone"
                    dataKey="savings"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Financial summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass gradient-border rounded-3xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />

              <h3
                className="font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Financial Summary
              </h3>
            </div>

            <div
              className="grid md:grid-cols-2 gap-4 text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              <div className="space-y-2">
                <p>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    Income:
                  </strong>{' '}
                  {formatINR(totalIncome)}
                </p>

                <p>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    Expenses:
                  </strong>{' '}
                  {formatINR(totalExpense)}
                </p>

                <p>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    Savings:
                  </strong>{' '}
                  {formatINR(netSavings)}
                </p>

                <p>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    Transactions:
                  </strong>{' '}
                  {transactions.length}
                </p>
              </div>

              <div className="space-y-2">
                {topCategory ? (
                  <p>
                    📈 Top category: {topCategory.name} (
                    {formatINR(topCategory.value)})
                  </p>
                ) : (
                  <p>📈 Top category: No expense data available.</p>
                )}

                <p>
                  📉 Expense categories: {categoryData.length}
                </p>

                <p>
                  🎯 Months with data: {monthlyData.length}
                </p>

                <p>
                  💡 Spending insight:{' '}
                  {topCategory
                    ? `Your highest spending category is ${topCategory.name}.`
                    : 'No spending data available.'}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}