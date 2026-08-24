import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Sparkles, Wallet, TrendingDown, Target, Trophy, Check, ArrowRight, ArrowLeft, Home, Car, Plane, Shield, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { formatINR } from '@/lib/utils';

const steps = ['Welcome', 'Income', 'Expenses', 'Savings', 'Goal', 'Finish'];
const goalOptions = [
  { name: 'Vacation', icon: Plane, color: '#38BDF8' },
  { name: 'House', icon: Home, color: '#2563EB' },
  { name: 'Car', icon: Car, color: '#F59E0B' },
  { name: 'Emergency Fund', icon: Shield, color: '#10B981' },
  { name: 'Retirement', icon: Briefcase, color: '#7C3AED' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [savings, setSavings] = useState('');
  const [goal, setGoal] = useState<string | null>(null);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const finish = () => navigate('/app');

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute top-6 right-6"><ThemeToggle /></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>FinCrest<span className="text-gradient"> AI</span></span>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((s, i) => (
              <span key={s} className={`text-xs font-medium transition-colors ${i <= step ? 'text-blue-400' : ''}`} style={{ color: i <= step ? undefined : 'var(--text-muted)' }}>{s}</span>
            ))}
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>

        <div className="glass gradient-border rounded-3xl p-8 min-h-[340px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="welcome" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col items-center justify-center text-center">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-6 glow-purple">
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Welcome to FinCrest AI!</h2>
                <p className="mt-3 text-sm max-w-sm" style={{ color: 'var(--text-secondary)' }}>Let's set up your financial twin. This takes less than 2 minutes and helps our AI understand your money habits.</p>
              </motion.div>
            )}

            {step === 1 && (
              <StepWrapper key="income" icon={<Wallet className="w-7 h-7 text-blue-400" />} title="What's your monthly income?" subtitle="Include salary, freelance, and any other regular income.">
                <CurrencyInput value={income} onChange={setIncome} placeholder="e.g. 1,50,000" />
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>This stays private. We use it to personalize your insights.</p>
              </StepWrapper>
            )}

            {step === 2 && (
              <StepWrapper key="expenses" icon={<TrendingDown className="w-7 h-7 text-red-400" />} title="Estimated monthly expenses?" subtitle="Rent, food, transport, bills — your best guess is fine.">
                <CurrencyInput value={expenses} onChange={setExpenses} placeholder="e.g. 80,000" />
              </StepWrapper>
            )}

            {step === 3 && (
              <StepWrapper key="savings" icon={<Target className="w-7 h-7 text-emerald-400" />} title="Monthly savings target?" subtitle="How much do you want to save each month?">
                <CurrencyInput value={savings} onChange={setSavings} placeholder="e.g. 50,000" />
                {income && savings && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-emerald-400">
                    That's {((Number(savings.replace(/,/g, '')) / Number(income.replace(/,/g, ''))) * 100).toFixed(0)}% of your income. Great target!
                  </motion.p>
                )}
              </StepWrapper>
            )}

            {step === 4 && (
              <StepWrapper key="goal" icon={<Trophy className="w-7 h-7 text-amber-400" />} title="What's your main financial goal?" subtitle="Pick one — you can add more later.">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {goalOptions.map((g) => (
                    <motion.button
                      key={g.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setGoal(g.name)}
                      className={`glass rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${goal === g.name ? 'ring-2' : ''}`}
                      style={goal === g.name ? { boxShadow: `0 0 20px ${g.color}40`, borderColor: g.color } : {}}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${g.color}20` }}>
                        <g.icon className="w-5 h-5" style={{ color: g.color }} />
                      </div>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{g.name}</span>
                    </motion.button>
                  ))}
                </div>
              </StepWrapper>
            )}

            {step === 5 && (
              <motion.div key="finish" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                  <Check className="w-10 h-10 text-emerald-400" />
                </motion.div>
                <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>You're all set!</h2>
                <p className="mt-3 text-sm max-w-sm" style={{ color: 'var(--text-secondary)' }}>
                  Your AI financial twin is ready. {income && `Based on ₹${income}/mo income`} {goal && `and your ${goal.toLowerCase()} goal`}, we've personalized your dashboard.
                </p>
                <div className="mt-6 glass rounded-2xl p-4 w-full max-w-xs">
                  <div className="flex justify-between text-sm mb-1"><span style={{ color: 'var(--text-muted)' }}>Predicted AI Health Score</span></div>
                  <p className="text-3xl font-bold text-gradient">82/100</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            {step > 0 && step < 5 ? (
              <Button variant="ghost" onClick={back} icon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
            ) : <div />}
            {step < 5 ? (
              <Button onClick={next} icon={<ArrowRight className="w-4 h-4" />}>{step === 0 ? 'Get Started' : 'Continue'}</Button>
            ) : (
              <Button onClick={finish} icon={<ArrowRight className="w-4 h-4" />}>Enter Dashboard</Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StepWrapper({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
      <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-4">{icon}</div>
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      <p className="mt-2 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
      {children}
    </motion.div>
  );
}

function CurrencyInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold" style={{ color: 'var(--text-muted)' }}>₹</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9,]/g, ''))}
        placeholder={placeholder}
        className="w-full glass rounded-2xl pl-9 pr-4 py-3.5 text-lg font-semibold outline-none focus:ring-2 focus:ring-blue-500/50"
        style={{ color: 'var(--text-primary)' }}
      />
    </div>
  );
}
