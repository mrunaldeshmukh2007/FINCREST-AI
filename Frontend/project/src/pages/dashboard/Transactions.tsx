import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiRequest } from "../../lib/api";
import {
  Search, Download, Plus, Edit2, Trash2, Eye, ArrowUpRight,
  ArrowDownRight, Sparkles, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { Badge } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Transaction } from '@/lib/data';
import { formatINR, formatDate } from '@/lib/utils';

type ApiTransaction = {
  id: number;
  amount: string;
  transaction_type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
};

function toTransaction(transaction: ApiTransaction): Transaction {
  return {
    id: String(transaction.id),
    merchant: transaction.description || transaction.category,
    category: transaction.category,
    amount: Number(transaction.amount),
    type: transaction.transaction_type,
    status: 'completed',
    paymentMode: 'Cash',
    date: transaction.date,
  };
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [searchParams] = useSearchParams();

  const perPage = 8;

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await apiRequest('/api/transactions/');
        const apiTransactions: ApiTransaction[] = data.transactions ?? data;
        setTransactions(apiTransactions.map(toTransaction));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);
  useEffect(() => {
  if (searchParams.get('quickAdd') === 'true') {
    setShowAdd(true);
  }
}, [searchParams]);

  const refreshTransactions = async () => {
    const data = await apiRequest('/api/transactions/');
    const apiTransactions: ApiTransaction[] = data.transactions ?? data;
    setTransactions(apiTransactions.map(toTransaction));
  };

  const handleDelete = async (transaction: Transaction) => {
    try {
      setError('');
      await apiRequest(`/api/transactions/${transaction.id}/delete/`, { method: 'DELETE' });
      await refreshTransactions();
      if (selected?.id === transaction.id) setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
    }
  };

  const openEdit = (transaction: Transaction) => {
    setEditing(transaction);
    setShowAdd(true);
  };
  
  const handleExportCSV = () => {
  const headers = ['Merchant', 'Category', 'Amount', 'Type', 'Status', 'Payment Mode', 'Date'];

  const rows = transactions.map((t) => [
    t.merchant,
    t.category,
    t.amount,
    t.type,
    t.status,
    t.paymentMode,
    t.date,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'fincrest-transactions.csv';
  link.click();

  URL.revokeObjectURL(url);
};

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch = t.merchant.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || (filter === 'income' && t.type === 'income') || (filter === 'expense' && t.type === 'expense') || t.category === filter;
      return matchSearch && matchFilter;
    });
  }, [transactions, search, filter]);

  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const categories = ['all', 'income', 'expense', 'Food', 'Shopping', 'Bills', 'Travel', 'Entertainment', 'Investments'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Transactions</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage and analyze all your financial activity.</p>
          {error && <p className="text-sm mt-2 text-red-400">{error}</p>}
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAdd(true)}>Add Transaction</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search merchant or category..." className="w-full glass rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" style={{ color: 'var(--text-primary)' }} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${filter === c ? 'btn-primary' : 'glass'}`} style={filter === c ? {} : { color: 'var(--text-secondary)' }}>
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-muted)' }}>Merchant</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-muted)' }}>Category</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-muted)' }}>Amount</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Status</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>Mode</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>Date</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>Loading transactions...</td>
                </tr>
              ) : paged.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b hover:bg-white/5 transition-colors cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                  onClick={() => setSelected(t)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/15' : 'bg-red-500/10'}`}>
                        {t.type === 'income' ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-red-400" />}
                      </div>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{t.merchant}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.category}</span></td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-400' : ''}`} style={{ color: t.type === 'income' ? undefined : 'var(--text-primary)' }}>
                      {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant={t.status === 'completed' ? 'success' : t.status === 'pending' ? 'warning' : 'danger'}>{t.status}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell"><span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.paymentMode}</span></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{formatDate(t.date)}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={(e) => { e.stopPropagation(); setSelected(t); }} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center"><Eye className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /></button>
                      <button onClick={(e) => { e.stopPropagation(); openEdit(t); }} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center"><Edit2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /></button>
                      <button onClick={(e) => { e.stopPropagation(); void handleDelete(t); }} className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center"><Trash2 className="w-4 h-4 text-red-400" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Showing {paged.length} of {filtered.length}</p>
          <div className="flex gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-8 h-8 rounded-lg glass flex items-center justify-center disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-3 py-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="w-8 h-8 rounded-lg glass flex items-center justify-center disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelected(null)}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ type: 'spring', damping: 30 }} className="relative w-full max-w-md h-full glass-strong border-l overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Transaction Details</h3>
                  <button onClick={() => setSelected(null)}><X className="w-5 h-5" /></button>
                </div>
                <div className="text-center py-6">
                  <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3 ${selected.type === 'income' ? 'bg-emerald-500/15' : 'bg-red-500/10'}`}>
                    {selected.type === 'income' ? <ArrowUpRight className="w-8 h-8 text-emerald-400" /> : <ArrowDownRight className="w-8 h-8 text-red-400" />}
                  </div>
                  <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{selected.type === 'income' ? '+' : '-'}{formatINR(selected.amount)}</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{selected.merchant}</p>
                </div>
                <div className="space-y-3 mt-6">
                  <Row label="Category" value={selected.category} />
                  <Row label="Payment Mode" value={selected.paymentMode} />
                  <Row label="Date" value={formatDate(selected.date)} />
                  <Row label="Status" value={<Badge variant={selected.status === 'completed' ? 'success' : selected.status === 'pending' ? 'warning' : 'danger'}>{selected.status}</Badge>} />
                </div>
                {selected.aiRecommendation && (
                  <div className="mt-6 glass gradient-border rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI Recommendation</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selected.aiRecommendation}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && (
          <AddModal
            transaction={editing}
            onClose={() => { setShowAdd(false); setEditing(null); }}
            onSaved={async () => { await refreshTransactions(); setShowAdd(false); setEditing(null); }}
            onError={(message) => setError(message)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

function AddModal({
  transaction,
  onClose,
  onSaved,
  onError,
}: {
  transaction: Transaction | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
  onError: (message: string) => void;
}) {
  const [merchant, setMerchant] = useState(transaction?.merchant ?? '');
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>(transaction?.type ?? 'expense');
  const [category, setCategory] = useState(transaction?.category ?? 'Food');
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '');
  const [paymentMode, setPaymentMode] = useState<Transaction['paymentMode']>(transaction?.paymentMode ?? 'UPI');
  const [date, setDate] = useState(transaction?.date ?? new Date().toISOString().slice(0, 10));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = {
        amount: Number(amount),
        transaction_type: transactionType.toLowerCase(),
        category,
        description: merchant,
        date,
      };
      const endpoint = transaction
        ? `/api/transactions/${transaction.id}/update/`
        : '/api/transactions/add/';
      await apiRequest(endpoint, { method: transaction ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      await onSaved();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to save transaction');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-full max-w-md glass-strong gradient-border rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Add Transaction</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={merchant} onChange={(e) => setMerchant(e.target.value)} placeholder="Merchant" required className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" style={{ color: 'var(--text-primary)' }} />
          <div className="grid grid-cols-2 gap-3">
            <select value={transactionType} onChange={(e) => setTransactionType(e.target.value as 'expense' | 'income')} className="glass rounded-xl px-4 py-2.5 text-sm outline-none" style={{ color: 'var(--text-primary)' }}>
              <option className="bg-slate-900">Expense</option>
              <option className="bg-slate-900">Income</option>
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="glass rounded-xl px-4 py-2.5 text-sm outline-none" style={{ color: 'var(--text-primary)' }}>
              {['Food', 'Shopping', 'Bills', 'Travel', 'Salary', 'Investments'].map(c => <option key={c} className="bg-slate-900">{c}</option>)}
            </select>
          </div>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (₹)" required min="0" className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" style={{ color: 'var(--text-primary)' }} />
          <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value as Transaction['paymentMode'])} className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none" style={{ color: 'var(--text-primary)' }}>
            {['UPI', 'Card', 'Bank Transfer', 'Cash', 'Wallet'].map(m => <option key={m} className="bg-slate-900">{m}</option>)}
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none" style={{ color: 'var(--text-primary)' }} />
          <Button type="submit" className="w-full" icon={<Plus className="w-4 h-4" />}>Add Transaction</Button>
        </form>
      </motion.div>
    </motion.div>
  );
}
