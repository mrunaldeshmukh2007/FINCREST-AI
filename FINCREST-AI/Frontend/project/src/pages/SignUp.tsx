import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Lock, User, Phone, Globe, Coins, Eye, EyeOff, ArrowRight, Check, Sparkles, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => navigate('/onboarding'), 2200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute top-6 right-6"><ThemeToggle /></div>
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-strong rounded-3xl p-10 text-center max-w-sm">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <PartyPopper className="w-10 h-10 text-emerald-400" />
              </motion.div>
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Welcome to FinCrest!</h3>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Your account is ready. Let's set up your financial twin.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-lg">
        <Link to="/" className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>FinCrest<span className="text-gradient"> AI</span></span>
        </Link>

        <div className="glass gradient-border rounded-3xl p-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Create your account</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Start your journey to financial freedom today.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field icon={<User className="w-4 h-4" />} label="Full Name" placeholder="Arjun Sharma" type="text" />
              <Field icon={<Mail className="w-4 h-4" />} label="Email" placeholder="you@example.com" type="email" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
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
              <Field icon={<Lock className="w-4 h-4" />} label="Confirm Password" placeholder="••••••••" type="password" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field icon={<Phone className="w-4 h-4" />} label="Phone" placeholder="+91 98765 43210" type="tel" />
              <SelectField icon={<Globe className="w-4 h-4" />} label="Country" options={['India', 'United States', 'United Kingdom', 'Singapore', 'UAE']} />
            </div>
            <SelectField icon={<Coins className="w-4 h-4" />} label="Preferred Currency" options={['₹ INR (Indian Rupee)', '$ USD (US Dollar)', '€ EUR (Euro)', '£ GBP (Pound Sterling)']} />

            <label className="flex items-start gap-2.5 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
              <input type="checkbox" required className="mt-0.5 rounded accent-blue-600" />
              <span>I accept the <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a></span>
            </label>

            <Button type="submit" className="w-full" size="lg" icon={<ArrowRight className="w-4 h-4" />}>Create Account</Button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/signin" className="font-semibold text-blue-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ icon, label, placeholder, type }: { icon: React.ReactNode; label: string; placeholder: string; type: string }) {
  return (
    <div>
      <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <div className="relative mt-1.5">
        <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>{icon}</div>
        <input type={type} placeholder={placeholder} required className="w-full glass rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" style={{ color: 'var(--text-primary)' }} />
      </div>
    </div>
  );
}

function SelectField({ icon, label, options }: { icon: React.ReactNode; label: string; options: string[] }) {
  return (
    <div>
      <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <div className="relative mt-1.5">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }}>{icon}</div>
        <select className="w-full glass rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer" style={{ color: 'var(--text-primary)' }}>
          {options.map((opt) => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
        </select>
      </div>
    </div>
  );
}
