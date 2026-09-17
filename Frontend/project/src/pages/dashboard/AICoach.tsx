import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, typing]);

const answers: Record<string, string> = {
  'How can I reduce my spending?':
    'Based on your recorded transactions, your expenses are currently higher than your income. Start by reducing non-essential spending, especially frequent purchases in your highest-spending category. Set a monthly spending limit and keep a fixed portion of your income aside as savings before spending.',

  'Where am I overspending?':
    'Your recorded expenses are ₹1,00,500.02 compared with recorded income of ₹50,000.01. This means you are currently spending ₹50,500.01 more than your recorded income. Focus on reducing your highest-spending categories and reviewing recurring or unnecessary purchases.',

  'How much have I saved?':
    'Based on your currently recorded income and expenses, your calculated balance is -₹50,500.01. This means your recorded expenses are currently higher than your income. Your first goal should be to bring your expenses below your income and then build consistent savings.',

  'What is my biggest expense category?':
    'Based on your recorded transactions, Food appears to be your highest-spending category. Review food delivery, eating out and other food-related purchases to identify expenses that can be reduced without affecting your essential needs.',

  'What should I improve in my spending?':
    'The biggest improvement would be controlling your overall spending because your recorded expenses are significantly higher than your income. Prioritize essential expenses, reduce unnecessary purchases, set category-wise budgets and maintain a fixed monthly savings target.',
};

const send = (question: string) => {
  if (!question.trim() || typing) return;

  const answer =
    answers[question] ||
    'Please select one of the five available financial questions.';

  // Add user's question
  setMessages((messages) => [
    ...messages,
    {
      role: 'user',
      text: question,
    },
  ]);

  // Show typing animation
  setTyping(true);

  // Show personalized answer after a short delay
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

  return (
    <div className="space-y-4 h-[calc(100vh-7rem)] flex flex-col">
      {/* Header */}
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

      {/* Chat */}
      <div className="glass rounded-3xl flex-1 flex flex-col overflow-hidden">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
        >
          {messages.map((msg, index) => (
            <motion.div
              key={`${msg.role}-${index}`}
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
                  msg.role === 'user'
                    ? 'btn-primary'
                    : 'glass'
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

          {/* Typing indicator */}
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
                  {[0, 1, 2].map((index) => (
                    <motion.span
                      key={index}
                      className="w-2 h-2 rounded-full bg-blue-400"
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.15,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggested Questions */}
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
                  type="button"
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