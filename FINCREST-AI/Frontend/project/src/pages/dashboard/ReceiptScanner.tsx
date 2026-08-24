import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Upload, Camera, ScanLine, Sparkles, Check, FileText, X } from 'lucide-react';
import { receiptData } from '@/lib/data';
import { formatINR, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

type State = 'idle' | 'scanning' | 'done';

export default function ReceiptScanner() {
  const [state, setState] = useState<State>('idle');
  const [dragging, setDragging] = useState(false);

  const scan = () => {
    setState('scanning');
    setTimeout(() => setState('done'), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Receipt Scanner</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>AI-powered OCR extracts every line item from your receipts instantly.</p>
      </div>

      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); scan(); }}
              onClick={scan}
              className={`glass gradient-border rounded-3xl p-12 md:p-16 border-2 border-dashed cursor-pointer transition-all ${dragging ? 'scale-[1.02] ring-2 ring-blue-500' : ''}`}
              style={{ borderColor: dragging ? '#2563EB' : 'var(--border)' }}
            >
              <div className="text-center">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6 glow-purple">
                  <Upload className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Drop your receipt here</h3>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>or click to browse · supports JPG, PNG, PDF</p>
                <div className="mt-6 flex gap-3 justify-center">
                  <Button size="sm" icon={<Upload className="w-4 h-4" />}>Browse Files</Button>
                  <Button size="sm" variant="secondary" icon={<Camera className="w-4 h-4" />}>Camera</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {state === 'scanning' && (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-3xl p-12 flex flex-col items-center">
            {/* OCR Animation */}
            <div className="relative w-48 h-64 mb-6">
              <div className="absolute inset-0 glass rounded-2xl p-4 flex flex-col gap-2">
                {[...Array(6)].map((_, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.2 }} className="h-3 rounded" style={{ background: 'var(--border)', width: `${60 + Math.random() * 30}%` }} />
                ))}
              </div>
              <motion.div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} style={{ boxShadow: '0 0 20px #2563EB' }} />
            </div>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 rounded-full border-3 border-blue-500/20 border-t-blue-500 mb-4" />
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Scanning receipt with AI OCR...</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Extracting merchant, items, and totals</p>
          </motion.div>
        )}

        {state === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Success banner */}
            <div className="glass gradient-border rounded-3xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center"><Check className="w-6 h-6 text-emerald-400" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Receipt scanned successfully!</span>
                  <Badge variant="success"><Sparkles className="w-3 h-3" /> {receiptData.confidence}% confidence</Badge>
                </div>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>All items extracted and categorized automatically.</p>
              </div>
              <Button size="sm" variant="ghost" icon={<X className="w-4 h-4" />} onClick={() => setState('idle')}>Scan Another</Button>
            </div>

            {/* Receipt details */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="glass rounded-3xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{receiptData.merchant}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{formatDate(receiptData.date)}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
                <div className="space-y-2">
                  {receiptData.items.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex justify-between items-center py-2">
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Qty: {item.qty}</p>
                      </div>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{formatINR(item.price)}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t space-y-1.5" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex justify-between text-sm"><span style={{ color: 'var(--text-muted)' }}>Subtotal</span><span style={{ color: 'var(--text-secondary)' }}>{formatINR(receiptData.total - receiptData.gst)}</span></div>
                  <div className="flex justify-between text-sm"><span style={{ color: 'var(--text-muted)' }}>GST (18%)</span><span style={{ color: 'var(--text-secondary)' }}>{formatINR(receiptData.gst)}</span></div>
                  <div className="flex justify-between text-base font-bold pt-1"><span style={{ color: 'var(--text-primary)' }}>Total</span><span style={{ color: 'var(--text-primary)' }}>{formatINR(receiptData.total)}</span></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass rounded-3xl p-6">
                  <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>AI Analysis</h3>
                  <div className="space-y-3">
                    <Row label="Category" value={<Badge variant="info">{receiptData.category}</Badge>} />
                    <Row label="Confidence" value={<span className="text-emerald-400 font-semibold">{receiptData.confidence}%</span>} />
                    <Row label="Merchant" value={receiptData.merchant} />
                    <Row label="Date" value={formatDate(receiptData.date)} />
                  </div>
                </div>
                <div className="glass gradient-border rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>AI Suggestions</span>
                  </div>
                  <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Groceries are 8% cheaper at DMart vs BigBasket</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Bulk buy atta & rice for 15% savings</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Use HDFC card for 5% cashback on groceries</li>
                  </ul>
                  <Button size="sm" className="w-full mt-4">Add to Transactions</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
      {value}
    </div>
  );
}
