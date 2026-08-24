import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, TrendingUp, Bot, Sparkles, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-950 to-purple-950 items-center justify-center p-12">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-600/30 blur-[100px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-purple-600/30 blur-[100px] animate-blob-slow" />

        <div className="relative z-10 max-w-md text-white">
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">FinCrest<span className="text-gradient"> AI</span></span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl font-bold leading-tight">Welcome back to<br />your <span className="text-gradient">financial twin</span></h2>
            <p className="mt-4 text-slate-400">Your AI has been analyzing your spending while you were away. Let's see what it found.</p>
          </motion.div>

          {/* Floating dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 glass-strong rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-emerald-400" /></div>
                <span className="text-sm text-slate-300">Total Balance</span>
              </div>
              <span className="text-xs text-emerald-400">+12.4%</span>
            </div>
            <p className="text-3xl font-bold">₹4,82,350</p>
            <div className="mt-4 flex gap-2">
              {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                <motion.div key={i} initial={{ height: 0 }} animate={{ height: h }} transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }} className="flex-1 rounded-t bg-gradient-to-t from-blue-600 to-purple-500" style={{ height: h }} />
              ))}
            </div>
          </motion.div>

          <div className="mt-6 flex items-center gap-3">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-14 h-14 rounded-2xl glass flex items-center justify-center">
              <Bot className="w-7 h-7 text-blue-400" />
            </motion.div>
            <div className="glass rounded-2xl px-4 py-2.5">
              <p className="text-sm text-slate-300">You saved ₹3,200 this week! 🎉</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-6 right-6"><ThemeToggle /></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>FinCrest AI</span>
          </Link>

          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Sign in</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Welcome back! Please enter your details.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input type="email" placeholder="you@example.com" required className="w-full glass rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" style={{ color: 'var(--text-primary)' }} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" required className="w-full glass rounded-2xl pl-10 pr-10 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" style={{ color: 'var(--text-primary)' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                <input type="checkbox" className="rounded accent-blue-600" /> Remember me
              </label>
              <Link to="/forgot-password" className="font-semibold text-blue-400 hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" className="w-full" size="lg" icon={<ArrowRight className="w-4 h-4" />}>Sign In</Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>OR</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="glass rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors" style={{ color: 'var(--text-primary)' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="glass rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors" style={{ color: 'var(--text-primary)' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.81 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.37 1.23-3.21-.12-.3-.54-1.515.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.635.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.21 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </button>
          </div>

          <p className="mt-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/signup" className="font-semibold text-blue-400 hover:underline">Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
