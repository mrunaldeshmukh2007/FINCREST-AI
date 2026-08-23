import { motion } from 'framer-motion';
import { Sparkles, Plus, PartyPopper } from 'lucide-react';
import { useState, useEffect } from 'react';
import { goals } from '@/lib/data';
import { formatINR, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

export default function Goals() {
  const [confetti, setConfetti] = useState(false);
  const completedGoal = goals.find(g => (g.saved / g.target) >= 0.8 && (g.saved / g.target) < 1);

  useEffect(() => {
    if (completedGoal) {
      const t = setTimeout(() => setConfetti(true), 1000);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <div className="space-y-6 relative">
      {confetti && <Confetti />}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Savings Goals</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Track and accelerate your journey to every financial milestone.</p>
        </div>
        <Button size="sm" icon={<Plus className="w-4 h-4" />}>New Goal</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((g, i) => {
          const pct = Math.round((g.saved / g.target) * 100);
          const circumference = 2 * Math.PI * 52;
          const offset = circumference - (pct / 100) * circumference;
          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass rounded-3xl p-6 relative overflow-hidden group"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity" style={{ background: g.color }} />
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: `${g.color}20` }}>{g.icon}</div>
                {pct >= 80 && <Badge variant="success"><PartyPopper className="w-3 h-3" /> Almost there!</Badge>}
              </div>

              <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{g.name}</h3>

              {/* Circular progress */}
              <div className="flex justify-center my-4 relative">
                <svg width="120" height="120" className="-rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="8" />
                  <motion.circle
                    cx="60" cy="60" r="52" fill="none" stroke={g.color} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, delay: i * 0.08, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{pct}%</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>complete</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Saved</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{formatINR(g.saved, true)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Target</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{formatINR(g.target, true)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Monthly</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{formatINR(g.monthlyContribution, true)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>AI Predicted</span>
                  <span className="text-emerald-400 font-medium">{formatDate(g.predictedDate)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex items-start gap-2" style={{ borderColor: 'var(--border)' }}>
                <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{g.aiSuggestion}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Confetti() {
  const colors = ['#2563EB', '#7C3AED', '#10B981', '#38BDF8', '#F59E0B', '#EF4444'];
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
