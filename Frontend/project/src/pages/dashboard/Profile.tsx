import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Trophy, Flame, Target, TrendingUp, Sparkles, Award,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { Badge } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { apiRequest } from '@/lib/api';

type ApiGoal = {
  id: number;
  name: string;
  target_amount: string | number;
  saved_amount: string | number;
  monthly_contribution: string | number;
  target_date: string | null;
  created_at: string;
};

export default function Profile() {
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, balance: 0 });
  const [goals, setGoals] = useState<ApiGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('Unavailable');
  const [userEmail, setUserEmail] = useState('Unavailable');
  const [healthScore, setHealthScore] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        setUserName(localStorage.getItem('user_name') || 'Unavailable');
        setUserEmail(localStorage.getItem('user_email') || 'Unavailable');

        const [summaryData, goalData, digitalTwinData] = await Promise.all([
          apiRequest('/api/transactions/summary/'),
          apiRequest('/api/savings-goals/'),
          apiRequest('/api/digital-twin/'),
        ]);

        if (cancelled) return;

        setSummary({
          total_income: Number(summaryData.total_income),
          total_expense: Number(summaryData.total_expense),
          balance: Number(summaryData.balance),
        });
        setHealthScore(
          digitalTwinData.healthScore !== undefined
            ? Number(digitalTwinData.healthScore)
            : null
        );

        const apiGoals: ApiGoal[] = goalData.savings_goals ?? goalData;
        setGoals(apiGoals);
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

  const completedGoals = goals.filter((g) => Number(g.saved_amount) >= Number(g.target_amount)).length;
  const currentGoal = goals.find((g) => Number(g.saved_amount) < Number(g.target_amount));

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass gradient-border rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-600/20 blur-[80px]" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-4xl font-bold text-white glow-purple">{userName !== 'Unavailable' ? userName.charAt(0).toUpperCase() : '?'}</div>
            <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full glass-strong flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{userName}</h1>
              <Badge variant="info"><Sparkles className="w-3 h-3" /> Pro Member</Badge>
            </div>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{userEmail}</p>
            <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Score</span>
                <span className="font-bold text-gradient-emerald">{healthScore !== null ? `${healthScore}/100` : 'Unavailable'}</span>
              </div>
              <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Streak</span>
                <span className="font-bold text-orange-400">Unavailable</span>
              </div>
              <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Current Goal</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{currentGoal ? currentGoal.name : 'Unavailable'}</span>
              </div>
            </div>
          </div>
          <Button variant="secondary" size="sm">Edit Profile</Button>
        </div>
      </motion.div>

      {loading && (
        <div className="glass rounded-3xl p-12 flex items-center justify-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading profile...</p>
        </div>
      )}

      {error && (
        <div className="glass rounded-3xl p-6" style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
          <p className="text-sm font-medium" style={{ color: '#EF4444' }}>Unable to load data: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Saved', value: summary.balance, icon: Target, color: '#10B981' },
              { label: 'Goals Completed', value: completedGoals, icon: Trophy, color: '#F59E0B' },
              { label: 'Achievements', value: 'Unavailable', icon: Award, color: '#7C3AED' },
              { label: 'Days Active', value: 'Unavailable', icon: Flame, color: '#EF4444' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${stat.color}20`, color: stat.color }}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                <p className="text-xl font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>{typeof stat.value === 'number' && stat.value > 100 ? formatINR(stat.value, true) : stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Achievements */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Achievements & Badges</h3>
            <div className="flex items-center justify-center py-8">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No achievements available yet.</p>
            </div>
          </motion.div>

          {/* Connected accounts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Connected Accounts</h3>
            <div className="flex items-center justify-center py-8">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No connected accounts available yet.</p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}