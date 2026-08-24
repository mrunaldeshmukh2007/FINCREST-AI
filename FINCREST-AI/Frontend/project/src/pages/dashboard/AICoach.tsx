import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, TrendingDown, PiggyBank, Target, LineChart, Laptop, Wallet } from 'lucide-react';
import { chatSuggestions } from '@/lib/data';
import { formatINR } from '@/lib/utils';
import { Badge } from '@/components/ui/SectionHeading';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const aiResponses: Record<string, string> = {
  'Reduce my expenses': 'I analyzed your last 30 days. Here are 3 quick wins:\n\n1. **Food delivery** — You spent ₹8,420 on Swiggy + Zomato. Cooking 3x/week saves ₹3,200/mo.\n2. **Unused subscriptions** — 3 services haven\'t been opened in 45+ days (₹847/mo total).\n3. **Peak-hour Ubers** — Switching 4 rides/week to metro saves ₹1,200/mo.\n\n**Total potential savings: ₹5,247/month** — that\'s ₹63K/year!',
  'Where am I overspending?': 'Your biggest leak is **Food** — ₹8,420 this month, 26% above your 6-month average. Swiggy alone is ₹4,200 (8 orders). Weekend dining adds ₹2,180.\n\nSecond is **Shopping** at ₹5,198, though that\'s actually 31% *below* last month — great progress!\n\nI recommend setting a ₹500/order cap on food delivery. Want me to create that budget rule?',
  'Create a monthly budget': 'Based on your ₹2.3L income, here\'s an optimized 50-30-20 split:\n\n• **Needs (50%)**: ₹1,15,000 — rent, bills, groceries\n• **Wants (30%)**: ₹69,000 — dining, shopping, entertainment\n• **Savings (20%)**: ₹46,000 — SIP + emergency fund\n\nYour current savings rate is 38% — well above the 20% target. You could afford to invest ₹15K more in index funds. Shall I set this up?',
  'Can I invest?': 'Yes! You have ₹15,000 idle in your savings account earning 3.5%. Moving it to a liquid fund earns ~6.5% — that\'s ₹3,200/yr extra.\n\nFor long-term, I recommend:\n• **₹10K/mo** in Nifty 50 Index Fund (12% historical returns)\n• **₹5K/mo** in ELSS for tax saving (₹15K saved under 80C)\n\nYour risk profile: Moderate. Time horizon: 7+ years. Perfect for equity-heavy allocation.',
  'Should I buy a laptop?': 'A MacBook Pro M4 (₹2.5L) would use 57% of your savings. My analysis:\n\n✅ **Affordable** — your savings rate is 38%\n⚠️ **Delays emergency fund** by 2 months\n💡 **Alternative**: HDFC card EMI at ₹20,833/mo for 12 months (0% interest)\n\nIf it\'s for income-generating work (freelancing), the ROI justifies it. For personal use, consider the M3 Air at ₹1.15L — saves ₹1.35L. Want me to simulate both in your Digital Twin?',
  'How do I save ₹2 lakh?': 'At your current rate (₹88K/yr savings), you\'ll hit ₹2L in **2.7 months**. To reach it faster:\n\n• **+₹5K/mo** → 2.3 months\n• **+₹10K/mo** → 2.0 months\n• **+₹15K/mo** → 1.8 months\n\nThe fastest path: cut food delivery (₹3.2K) + unused subscriptions (₹847) + invest the ₹15K idle cash. That alone adds ₹4K/mo. Want me to apply this plan?',
};

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hi Arjun! I\'m your AI financial coach. I\'ve analyzed your spending patterns and I\'m ready to help. What would you like to know?' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const response = aiResponses[text] || 'I\'m analyzing your financial data... Based on your patterns, I recommend focusing on your savings rate and reducing discretionary spending. Would you like me to create a personalized plan?';
      setMessages((m) => [...m, { role: 'ai', text: response }]);
      setTyping(false);
    }, 1500);
  };

  const suggestionIcons = [TrendingDown, Wallet, PiggyBank, LineChart, Laptop, Target];

  return (
    <div className="space-y-4 h-[calc(100vh-7rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center glow-purple">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>AI Financial Coach <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online</Badge></h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Powered by GPT-4 · Trained on your financial data</p>
        </div>
      </div>

      {/* Chat */}
      <div className="glass rounded-3xl flex-1 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'glass'}`}>
                {msg.role === 'user' ? <User className="w-4.5 h-4.5 text-white" /> : <Bot className="w-4.5 h-4.5 text-blue-400" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'btn-primary' : 'glass'}`} style={msg.role === 'ai' ? { color: 'var(--text-primary)' } : {}}>
                <p className="text-sm whitespace-pre-line">{msg.text}</p>
              </div>
            </motion.div>
          ))}

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-9 h-9 rounded-xl glass flex items-center justify-center"><Bot className="w-4.5 h-4.5 text-blue-400" /></div>
              <div className="glass rounded-2xl px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className="w-2 h-2 rounded-full bg-blue-400" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 md:px-6 pb-3">
            <p className="text-xs mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}><Sparkles className="w-3 h-3" /> Suggested prompts</p>
            <div className="flex flex-wrap gap-2">
              {chatSuggestions.map((s, i) => {
                const Icon = suggestionIcons[i] || Sparkles;
                return (
                  <motion.button key={s} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => send(s)} className="glass rounded-xl px-3 py-2 text-xs font-medium flex items-center gap-1.5 hover:bg-white/5" style={{ color: 'var(--text-secondary)' }}>
                    <Icon className="w-3.5 h-3.5 text-blue-400" /> {s}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything about your finances..." className="flex-1 glass rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" style={{ color: 'var(--text-primary)' }} />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="btn-primary rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0">
              <Send className="w-5 h-5" />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}

