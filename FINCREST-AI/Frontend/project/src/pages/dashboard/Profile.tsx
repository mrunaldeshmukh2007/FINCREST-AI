import { motion } from 'framer-motion';
import {
  Trophy, Flame, Target, TrendingUp, CreditCard, Sparkles, Award, Lock,
} from 'lucide-react';
import { achievements } from '@/lib/data';
import { formatINR } from '@/lib/utils';
import { Badge } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

export default function Profile() {
  return (
    <div className="space-y-6">
      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass gradient-border rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-600/20 blur-[80px]" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-4xl font-bold text-white glow-purple">AS</div>
            <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full glass-strong flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Arjun Sharma</h1>
              <Badge variant="info"><Sparkles className="w-3 h-3" /> Pro Member</Badge>
            </div>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>arjun.sharma@example.com · Bangalore, India</p>
            <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Score</span>
                <span className="font-bold text-gradient-emerald">84</span>
              </div>
              <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Streak</span>
                <span className="font-bold text-orange-400">47 days</span>
              </div>
              <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Current Goal</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Europe Tour</span>
              </div>
            </div>
          </div>
          <Button variant="secondary" size="sm">Edit Profile</Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Saved', value: 388000, icon: Target, color: '#10B981' },
          { label: 'Goals Completed', value: 3, icon: Trophy, color: '#F59E0B' },
          { label: 'Achievements', value: 5, icon: Award, color: '#7C3AED' },
          { label: 'Days Active', value: 184, icon: Flame, color: '#EF4444' },
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {achievements.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className={`glass rounded-2xl p-4 text-center ${!a.earned ? 'opacity-40' : ''}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-2 text-2xl ${a.earned ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20' : 'bg-slate-500/10'}`}>
                {a.earned ? a.icon : <Lock className="w-6 h-6 text-slate-500" />}
              </div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{a.name}</p>
              {a.earned && a.date && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{new Date(a.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Connected accounts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Connected Accounts</h3>
        <div className="space-y-3">
          {[
            { name: 'HDFC Savings Account', type: 'Bank', status: 'Connected', color: '#2563EB' },
            { name: 'ICICI Credit Card', type: 'Card', status: 'Connected', color: '#F59E0B' },
            { name: 'Zerodha Demat', type: 'Investment', status: 'Connected', color: '#10B981' },
            { name: 'Paytm Wallet', type: 'Wallet', status: 'Connected', color: '#7C3AED' },
          ].map((acc, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl glass">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${acc.color}20`, color: acc.color }}>
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{acc.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{acc.type}</p>
              </div>
              <Badge variant="success">{acc.status}</Badge>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
