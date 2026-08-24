import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Mail, ArrowRight, KeyRound, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

type Step = 'email' | 'otp' | 'reset' | 'success';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute top-6 right-6"><ThemeToggle /></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>FinCrest<span className="text-gradient"> AI</span></span>
        </Link>

        <div className="glass gradient-border rounded-3xl p-8">
          <AnimatePresence mode="wait">
            {step === 'email' && (
              <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4"><Mail className="w-7 h-7 text-blue-400" /></div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Forgot password?</h1>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Enter your email and we'll send you an OTP to reset your password.</p>
                <form onSubmit={(e) => { e.preventDefault(); setStep('otp'); }} className="mt-6 space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <input type="email" placeholder="you@example.com" required className="w-full glass rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <Button type="submit" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>Send OTP</Button>
                </form>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4"><KeyRound className="w-7 h-7 text-purple-400" /></div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Enter OTP</h1>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>We sent a 6-digit code to your email.</p>
                <form onSubmit={(e) => { e.preventDefault(); setStep('reset'); }} className="mt-6 space-y-4">
                  <div className="flex gap-2 justify-between">
                    {[...Array(6)].map((_, i) => (
                      <input key={i} maxLength={1} inputMode="numeric" className="w-12 h-14 glass rounded-2xl text-center text-xl font-bold outline-none focus:ring-2 focus:ring-blue-500/50" style={{ color: 'var(--text-primary)' }} />
                    ))}
                  </div>
                  <Button type="submit" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>Verify OTP</Button>
                  <button type="button" className="w-full text-sm text-blue-400 hover:underline">Resend code</button>
                </form>
              </motion.div>
            )}

            {step === 'reset' && (
              <motion.div key="reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4"><ShieldCheck className="w-7 h-7 text-emerald-400" /></div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Reset password</h1>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Choose a strong new password for your account.</p>
                <form onSubmit={(e) => { e.preventDefault(); setStep('success'); }} className="mt-6 space-y-4">
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <input type="password" placeholder="New password" required className="w-full glass rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <input type="password" placeholder="Confirm new password" required className="w-full glass rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <Button type="submit" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>Reset Password</Button>
                </form>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-emerald-400" />
                </motion.div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Password reset!</h1>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Your password has been updated successfully.</p>
                <div className="mt-6">
                  <Button onClick={() => navigate('/signin')} icon={<ArrowRight className="w-4 h-4" />}>Back to Sign In</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {step !== 'success' && (
            <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
              Remember your password? <Link to="/signin" className="font-semibold text-blue-400 hover:underline">Sign in</Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
