import { motion } from 'framer-motion';
import {
  TrendingDown, TrendingUp, Calendar, Sparkles, Lightbulb, AlertTriangle, CheckCircle2, Info,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { insights, savingsGrowth, spendingHeatmap } from '@/lib/data';
import { formatINR } from '@/lib/utils';
import { Badge } from '@/components/ui/SectionHeading';

const insightIcons = { warning: AlertTriangle, success: CheckCircle2, info: Info };

export default function Insights() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Insights</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>AI-powered analytics that reveal what's happening with your money.</p>
      </div>

      {/* Insight cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, i) => {
          const Icon = insightIcons[insight.type as keyof typeof insightIcons] || Lightbulb;
          const colors = { warning: '#F59E0B', success: '#22C55E', info: '#38BDF8' };
          const color = colors[insight.type as keyof typeof colors];
          return (
            <motion.div
              key={i}
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
                    <span className="text-2xl">{insight.icon}</span>
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
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Savings vs Investments over 7 months</p>
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
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-6">
          <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Weekend vs Weekday Spending</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Average daily spend pattern</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[
              { day: 'Mon', weekday: 3200, weekend: 0 },
              { day: 'Tue', weekday: 2800, weekend: 0 },
              { day: 'Wed', weekday: 3500, weekend: 0 },
              { day: 'Thu', weekday: 3100, weekend: 0 },
              { day: 'Fri', weekday: 4200, weekend: 0 },
              { day: 'Sat', weekday: 0, weekend: 6800 },
              { day: 'Sun', weekday: 0, weekend: 5400 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="day" stroke="rgba(148,163,184,0.5)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(148,163,184,0.5)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatINR(v, true)} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(v: any) => formatINR(Number(v))} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
              <Bar dataKey="weekday" stackId="a" fill="#2563EB" radius={[6,6,0,0]} />
              <Bar dataKey="weekend" stackId="a" fill="#7C3AED" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Spending heatmap */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6">
        <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Spending Heatmap</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>When you spend most — darker = more active</p>
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {spendingHeatmap.map((day, di) => (
              <div key={di} className="flex flex-col gap-1">
                {day.map((intensity, hi) => (
                  <div key={hi} className="w-4 h-4 rounded-sm" style={{ background: `rgba(37, 99, 235, ${intensity / 100})` }} title={`${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][di]} ${hi}:00 — ${intensity}%`} />
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span>
          </div>
        </div>
      </motion.div>

      {/* AI summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass gradient-border rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Weekly AI Summary</h3>
          <Badge variant="info">Auto-generated</Badge>
        </div>
        <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <p>📊 You spent <strong className="text-red-400">{formatINR(38400)}</strong> this week — 8% less than last week. Great progress!</p>
          <p>🍽️ Food delivery remains your top category at <strong>{formatINR(8420)}</strong>. Consider meal prep to cut this by 40%.</p>
          <p>📈 Your savings rate improved to <strong className="text-emerald-400">38%</strong> — well above the recommended 20%.</p>
          <p>💡 Potential savings identified: <strong className="text-emerald-400">{formatINR(4800)}</strong>/month from 3 unused subscriptions.</p>
        </div>
      </motion.div>
    </div>
  );
}
