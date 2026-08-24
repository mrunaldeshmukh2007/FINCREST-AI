import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Brain, Sparkles, TrendingUp, Shield, Wallet, Target, Zap,
  Play, RotateCcw, Bot, ArrowRight,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';
import { Badge } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/utils';

const scenarios = [
  { id: 'save5k', label: 'Save ₹5,000 more/mo', icon: Target },
  { id: 'iphone', label: 'Can I afford an iPhone?', icon: Wallet },
  { id: 'bike', label: 'Should I buy a bike?', icon: Zap },
  { id: 'travel', label: 'Can I travel next month?', icon: TrendingUp },
  { id: 'year', label: 'Savings after 1 year?', icon: TrendingUp },
];

const projections: Record<string, { savings: number; netWorth: number; risk: number; growth: number; emergency: number; data: any[]; explanation: string }> = {
  save5k: {
    savings: 60000, netWorth: 1048000, risk: 22, growth: 180000, emergency: 300000,
    data: [{ month: 'Now', value: 388000 }, { month: 'M2', value: 398000 }, { month: 'M4', value: 408000 }, { month: 'M6', value: 418000 }, { month: 'M8', value: 428000 }, { month: 'M10', value: 438000 }, { month: 'M12', value: 448000 }],
    explanation: 'Saving an extra ₹5,000/month adds ₹60,000 to your annual savings. Compounded in index funds at 12%, this becomes ₹1.04L over 10 years. Your emergency fund hits target 4 months earlier.',
  },
  iphone: {
    savings: -79900, netWorth: 828000, risk: 45, growth: 120000, emergency: 240000,
    data: [{ month: 'Now', value: 388000 }, { month: 'M2', value: 370000 }, { month: 'M4', value: 365000 }, { month: 'M6', value: 360000 }, { month: 'M8', value: 355000 }, { month: 'M10', value: 350000 }, { month: 'M12', value: 345000 }],
    explanation: 'An iPhone (₹79,900) would reduce your savings by 20% and delay your emergency fund by 3 months. Risk score rises to 45. Consider EMI at ₹6,658/mo for 12 months to spread impact, or wait for Big Billion Days (avg 15% off).',
  },
  bike: {
    savings: -25000, netWorth: 920000, risk: 38, growth: 140000, emergency: 260000,
    data: [{ month: 'Now', value: 388000 }, { month: 'M2', value: 378000 }, { month: 'M4', value: 380000 }, { month: 'M6', value: 382000 }, { month: 'M8', value: 384000 }, { month: 'M10', value: 386000 }, { month: 'M12', value: 388000 }],
    explanation: 'A bike at ₹1.2L with ₹25K down payment is affordable. Monthly EMI ₹2,800 fits your budget. However, fuel + maintenance adds ₹3,500/mo. Net impact: neutral after 8 months. Consider an EV for 40% lower running costs.',
  },
  travel: {
    savings: -15000, netWorth: 950000, risk: 30, growth: 155000, emergency: 270000,
    data: [{ month: 'Now', value: 388000 }, { month: 'M2', value: 380000 }, { month: 'M4', value: 385000 }, { month: 'M6', value: 390000 }, { month: 'M8', value: 395000 }, { month: 'M10', value: 400000 }, { month: 'M12', value: 405000 }],
    explanation: 'A ₹15,000 trip is well within budget. Your savings rate (38%) is healthy. Book flights 45 days early for 22% savings. Travel won\'t impact your emergency fund timeline. Go for it!',
  },
  year: {
    savings: 88000, netWorth: 1056000, risk: 18, growth: 195000, emergency: 300000,
    data: [{ month: 'Now', value: 388000 }, { month: 'M2', value: 402000 }, { month: 'M4', value: 416000 }, { month: 'M6', value: 430000 }, { month: 'M8', value: 444000 }, { month: 'M10', value: 458000 }, { month: 'M12', value: 476000 }],
    explanation: 'At your current savings rate (₹88K/yr) plus investment growth (12%), your net worth reaches ₹10.56L in 12 months. Emergency fund completes in 5 months. Excellent trajectory!',
  },
};

export default function DigitalTwin() {
  const [active, setActive] = useState('save5k');
  const [simulating, setSimulating] = useState(false);
  const proj = projections[active];

  const runSim = (id: string) => {
    setSimulating(true);
    setTimeout(() => { setActive(id); setSimulating(false); }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass gradient-border rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-purple-600/20 blur-[80px]" />
        <div className="relative flex flex-col lg:flex-row items-center gap-8">
          {/* AI Avatar */}
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="relative flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-500 flex items-center justify-center glow-purple animate-pulse-glow">
              <Brain className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full glass-strong flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-400" />
            </div>
            <motion.div className="absolute inset-0 rounded-full border-2 border-purple-500/30" animate={{ scale: [1, 1.3], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          </motion.div>

          <div className="flex-1 text-center lg:text-left">
            <Badge variant="info"><Sparkles className="w-3 h-3" /> Hero Feature</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mt-3" style={{ color: 'var(--text-primary)' }}>Meet Your <span className="text-gradient">Financial Twin</span></h1>
            <p className="mt-3 text-sm md:text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>Your AI clone simulates thousands of future scenarios in real-time. Ask "what if?" and instantly see the impact on your wealth, risk, and goals.</p>
          </div>
        </div>
      </motion.div>

      {/* Scenario selector */}
      <div>
        <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Try a scenario:</p>
        <div className="flex flex-wrap gap-2">
          {scenarios.map((s) => (
            <motion.button
              key={s.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => runSim(s.id)}
              className={`glass rounded-2xl px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition-all ${active === s.id ? 'ring-2 ring-blue-500' : ''}`}
              style={{ color: 'var(--text-primary)' }}
            >
              <s.icon className="w-4 h-4 text-blue-400" /> {s.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {simulating ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-3xl p-12 flex flex-col items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500" />
            <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>Simulating future scenarios...</p>
          </motion.div>
        ) : (
          <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <MetricCard label="Projected Savings" value={proj.savings} icon={<Target className="w-5 h-5" />} color="#10B981" format="inr" />
              <MetricCard label="Future Net Worth" value={proj.netWorth} icon={<Wallet className="w-5 h-5" />} color="#2563EB" format="inr" />
              <MetricCard label="Risk Score" value={proj.risk} icon={<Shield className="w-5 h-5" />} color="#F59E0B" format="plain" suffix="/100" />
              <MetricCard label="Investment Growth" value={proj.growth} icon={<TrendingUp className="w-5 h-5" />} color="#7C3AED" format="inr" />
              <MetricCard label="Emergency Fund" value={proj.emergency} icon={<Shield className="w-5 h-5" />} color="#38BDF8" format="inr" />
            </div>

            {/* Future graph */}
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Projected Wealth Timeline</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>12-month forecast based on this scenario</p>
                </div>
                <Badge variant={proj.risk < 30 ? 'success' : proj.risk < 50 ? 'warning' : 'danger'}>
                  {proj.risk < 30 ? 'Low Risk' : proj.risk < 50 ? 'Moderate Risk' : 'High Risk'}
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={proj.data}>
                  <defs>
                    <linearGradient id="twinGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(148,163,184,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(148,163,184,0.5)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatINR(v, true)} />
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(v: any) => formatINR(Number(v))} />
                  <ReferenceLine y={388000} stroke="#10B981" strokeDasharray="4 4" label={{ value: 'Current', fill: '#10B981', fontSize: 10, position: 'insideTopLeft' }} />
                  <Area type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={3} fill="url(#twinGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* AI explanation */}
            <div className="glass gradient-border rounded-3xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>AI Twin Explanation</span>
                  <Badge variant="info"><Sparkles className="w-3 h-3" /> Analysis</Badge>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{proj.explanation}</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" icon={<Play className="w-4 h-4" />}>Apply Scenario</Button>
                  <Button size="sm" variant="secondary" icon={<RotateCcw className="w-4 h-4" />} onClick={() => runSim(active)}>Re-run</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricCard({ label, value, icon, color, format, suffix }: { label: string; value: number; icon: React.ReactNode; color: string; format: 'inr' | 'plain'; suffix?: string }) {
  const display = format === 'inr' ? formatINR(value, true) : `${value}${suffix || ''}`;
  const isNegative = value < 0;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-4 relative overflow-hidden">
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 blur-xl" style={{ background: color }} />
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: `${color}20`, color }}>{icon}</div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className={`text-lg font-bold mt-0.5 ${isNegative ? 'text-red-400' : ''}`} style={{ color: isNegative ? undefined : 'var(--text-primary)' }}>{isNegative && format === 'inr' ? '' : ''}{display}</p>
    </motion.div>
  );
}
