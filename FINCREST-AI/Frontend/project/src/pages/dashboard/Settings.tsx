import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Palette, Coins, Globe, Bell, Shield, Key, Lock, Eye, EyeOff,
  Building2, Trash2, Check, ChevronRight,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Badge } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [notif, setNotif] = useState({ budget: true, goals: true, ai: true, bills: true, fraud: true });
  const [showPassword, setShowPassword] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your account, preferences, and security.</p>
      </div>

      {/* Appearance */}
      <Section icon={<Palette className="w-5 h-5" />} title="Appearance">
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Theme</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Switch between light and dark mode</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => theme === 'dark' && toggleTheme()} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${theme === 'light' ? 'btn-primary' : 'glass'}`} style={theme === 'light' ? {} : { color: 'var(--text-secondary)' }}>☀ Light</button>
            <button onClick={() => theme === 'light' && toggleTheme()} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${theme === 'dark' ? 'btn-primary' : 'glass'}`} style={theme === 'dark' ? {} : { color: 'var(--text-secondary)' }}>🌙 Dark</button>
          </div>
        </div>
      </Section>

      {/* Preferences */}
      <Section icon={<Globe className="w-5 h-5" />} title="Preferences">
        <Row label="Currency" value="₹ INR (Indian Rupee)" />
        <Row label="Language" value="English (India)" />
        <Row label="Date Format" value="DD/MM/YYYY" />
      </Section>

      {/* Notifications */}
      <Section icon={<Bell className="w-5 h-5" />} title="Notifications">
        {[
          { key: 'budget', label: 'Budget alerts', desc: 'Notify when budget exceeds 80%' },
          { key: 'goals', label: 'Goal updates', desc: 'Progress and completion alerts' },
          { key: 'ai', label: 'AI recommendations', desc: 'Smart insights and suggestions' },
          { key: 'bills', label: 'Bill reminders', desc: 'Upcoming bill due dates' },
          { key: 'fraud', label: 'Fraud alerts', desc: 'Suspicious transaction detection' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
            <button
              onClick={() => setNotif(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
              className={`w-12 h-6 rounded-full transition-colors relative ${notif[item.key as keyof typeof notif] ? 'bg-blue-600' : 'bg-slate-600/30'}`}
            >
              <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white" animate={{ left: notif[item.key as keyof typeof notif] ? '26px' : '2px' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
            </button>
          </div>
        ))}
      </Section>

      {/* Security */}
      <Section icon={<Shield className="w-5 h-5" />} title="Security">
        <div className="py-3">
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Change Password</p>
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input type={showPassword ? 'text' : 'password'} placeholder="Current password" className="w-full glass rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" style={{ color: 'var(--text-primary)' }} />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            <input type="password" placeholder="New password" className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" style={{ color: 'var(--text-primary)' }} />
            <Button size="sm" icon={<Key className="w-4 h-4" />}>Update Password</Button>
          </div>
        </div>
        <div className="flex items-center justify-between py-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Two-Factor Authentication</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Add an extra layer of security</p>
          </div>
          <button onClick={() => setTwoFA(!twoFA)} className={`w-12 h-6 rounded-full transition-colors relative ${twoFA ? 'bg-blue-600' : 'bg-slate-600/30'}`}>
            <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white" animate={{ left: twoFA ? '26px' : '2px' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
          </button>
        </div>
        {twoFA && <Badge variant="success"><Check className="w-3 h-3" /> 2FA Enabled</Badge>}
      </Section>

      {/* Connected Banks */}
      <Section icon={<Building2 className="w-5 h-5" />} title="Connected Banks">
        {['HDFC Bank', 'ICICI Bank', 'Zerodha'].map((bank) => (
          <div key={bank} className="flex items-center justify-between py-3">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{bank}</span>
            <button className="text-sm text-red-400 hover:underline">Disconnect</button>
          </div>
        ))}
        <button className="flex items-center gap-2 text-sm text-blue-400 hover:underline py-2"><ChevronRight className="w-4 h-4" /> Connect new bank</button>
      </Section>

      {/* Danger zone */}
      <Section icon={<Trash2 className="w-5 h-5 text-red-400" />} title="Danger Zone" danger>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Delete Account</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Permanently delete your account and all data</p>
          </div>
          <Button variant="outline" size="sm" className="text-red-400 border-red-500/30 hover:bg-red-500/10">Delete Account</Button>
        </div>
      </Section>
    </div>
  );
}

function Section({ icon, title, children, danger }: { icon: React.ReactNode; title: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass rounded-3xl p-6 ${danger ? 'border-red-500/20' : ''}`}>
      <div className="flex items-center gap-2 mb-2 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${danger ? 'bg-red-500/10' : 'bg-blue-500/10'}`}>{icon}</div>
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{value}</span>
        <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
      </div>
    </div>
  );
}
