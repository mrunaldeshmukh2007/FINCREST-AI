import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, TrendingUp, Wallet, Brain, ScanLine, Bot, BarChart3,
  Target, PiggyBank, LineChart, ShieldAlert, Mic, BellRing,
  FileText, LayoutDashboard, Search, Menu, X, ArrowRight,
  Play, Check, Star, Cpu, Zap, Globe, Lock, Mail, Phone, MapPin,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { SectionHeading, Badge } from '@/components/ui/SectionHeading';
import { useCountUp, formatINR } from '@/lib/utils';

const features = [
  { icon: Wallet, title: 'AI Expense Tracking', desc: 'Continuously learns your spending behavior and automatically classifies every transaction with AI-powered accuracy.', color: '#2563EB' },
  { icon: PiggyBank, title: 'Budget Planner', desc: 'Creates adaptive budgets that evolve with your lifestyle instead of fixed spending limits.', color: '#7C3AED' },
  { icon: Brain, title: 'Digital Twin', desc: 'Simulate your financial future with a virtual clone of your finances.', color: '#10B981' },
  { icon: ScanLine, title: 'Receipt Scanner', desc: 'OCR-powered receipt scanning extracts every line item instantly.', color: '#38BDF8' },
  { icon: Bot, title: 'AI Coach', desc: 'A conversational financial mentor that explains spending patterns, predicts risks, and recommends better decisions.', color: '#F59E0B' },
  { icon: TrendingUp, title: 'Predictive Analytics', desc: 'Forecast next month\'s spending with 95% prediction accuracy.', color: '#22C55E' },
  { icon: Target, title: 'Savings Goals', desc: 'Set goals and let AI calculate the fastest path to reach them.', color: '#EF4444' },
  { icon: LineChart, title: 'Investment Suggestions', desc: 'Personalized SIP & stock recommendations based on your profile.', color: '#2563EB' },
  { icon: ShieldAlert, title: 'Fraud Detection', desc: 'Real-time anomaly detection flags suspicious transactions instantly.', color: '#7C3AED' },
  { icon: Mic, title: 'Voice Expense Entry', desc: 'Just say "I spent ₹500 on lunch" and FinCrest logs it for you.', color: '#10B981' },
  { icon: BellRing, title: 'Smart Notifications', desc: 'Context-aware alerts that actually matter — no noise, just signal.', color: '#38BDF8' },
  { icon: BarChart3, title: 'Financial Health Score', desc: 'A single score that captures your complete financial wellbeing.', color: '#F59E0B' },
  { icon: FileText, title: 'Monthly Reports', desc: 'Beautiful, auto-generated reports delivered to your inbox.', color: '#22C55E' },
  { icon: LayoutDashboard, title: 'Interactive Dashboard', desc: 'Every metric, chart, and insight in one stunning command center.', color: '#2563EB' },
  { icon: Search, title: 'Natural Language Search', desc: 'Ask "how much did I spend on Swiggy last month?" and get answers.', color: '#7C3AED' },
];

const stats = [
  { value: 18000000, label: 'Money Managed', format: 'inr', suffix: '+' },
  { value: 150000, label: 'Transactions', format: 'plain', suffix: '+' },
  { value: 95, label: 'Prediction Accuracy', format: 'percent', suffix: '%' },
  { value: 4.9, label: 'User Rating', format: 'plain', suffix: '★', decimals: true },
];

const pricingPlans = [
  { name: 'Starter', price: '₹0', period: 'forever', desc: 'Perfect for getting started', features: ['Expense tracking', '3 savings goals', 'Basic insights', 'Monthly reports', 'Community support'], cta: 'Start Free', highlight: false },
  { name: 'Pro', price: '₹299', period: '/month', desc: 'For serious money managers', features: ['Everything in Starter', 'Digital Twin access', 'AI Coach (unlimited)', 'Receipt Scanner', 'Predictive analytics', 'Investment suggestions', 'Priority support'], cta: 'Start 14-Day Trial', highlight: true },
  { name: 'Elite', price: '₹799', period: '/month', desc: 'The complete financial OS', features: ['Everything in Pro', 'Voice expense entry', 'Fraud detection', 'Custom AI models', 'Family accounts (up to 5)', 'Dedicated advisor', 'API access'], cta: 'Go Elite', highlight: false },
];

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Technology', href: '#technology' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

function AnimatedStat({ value, format, suffix, decimals }: { value: number; format: string; suffix: string; decimals?: boolean }) {
  const animated = useCountUp(value, 2000);
  const display =
    format === 'inr' ? formatINR(animated, true) :
    format === 'percent' ? `${animated.toFixed(0)}${suffix}` :
    decimals ? `${animated.toFixed(1)}${suffix}` : `${Math.round(animated).toLocaleString('en-IN')}${suffix}`;
  return <span>{display}</span>;
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong shadow-lg' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center glow-blue">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>FinCrest<span className="text-gradient"> AI</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="px-4 py-2 text-sm font-medium rounded-xl transition-colors hover:bg-white/5" style={{ color: 'var(--text-secondary)' }}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/signin" className="hidden sm:block text-sm font-semibold px-4 py-2 rounded-xl transition-colors hover:bg-white/5" style={{ color: 'var(--text-primary)' }}>
              Sign In
            </Link>
            <Link to="/signup">
              <Button size="sm" icon={<ArrowRight className="w-4 h-4" />}>Get Started</Button>
            </Link>
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:hidden glass-strong border-t overflow-hidden">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block px-6 py-3 text-sm font-medium hover:bg-white/5" style={{ color: 'var(--text-secondary)' }}>
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </motion.nav>

      {/* Hero */}
      <section ref={heroRef} id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 flex items-center justify-center">
          <HeroChartAnimation />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="info">
              <Sparkles className="w-3 h-3" /> Powered by GPT-4 + Custom ML Models
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
            style={{ color: 'var(--text-primary)' }}
          >
            Meet Your <span className="text-gradient">AI Financial</span><br />Twin
          </motion.h1>

          <motion.p
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.3 }}
  className="mt-6 text-lg md:text-xl max-w-2xl mx-auto"
  style={{ color: 'var(--text-secondary)' }}
>
  Stop tracking yesterday's expenses.
  <br />
  Start predicting tomorrow's wealth.
  <br />
  FinTwin AI creates an intelligent Digital Twin of your finances to simulate decisions, forecast future wealth, optimize spending, and help you achieve financial freedom with confidence.
</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup">
              <Button size="lg" icon={<Zap className="w-5 h-5" />}>Start Free</Button>
            </Link>
            <Button size="lg" variant="secondary" icon={<Play className="w-5 h-5" />}>Explore AI Demo</Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-5">
                <p className="text-2xl md:text-3xl font-bold text-gradient">
                  <AnimatedStat value={stat.value} format={stat.format} suffix={stat.suffix} decimals={stat.decimals} />
                </p>
                <p className="text-xs md:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            center
            eyebrow="Features"
            title={<>Everything you need to <span className="text-gradient">master your money</span></>}
            subtitle="15+ AI-powered features that work together to predict, optimize, and grow your wealth."
          />
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass rounded-3xl p-6 group relative overflow-hidden"
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity" style={{ background: feature.color }} />
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${feature.color}20`, color: feature.color }}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section id="technology" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading
                eyebrow="Technology"
                title={<>Built on <span className="text-gradient">cutting-edge AI</span></>}
                subtitle="FinCrest combines large language models, predictive ML, and real-time data to deliver financial intelligence that feels like magic."
              />
              <div className="mt-8 space-y-4">
                {[
                  { icon: Brain, title: 'GPT-4 Financial Engine', desc: 'Natural language understanding for all your money questions.' },
                  { icon: Cpu, title: 'Custom ML Predictions', desc: 'Models trained on 2M+ Indian transactions for 95% accuracy.' },
                  { icon: Lock, title: 'Bank-Grade Security', desc: '256-bit encryption. Your data never leaves your account.' },
                  { icon: Globe, title: 'Real-Time Sync', desc: 'Connected to 50+ Indian banks via secure UPI & Open Banking.' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-start gap-4 glass rounded-2xl p-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.title}</h4>
                      <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <TechVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            center
            eyebrow="Pricing"
            title={<>Simple, <span className="text-gradient">transparent pricing</span></>}
            subtitle="Start free. Upgrade when you're ready. Cancel anytime."
          />
          <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className={`glass rounded-3xl p-8 relative ${plan.highlight ? 'gradient-border glow-purple' : ''}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="info"><Star className="w-3 h-3" /> Most Popular</Badge>
                  </div>
                )}
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{plan.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{plan.price}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
                </div>
                <div className="mt-6 space-y-3">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      {feat}
                    </div>
                  ))}
                </div>
                <Link to="/signup" className="block mt-8">
                  <Button variant={plan.highlight ? 'primary' : 'secondary'} className="w-full">{plan.cta}</Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeading
            center
            eyebrow="About"
            title={<>We're building the <span className="text-gradient">future of personal finance</span></>}
            subtitle="FinTwin AI was built to solve one problem.
                      Most finance apps tell you where your money went.
                      FinTwin AI tells you where your money is going.
                      Using AI, predictive analytics and a Digital Financial Twin, users can simulate financial decisions before making them."
          />
          <div className="mt-16 grid sm:grid-cols-3 gap-6">
            {[
              { value: '2024', label: 'Founded in Bangalore' },
              { value: '50+', label: 'Engineers & AI researchers' },
              { value: '$50M', label: 'Series A funding raised' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6">
                <p className="text-3xl font-bold text-gradient">{item.value}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionHeading center eyebrow="Contact" title={<>Let's <span className="text-gradient">talk</span></>} subtitle="Have a question? We'd love to hear from you." />
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onSubmit={(e) => e.preventDefault()}
            className="mt-12 glass rounded-3xl p-8 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Input icon={<Mail className="w-4 h-4" />} placeholder="Your name" />
              <Input icon={<Phone className="w-4 h-4" />} placeholder="Email address" />
            </div>
            <Input icon={<MapPin className="w-4 h-4" />} placeholder="Subject" />
            <textarea placeholder="Your message" rows={4} className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" style={{ color: 'var(--text-primary)' }} />
            <Button type="submit" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>Send Message</Button>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-12 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>FinCrest<span className="text-gradient"> AI</span></span>
              </Link>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your AI financial twin. Predict, optimize, and grow your wealth.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Digital Twin', 'AI Coach'] },
              { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-muted)' }}>{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>© 2026 FinCrest AI. All rights reserved.</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Made with AI in Bangalore 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Input({ icon, placeholder }: { icon: React.ReactNode; placeholder: string }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>{icon}</div>
      <input placeholder={placeholder} className="w-full glass rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" style={{ color: 'var(--text-primary)' }} />
    </div>
  );
}

function HeroChartAnimation() {
  return (
    <div className="relative w-full max-w-4xl opacity-30 dark:opacity-40">
      <svg viewBox="0 0 800 400" className="w-full">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,300 Q100,250 200,280 T400,200 T600,150 T800,100"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.path
          d="M0,300 Q100,250 200,280 T400,200 T600,150 T800,100 L800,400 L0,400 Z"
          fill="url(#areaGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        />
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={i}
            cx={100 + i * 90}
            cy={280 - i * 25}
            r="4"
            fill="#38BDF8"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, repeatDelay: 1 }}
          />
        ))}
      </svg>
      {/* Floating robot */}
      <motion.div
        className="absolute top-10 right-10 w-16 h-16 rounded-2xl glass flex items-center justify-center animate-float"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Bot className="w-8 h-8 text-blue-400" />
      </motion.div>
    </div>
  );
}

function TechVisual() {
  return (
    <div className="glass rounded-3xl p-8 aspect-square relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center glow-purple"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Brain className="w-16 h-16 text-white" />
      </motion.div>
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 120;
        const y = Math.sin(angle) * 120;
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-12 h-12 rounded-2xl glass flex items-center justify-center"
            style={{ x, y, marginLeft: -24, marginTop: -24 }}
            animate={{ scale: [0.8, 1, 0.8] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          >
            {[Wallet, TrendingUp, Target, PiggyBank, Bot, ShieldAlert][i] && (() => {
              const Icon = [Wallet, TrendingUp, Target, PiggyBank, Bot, ShieldAlert][i];
              return <Icon className="w-5 h-5 text-blue-400" />;
            })()}
          </motion.div>
        );
      })}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <motion.div
            key={`line-${i}`}
            className="absolute top-1/2 left-1/2"
            style={{ width: 120, height: 1, background: 'rgba(124,58,237,0.3)', transformOrigin: 'left center', rotate: `${angle}rad` }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        );
      })}
    </div>
  );
}
