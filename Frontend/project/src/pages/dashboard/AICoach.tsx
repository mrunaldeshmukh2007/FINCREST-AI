import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  TrendingDown,
  PiggyBank,
  Target,
  LineChart,
  Laptop,
  Wallet,
} from 'lucide-react';
import { Badge } from '@/components/ui/SectionHeading';
import { apiRequest } from '@/lib/api';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const chatSuggestions = [
  'How can I reduce my spending?',
  'Where am I spending the most?',
  'How can I save more money?',
  'Show me my spending trends',
  'How can I manage my student budget?',
  'How can I reach my savings goals?',
];

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await apiRequest('/api/chat-messages/');
        const history = data.chat_messages ?? [];

        setMessages(
          history.map((m: { role: string; text: string }) => ({
            role: m.role as 'user' | 'ai',
            text: m.text,
          }))
        );
      } catch (err) {
        console.error('Failed to load chat history:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load chat history'
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, sending]);

  const send = async (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText || sending) return;

    setMessages((m) => [
      ...m,
      { role: 'user', text: trimmedText },
    ]);

    setInput('');
    setSending(true);
    setError(null);

    try {
      const data = await apiRequest('/api/chat-messages/add/', {
        method: 'POST',
        body: JSON.stringify({
          role: 'user',
          text: trimmedText,
        }),
      });

      if (!data.ai_message?.text) {
        throw new Error('The AI service returned no response.');
      }

      setMessages((m) => [
        ...m,
        {
          role: 'ai',
          text: data.ai_message.text,
        },
      ]);
    } catch (err) {
      console.error('Failed to save chat message:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to send message'
      );
    } finally {
      setSending(false);
    }
  };

  const suggestionIcons = [
    TrendingDown,
    Wallet,
    PiggyBank,
    LineChart,
    Laptop,
    Target,
  ];

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
            AI Financial Coach

            <Badge variant="info">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Backend AI
            </Badge>
          </h1>

          <p
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            Ask questions about your financial activity
          </p>
        </div>
      </div>

      {/* Chat */}
      <div className="glass rounded-3xl flex-1 flex flex-col overflow-hidden">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
        >
          {loading && (
            <div className="flex items-center justify-center py-8">
              <p
                className="text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                Loading chat history...
              </p>
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <p
                className="text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                No chat history yet. Ask a question below to get started.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                    : 'glass'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4.5 h-4.5 text-white" />
                ) : (
                  <Bot className="w-4.5 h-4.5 text-blue-400" />
                )}
              </div>

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

          {sending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-9 h-9 rounded-xl glass flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-blue-400" />
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

          {error && (
            <div
              className="glass rounded-2xl px-4 py-3"
              style={{
                border: '1px solid rgba(239,68,68,0.3)',
              }}
            >
              <p
                className="text-sm font-medium"
                style={{ color: '#EF4444' }}
              >
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 md:px-6 pb-3">
            <p
              className="text-xs mb-2 flex items-center gap-1.5"
              style={{ color: 'var(--text-muted)' }}
            >
              <Sparkles className="w-3 h-3" />
              Suggested prompts
            </p>

            <div className="flex flex-wrap gap-2">
              {chatSuggestions.map((s, i) => {
                const Icon = suggestionIcons[i] || Sparkles;

                return (
                  <motion.button
                    key={s}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => send(s)}
                    className="glass rounded-xl px-3 py-2 text-xs font-medium flex items-center gap-1.5 hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <Icon className="w-3.5 h-3.5 text-blue-400" />
                    {s}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input */}
        <div
          className="p-4 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your finances..."
              disabled={sending}
              className="flex-1 glass rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60"
              style={{ color: 'var(--text-primary)' }}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={sending || !input.trim()}
              className="btn-primary rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0 disabled:opacity-60"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}