import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  User,
  TrendingDown,
  PiggyBank,
  Wallet,
  Target,
  BarChart3,
} from 'lucide-react';
import { Badge } from '@/components/ui/SectionHeading';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

/* =========================================================
   FIVE FIXED FINANCIAL QUESTIONS
   ========================================================= */

const suggestedQuestions = [
  {
    text: 'How can I reduce my spending?',
    icon: TrendingDown,
  },
  {
    text: 'Where am I overspending?',
    icon: BarChart3,
  },
  {
    text: 'How much have I saved?',
    icon: PiggyBank,
  },
  {
    text: 'What is my biggest expense category?',
    icon: Wallet,
  },
  {
    text: 'What should I improve in my spending?',
    icon: Target,
  },
];

/* =========================================================
   FIXED ANSWERS
   ========================================================= */

const answers: Record<string, string> = {
  'How can I reduce my spending?':
    'Your highest spending category is Food. Consider reducing food delivery and setting a monthly limit. Consistency is more important than saving a large amount at once.',

  'Where am I overspending?':
    'Your spending is highest in categories where your expenses are above your planned budget. Focus on reducing non-essential purchases and reviewing your budget regularly.',

  'How much have I saved?':
    'Your savings are calculated from your recorded income minus your recorded expenses. Keep tracking your income and expenses regularly to monitor your savings progress.',

  'What is my biggest expense category?':
    'Your biggest expense category is identified from your recorded transactions. Review this category regularly and look for unnecessary purchases that can be reduced.',

  'What should I improve in my spending?':
    'Focus on reducing unnecessary purchases, setting category-wise spending limits, and tracking your expenses consistently. Small improvements in daily spending can make a significant difference over time.',
};

/* =========================================================
   AI COACH COMPONENT
   ========================================================= */

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text:
        'Welcome to your Financial Coach. Select one of the questions below to get an insight based on your recorded financial transactions.',
    },
  ]);

  const [typing, setTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* =========================================================
     AUTO SCROLL
     ========================================================= */

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, typing]);

  /* =========================================================
     HANDLE QUESTION CLICK
     ========================================================= */

  const send = (question: string) => {
    if (!question.trim() || typing) return;

    const answer =
      answers[question] ||
      'Please select one of the five available financial questions.';

    /* Show a small typing effect before displaying the answer */
    setTyping(true);

    setMessages((messages) => [
      ...messages,
      {
        role: 'user',
        text: question,
      },
    ]);

    setTimeout(() => {
      setMessages((messages) => [
        ...messages,
        {
          role: 'ai',
          text: answer,
        },
      ]);

      setTyping(false);
    }, 700);
  };

  /* =========================================================
     PAGE UI
     ========================================================= */

  return (
    <div className="space-y-4 h-[calc(100vh-7rem)] flex flex-col">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center glow-purple">
          <Bot className="w-6 h-6 text-white" />
        </div>

        <div>
          <h1
            className="text-xl font-bold flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Financial Coach

            <Badge variant="success">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Online
            </Badge>
          </h1>

          <p
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            Personalized insights from your financial activity
          </p>
        </div>
      </div>

      {/* =====================================================
          CHAT BOX
          ===================================================== */}

      <div className="glass rounded-3xl flex-1 flex flex-col overflow-hidden">
        {/* ===================================================
            MESSAGES
            =================================================== */}

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
        >
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}

              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                    : 'glass'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-blue-400" />
                )}
              </div>

              {/* Message */}

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' ? 'btn-primary' : 'glass'
                }`}
                style={
                  msg.role === 'ai'
                    ? { color: 'var(--text-primary)' }
                    : {}
                }
              >
                <p className="text-sm whitespace-pre-line">
                  {msg.text}
                </p>
              </div>
            </motion.div>
          ))}

          {/* =================================================
              TYPING INDICATOR
              ================================================= */}

          <AnimatePresence>
            {typing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <div className="w-9 h-9 rounded-xl glass flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>

                <div className="glass rounded-2xl px-4 py-3 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 rounded-full bg-blue-400"
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.15,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* =====================================================
            FIVE CLICKABLE QUESTIONS
            ===================================================== */}

        <div className="px-4 md:px-6 pb-4">
          <p
            className="text-xs mb-3 flex items-center gap-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            <Sparkles className="w-3 h-3" />
            Select a financial question
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestedQuestions.map(
              ({ text, icon: Icon }) => (
                <motion.button
                  key={text}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => send(text)}
                  disabled={typing}
                  className="glass rounded-xl px-3 py-3 text-left text-xs font-medium flex items-center gap-2 hover:bg-white/10 transition disabled:opacity-50"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />

                  <span>{text}</span>
                </motion.button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}