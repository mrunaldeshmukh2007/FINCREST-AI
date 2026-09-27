import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Share2, FileText, FileSpreadsheet, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
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

type ChartTransaction = {
  id: number;
  amount: number;
  transaction_type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
};

type MonthlyData = {
  month: string;
  income: number;
  expense: number;
};

type CategoryData = {
  name: string;
  value: number;
  color: string;
};

type SavingsData = {
  month: string;
  savings: number;
};

const categoryColors = [
  '#2563EB',
  '#7C3AED',
  '#10B981',
  '#38BDF8',
  '#F59E0B',
  '#EF4444',
];

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="h-[200px] flex items-center justify-center text-sm"
      style={{ color: 'var(--text-muted)' }}
    >
      {message}
    </div>
  );
}

export default function Reports() {
  const [transactions, setTransactions] = useState<ChartTransaction[]>([]);
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

        const apiTransactions: ApiTransaction[] =
          data.transactions ?? data;

        const normalizedTransactions: ChartTransaction[] =
          apiTransactions.map((transaction) => ({
            ...transaction,
            amount: Number(transaction.amount),
          }));

        setTransactions(normalizedTransactions);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load transaction data'
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ============================
   * FINANCIAL CALCULATIONS
   * ============================
   */

  const totalIncome = transactions
    .filter((transaction) => transaction.transaction_type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.transaction_type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const netSavings = totalIncome - totalExpense;

  /*
   * ============================
   * MONTHLY DATA
   * ============================
   */

  const monthlyMap = new Map<
    string,
    { month: string; income: number; expense: number; sortDate: number }
  >();

  transactions.forEach((transaction) => {
    const transactionDate = new Date(`${transaction.date}T00:00:00`);

    if (Number.isNaN(transactionDate.getTime())) {
      return;
    }

    const monthKey = `${transactionDate.getFullYear()}-${String(
      transactionDate.getMonth() + 1
    ).padStart(2, '0')}`;

    const monthLabel = transactionDate.toLocaleDateString('en-IN', {
      month: 'short',
      year: '2-digit',
    });

    const existing = monthlyMap.get(monthKey);

    if (existing) {
      if (transaction.transaction_type === 'income') {
        existing.income += transaction.amount;
      } else {
        existing.expense += transaction.amount;
      }
    } else {
      monthlyMap.set(monthKey, {
        month: monthLabel,
        income:
          transaction.transaction_type === 'income'
            ? transaction.amount
            : 0,
        expense:
          transaction.transaction_type === 'expense'
            ? transaction.amount
            : 0,
        sortDate: transactionDate.getTime(),
      });
    }
  });

  const monthlyData: MonthlyData[] = Array.from(monthlyMap.values())
    .sort((a, b) => a.sortDate - b.sortDate)
    .slice(-12)
    .map(({ month, income, expense }) => ({
      month,
      income,
      expense,
    }));

  const avgMonthlySavings =
    monthlyData.length > 0
      ? monthlyData.reduce(
          (sum, month) => sum + (month.income - month.expense),
          0
        ) / monthlyData.length
      : 0;

  /*
   * ============================
   * CATEGORY DATA
   * ============================
   */

  const categoryMap = new Map<string, number>();

  transactions
    .filter((transaction) => transaction.transaction_type === 'expense')
    .forEach((transaction) => {
      const currentAmount = categoryMap.get(transaction.category) ?? 0;

      categoryMap.set(
        transaction.category,
        currentAmount + transaction.amount
      );
    });

  const categoryData: CategoryData[] = Array.from(
    categoryMap.entries()
  ).map(([name, value], index) => ({
    name,
    value,
    color: categoryColors[index % categoryColors.length],
  }));

  /*
   * ============================
   * TOP CATEGORY
   * ============================
   */

  const topCategory =
    categoryData.length > 0
      ? categoryData.reduce((highest, current) =>
          current.value > highest.value ? current : highest
        )
      : null;

  /*
   * ============================
   * SAVINGS TREND
   * ============================
   */

  const savingsData: SavingsData[] = monthlyData.map((month) => ({
    month: month.month,
    savings: month.income - month.expense,
  }));

  const hasData = transactions.length > 0;

  /*
   * ============================
   * RENDER
   * ============================
   */

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Loading */}
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

      {/* Error */}
      {error && (
        <div
          className="glass rounded-3xl p-6"
          style={{
            border: '1px solid rgba(239,68,68,0.3)',
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: '#EF4444' }}
          >
            Unable to load data: {error}
          </p>
        </div>
      )}

      {/* Empty State */}
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

      {/* Reports */}
      {!loading && !error && hasData && (
        <>
          {/* ============================
              SUMMARY CARDS
          ============================ */}

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
            ].map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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

          {/* ============================
              MONTHLY SUMMARY
          ============================ */}

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
                  Income vs Expense — last 12 months
                </p>
              </div>

              <Badge variant="info">Real Data</Badge>
            </div>

            {monthlyData.length > 0 ? (
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
                    tickFormatter={(value) =>
                      formatINR(Number(value), true)
                    }
                  />

                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15,23,42,0.95)',
                      border:
                        '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      color: '#fff',
                    }}
                    formatter={(value) =>
                      formatINR(Number(value ?? 0))
                    }
                    cursor={{
                      fill: 'rgba(148,163,184,0.05)',
                    }}
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
            ) : (
              <EmptyState message="No monthly data available." />
            )}
          </motion.div>

          {/* ============================
              CATEGORY + SAVINGS
          ============================ */}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
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
                <>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={3}
                      >
                        {categoryData.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={entry.color}
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        contentStyle={{
                          background:
                            'rgba(15,23,42,0.95)',
                          border:
                            '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 12,
                          color: '#fff',
                        }}
                        formatter={(value) =>
                          formatINR(Number(value ?? 0))
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="mt-2 space-y-2">
                    {categoryData
                      .slice(0, 6)
                      .map((category) => (
                        <div
                          key={category.name}
                          className="flex items-center justify-between text-xs"
                        >
                          <span
                            className="flex items-center gap-2"
                            style={{
                              color:
                                'var(--text-secondary)',
                            }}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                background:
                                  category.color,
                              }}
                            />

                            {category.name}
                          </span>

                          <span
                            style={{
                              color:
                                'var(--text-primary)',
                            }}
                          >
                            {formatINR(
                              category.value,
                              true
                            )}
                          </span>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <EmptyState message="No expense categories available." />
              )}
            </motion.div>

            {/* Savings Trend */}
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

              {savingsData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height={260}
                >
                  <LineChart data={savingsData}>
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
                      tickFormatter={(value) =>
                        formatINR(Number(value), true)
                      }
                    />

                    <Tooltip
                      contentStyle={{
                        background:
                          'rgba(15,23,42,0.95)',
                        border:
                          '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        color: '#fff',
                      }}
                      formatter={(value) =>
                        formatINR(Number(value ?? 0))
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="savings"
                      name="Savings"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{
                        fill: '#10B981',
                        r: 4,
                      }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="No savings trend available." />
              )}
            </motion.div>
          </div>

          {/* ============================
              FINANCIAL SUMMARY
          ============================ */}

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
                  <strong
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Income:
                  </strong>{' '}
                  {formatINR(totalIncome)}
                </p>

                <p>
                  <strong
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Expenses:
                  </strong>{' '}
                  {formatINR(totalExpense)}
                </p>

                <p>
                  <strong
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Savings:
                  </strong>{' '}
                  {formatINR(netSavings)}
                </p>

                <p>
                  <strong
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Transactions:
                  </strong>{' '}
                  {transactions.length}
                </p>
              </div>

              <div className="space-y-2">
                {topCategory ? (
                  <p>
                    📈 Top category:{' '}
                    {topCategory.name} (
                    {formatINR(topCategory.value)})
                  </p>
                ) : (
                  <p>
                    📈 Top category: No expense data
                    available.
                  </p>
                )}

                <p>
                  📉 Expense categories:{' '}
                  {categoryData.length}
                </p>

                <p>
                  🎯 Months with data:{' '}
                  {monthlyData.length}
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