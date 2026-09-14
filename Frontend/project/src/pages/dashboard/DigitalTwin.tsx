import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Bot,
  Sparkles,
  Target,
  Wallet,
  Zap,
  TrendingUp,
  Shield,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

import { apiRequest } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { Badge } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

interface TimelinePoint {
  month: string;
  projectedNetWorth: number;
}

interface DigitalTwinData {
  monthlyIncome: number;
  monthlyExpense: number;
  monthlySavings: number;
  currentSavings: number;
  currentNetWorth: number;
  projectedSavings: number;
  futureNetWorth: number;
  riskScore: number;
  riskLevel: string;
  currentInvestment: number;
  investmentGrowth: number;
  futureInvestmentValue: number;
  currentEmergencyFund: number;
  recommendedEmergencyFund: number;
  emergencyFundCoverage: number;
  hasFinancialData: boolean;
  timeline: TimelinePoint[];
}

interface SimulationResult {
  monthly_income: number;
  monthly_expense_total: number;
  current_savings: number;
  new_savings: number;
  savings_improvement: number;
  yearly_improvement: number;
}

const scenarios = [
  {
    id: 'save5k',
    label: 'Save ₹5,000 more/mo',
    spendingChange: -5000,
    icon: Target,
  },
  {
    id: 'iphone',
    label: 'Can I afford an iPhone?',
    spendingChange: 5000,
    icon: Wallet,
  },
  {
    id: 'bike',
    label: 'Should I buy a bike?',
    spendingChange: 3000,
    icon: Zap,
  },
  {
    id: 'travel',
    label: 'Can I travel next month?',
    spendingChange: 5000,
    icon: TrendingUp,
  },
  {
    id: 'year',
    label: 'Savings after 1 year?',
    spendingChange: 0,
    icon: TrendingUp,
  },
];

export default function DigitalTwin() {
  const [active, setActive] = useState('save5k');
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [data, setData] = useState<DigitalTwinData | null>(null);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const snapshot = await apiRequest('/api/digital-twin/');
        setData(snapshot as DigitalTwinData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load Digital Twin data'
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const runSim = async (id: string) => {
    const selectedScenario = scenarios.find((scenario) => scenario.id === id);

    if (!selectedScenario) return;

    setSimulating(true);
    setError(null);
    setActive(id);

    try {
      const result = await apiRequest('/api/digital-twin/simulate/', {
        method: 'POST',
        body: JSON.stringify({
          spending_change: selectedScenario.spendingChange,
        }),
      });

      setSimulation(result as SimulationResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to simulate Digital Twin scenario'
      );
    } finally {
      setSimulating(false);
    }
  };

  const activeScenario = scenarios.find(
    (scenario) => scenario.id === active
  );

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass gradient-border rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-purple-600/20 blur-[80px]" />

        <div className="relative flex flex-col lg:flex-row items-center gap-8">
          {/* AI Avatar */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative flex-shrink-0"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-500 flex items-center justify-center glow-purple animate-pulse-glow">
              <Brain className="w-16 h-16 text-white" />
            </div>

            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full glass-strong flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-400" />
            </div>

            <motion.div
              className="absolute inset-0 rounded-full border-2 border-purple-500/30"
              animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <div className="flex-1 text-center lg:text-left">
            <Badge variant="info">
              <Sparkles className="w-3 h-3" /> Hero Feature
            </Badge>

            <h1
              className="text-3xl md:text-4xl font-bold mt-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Meet Your <span className="text-gradient">Financial Twin</span>
            </h1>

            <p
              className="mt-3 text-sm md:text-base max-w-xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              Your AI clone simulates future scenarios in real-time. Ask
              "what if?" and instantly see the impact on your savings.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Scenario selector */}
      <div>
        <p
          className="text-sm font-semibold mb-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          Try a scenario:
        </p>

        <div className="flex flex-wrap gap-2">
          {scenarios.map((s) => (
            <motion.button
              key={s.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => runSim(s.id)}
              disabled={simulating}
              className={`glass rounded-2xl px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition-all ${
                active === s.id ? 'ring-2 ring-blue-500' : ''
              } ${simulating ? 'opacity-70 cursor-wait' : ''}`}
              style={{ color: 'var(--text-primary)' }}
            >
              <s.icon className="w-4 h-4 text-blue-400" />
              {s.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {loading || simulating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass rounded-3xl p-12 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500"
            />

            <p
              className="mt-4 text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Simulating future scenarios...
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {error && (
              <div
                className="glass rounded-3xl p-4"
                style={{ border: '1px solid rgba(239,68,68,0.3)' }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: '#EF4444' }}
                >
                  Digital Twin simulation failed: {error}
                </p>
              </div>
            )}

            {/* Simulation result */}
            {simulation && (
              <div className="glass gradient-border rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-5 h-5 text-blue-400" />
                  <h3
                    className="font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Scenario Result
                  </h3>
                  <Badge variant="info">
                    {activeScenario?.label}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard
                    label="Current Savings"
                    value={simulation.current_savings}
                    icon={<Wallet className="w-5 h-5" />}
                    color="#2563EB"
                    format="inr"
                  />

                  <MetricCard
                    label="New Savings"
                    value={simulation.new_savings}
                    icon={<Target className="w-5 h-5" />}
                    color="#10B981"
                    format="inr"
                  />

                  <MetricCard
                    label="Monthly Improvement"
                    value={simulation.savings_improvement}
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="#7C3AED"
                    format="inr"
                  />

                  <MetricCard
                    label="Yearly Improvement"
                    value={simulation.yearly_improvement}
                    icon={<Zap className="w-5 h-5" />}
                    color="#F59E0B"
                    format="inr"
                  />
                </div>
              </div>
            )}

            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <MetricCard
                label="Projected Savings"
                value={data?.projectedSavings ?? 0}
                icon={<Target className="w-5 h-5" />}
                color="#10B981"
                format="inr"
              />

              <MetricCard
                label="Future Net Worth"
                value={data?.futureNetWorth ?? 0}
                icon={<Wallet className="w-5 h-5" />}
                color="#2563EB"
                format="inr"
              />

              <MetricCard
                label="Risk Score"
                value={data?.riskScore ?? 0}
                secondary={data?.riskLevel}
                icon={<Shield className="w-5 h-5" />}
                color="#F59E0B"
                format="plain"
                suffix="/100"
              />

              <MetricCard
                label="Investment Growth"
                value={data?.investmentGrowth ?? 0}
                icon={<TrendingUp className="w-5 h-5" />}
                color="#7C3AED"
                format="inr"
              />

              <MetricCard
                label="Emergency Fund"
                value={data?.currentEmergencyFund ?? 0}
                secondary={`${formatINR(
                  data?.recommendedEmergencyFund ?? 0,
                  true
                )} recommended · ${(data?.emergencyFundCoverage ?? 0).toFixed(
                  0
                )}% covered`}
                icon={<Shield className="w-5 h-5" />}
                color="#38BDF8"
                format="inr"
              />
            </div>

            {/* Future graph */}
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3
                    className="font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Projected Wealth Timeline
                  </h3>

                  <p
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    12-month forecast based on your current financial data
                  </p>
                </div>

                <Badge variant="info">
                  {data?.riskLevel ?? 'Calculating'}
                </Badge>
              </div>

              {data?.timeline?.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={data.timeline}>
                    <defs>
                      <linearGradient
                        id="twinGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#7C3AED"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="100%"
                          stopColor="#7C3AED"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

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
                      formatter={(v: unknown) => formatINR(Number(v))}
                    />

                    <ReferenceLine
                      y={data.currentNetWorth}
                      stroke="#10B981"
                      strokeDasharray="4 4"
                      label={{
                        value: 'Current',
                        fill: '#10B981',
                        fontSize: 10,
                        position: 'insideTopLeft',
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="projectedNetWorth"
                      stroke="#7C3AED"
                      strokeWidth={3}
                      fill="url(#twinGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <p
                    className="text-sm"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Projection timeline unavailable.
                  </p>
                </div>
              )}
            </div>

            {/* AI explanation */}
            <div className="glass gradient-border rounded-3xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    AI Twin Explanation
                  </span>

                  <Badge variant="info">
                    <Sparkles className="w-3 h-3" /> Analysis
                  </Badge>
                </div>

                {data ? (
                  <p
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {simulation
                      ? `For this scenario, your monthly savings would be ${formatINR(
                          simulation.new_savings
                        )}, compared with your current savings of ${formatINR(
                          simulation.current_savings
                        )}. The estimated yearly improvement is ${formatINR(
                          simulation.yearly_improvement
                        )}.`
                      : data.hasFinancialData
                      ? `Based on your real financial data, average monthly income is ${formatINR(
                          data.monthlyIncome
                        )} and average monthly expenses are ${formatINR(
                          data.monthlyExpense
                        )}. Your projected savings after 12 months is ${formatINR(
                          data.projectedSavings
                        )}.`
                      : 'No transactions are recorded yet. Add income and expense transactions to create a personalized projection.'}
                  </p>
                ) : (
                  <p
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    No Digital Twin data is available yet.
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    icon={<Play className="w-4 h-4" />}
                    onClick={() => runSim(active)}
                  >
                    Apply Scenario
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<RotateCcw className="w-4 h-4" />}
                    onClick={() => runSim(active)}
                  >
                    Re-run
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricCard({
  label,
  value,
  secondary,
  icon,
  color,
  format,
  suffix,
}: {
  label: string;
  value: number;
  secondary?: string;
  icon: React.ReactNode;
  color: string;
  format: 'inr' | 'plain';
  suffix?: string;
}) {
  const display =
    format === 'inr'
      ? formatINR(value, true)
      : `${value}${suffix || ''}`;

  const isNegative = value < 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-4 relative overflow-hidden"
    >
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 blur-xl"
        style={{ background: color }}
      />

      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
        style={{ background: `${color}20`, color }}
      >
        {icon}
      </div>

      <p
        className="text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </p>

      <p
        className={`text-lg font-bold mt-0.5 ${
          isNegative ? 'text-red-400' : ''
        }`}
        style={{
          color: isNegative ? undefined : 'var(--text-primary)',
        }}
      >
        {display}
      </p>

      {secondary && (
        <p
          className="text-[11px] mt-1"
          style={{ color: 'var(--text-muted)' }}
        >
          {secondary}
        </p>
      )}
    </motion.div>
  );
}