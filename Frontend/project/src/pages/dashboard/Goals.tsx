import { motion } from 'framer-motion';
import {
  Sparkles,
  Plus,
  PartyPopper,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatINR, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

type Goal = {
  id: number;
  name: string;
  target_amount: number;
  saved_amount: number;
  monthly_contribution: number;
  target_date: string | null;
  color: string;
  icon: string;
  aiSuggestion: string;
};

type GoalForm = {
  name: string;
  target_amount: string;
  saved_amount: string;
  monthly_contribution: string;
  target_date: string;
};

const API_URL = 'http://127.0.0.1:8000/api/savings-goals';

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const [form, setForm] = useState<GoalForm>({
    name: '',
    target_amount: '',
    saved_amount: '0',
    monthly_contribution: '0',
    target_date: '',
  });

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        console.error('No access token found.');
        return;
      }

      const response = await fetch(`${API_URL}/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch savings goals.');
      }

      const data = await response.json();

      const formattedGoals = (data.savings_goals || []).map(
        (goal: any) => ({
          id: goal.id,
          name: goal.name,
          target_amount: Number(goal.target_amount),
          saved_amount: Number(goal.saved_amount),
          monthly_contribution: Number(goal.monthly_contribution),
          target_date: goal.target_date || null,
          color: '#2563EB',
          icon: '🎯',
          aiSuggestion:
            'Keep saving consistently to reach your goal.',
        })
      );

      setGoals(formattedGoals);
    } catch (error) {
      console.error('Error fetching savings goals:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const resetForm = () => {
    setForm({
      name: '',
      target_amount: '',
      saved_amount: '0',
      monthly_contribution: '0',
      target_date: '',
    });
  };

  const handleAddGoal = async () => {
    if (!form.name.trim() || !form.target_amount) {
      alert('Please enter the goal name and target amount.');
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('access_token');

      if (!token) {
        alert('Please sign in again.');
        return;
      }

      const response = await fetch(`${API_URL}/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          target_amount: Number(form.target_amount),
          saved_amount: Number(form.saved_amount || 0),
          monthly_contribution: Number(
            form.monthly_contribution || 0
          ),
          target_date: form.target_date || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error ||
            data.detail ||
            'Failed to add savings goal.'
        );
      }

      // Refresh goals from the database
      await fetchGoals();

      resetForm();
      setShowAddGoal(false);
    } catch (error) {
      console.error('Error adding savings goal:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to add savings goal.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditGoal = async () => {
    if (!editingGoal) return;

    if (!form.name.trim() || !form.target_amount) {
      alert('Please enter the goal name and target amount.');
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('access_token');

      if (!token) {
        alert('Please sign in again.');
        return;
      }

      const response = await fetch(
        `${API_URL}/${editingGoal.id}/update/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name.trim(),
            target_amount: Number(form.target_amount),
            saved_amount: Number(form.saved_amount || 0),
            monthly_contribution: Number(
              form.monthly_contribution || 0
            ),
            target_date: form.target_date || null,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error ||
            data.detail ||
            'Failed to update savings goal.'
        );
      }

      await fetchGoals();

      resetForm();
      setEditingGoal(null);
    } catch (error) {
      console.error('Error updating savings goal:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to update savings goal.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this savings goal?'
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        alert('Please sign in again.');
        return;
      }

      const response = await fetch(
        `${API_URL}/${goalId}/delete/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error ||
            data.detail ||
            'Failed to delete savings goal.'
        );
      }

      setGoals(prevGoals =>
        prevGoals.filter(goal => goal.id !== goalId)
      );
    } catch (error) {
      console.error('Error deleting savings goal:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete savings goal.'
      );
    }
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);

    setForm({
      name: goal.name,
      target_amount: String(goal.target_amount),
      saved_amount: String(goal.saved_amount),
      monthly_contribution: String(goal.monthly_contribution),
      target_date: goal.target_date || '',
    });
  };

  const closeModal = () => {
    resetForm();
    setShowAddGoal(false);
    setEditingGoal(null);
  };

  const completedGoal = goals.find(
    g =>
      Number(g.saved_amount) / Number(g.target_amount) >= 0.8 &&
      Number(g.saved_amount) / Number(g.target_amount) < 1
  );

  useEffect(() => {
    if (completedGoal) {
      const t = setTimeout(() => setConfetti(true), 1000);
      return () => clearTimeout(t);
    }
  }, [completedGoal]);

  return (
    <div className="space-y-6 relative">
      {confetti && <Confetti />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Savings Goals
          </h1>

          <p
            className="text-sm mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            Track and accelerate your journey to every financial milestone.
          </p>
        </div>

        <Button
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddGoal(true)}
        >
          New Goal
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((g, i) => {
          const pct =
            Number(g.target_amount) > 0
              ? Math.min(
                  100,
                  Math.round(
                    (Number(g.saved_amount) /
                      Number(g.target_amount)) *
                      100
                  )
                )
              : 0;

          const circumference = 2 * Math.PI * 52;
          const offset =
            circumference - (pct / 100) * circumference;

          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass rounded-3xl p-6 relative overflow-hidden group"
            >
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"
                style={{ background: g.color }}
              />

              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: `${g.color}20` }}
                >
                  {g.icon}
                </div>

                <div className="flex items-center gap-2">
                  {pct >= 80 && (
                    <Badge variant="success">
                      <PartyPopper className="w-3 h-3" />
                      Almost there!
                    </Badge>
                  )}

                  <button
                    onClick={() => openEditModal(g)}
                    className="p-2 rounded-lg hover:bg-white/10"
                    title="Edit goal"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteGoal(g.id)}
                    className="p-2 rounded-lg hover:bg-white/10 text-red-400"
                    title="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3
                className="font-semibold text-lg"
                style={{ color: 'var(--text-primary)' }}
              >
                {g.name}
              </h3>

              <div className="flex justify-center my-4 relative">
                <svg width="120" height="120" className="-rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="rgba(148,163,184,0.1)"
                    strokeWidth="8"
                  />

                  <motion.circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke={g.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.08,
                      ease: 'easeOut',
                    }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {pct}%
                  </span>

                  <span
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    complete
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>
                    Saved
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {formatINR(Number(g.saved_amount), true)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>
                    Target
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {formatINR(Number(g.target_amount), true)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>
                    Monthly
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {formatINR(
                      Number(g.monthly_contribution),
                      true
                    )}
                  </span>
                </div>

                <div
                  className="flex justify-between text-sm pt-2 border-t"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>
                    Target Date
                  </span>

                  <span className="text-emerald-400 font-medium">
                    {g.target_date
                      ? formatDate(g.target_date)
                      : 'Not set'}
                  </span>
                </div>
              </div>

              <div
                className="mt-4 pt-4 border-t flex items-start gap-2"
                style={{ borderColor: 'var(--border)' }}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />

                <p
                  className="text-xs"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {g.aiSuggestion}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div
          className="glass rounded-3xl p-10 text-center"
          style={{ color: 'var(--text-secondary)' }}
        >
          No savings goals yet. Create your first goal!
        </div>
      )}

      {(showAddGoal || editingGoal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            className="w-full max-w-md rounded-3xl p-6 glass"
            style={{ color: 'var(--text-primary)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingGoal ? 'Edit Goal' : 'Add New Goal'}
              </h2>

              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. New Laptop"
                  className="w-full rounded-xl px-4 py-3 bg-transparent border"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Target Amount
                </label>
                <input
                  type="number"
                  value={form.target_amount}
                  onChange={e =>
                    setForm({
                      ...form,
                      target_amount: e.target.value,
                    })
                  }
                  placeholder="50000"
                  className="w-full rounded-xl px-4 py-3 bg-transparent border"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Saved Amount
                </label>
                <input
                  type="number"
                  value={form.saved_amount}
                  onChange={e =>
                    setForm({
                      ...form,
                      saved_amount: e.target.value,
                    })
                  }
                  placeholder="0"
                  className="w-full rounded-xl px-4 py-3 bg-transparent border"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Monthly Contribution
                </label>
                <input
                  type="number"
                  value={form.monthly_contribution}
                  onChange={e =>
                    setForm({
                      ...form,
                      monthly_contribution: e.target.value,
                    })
                  }
                  placeholder="5000"
                  className="w-full rounded-xl px-4 py-3 bg-transparent border"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={form.target_date}
                  onChange={e =>
                    setForm({
                      ...form,
                      target_date: e.target.value,
                    })
                  }
                  className="w-full rounded-xl px-4 py-3 bg-transparent border"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button size="sm" onClick={closeModal}>
                  Cancel
                </Button>

                <Button
                  size="sm"
                  onClick={
                    editingGoal
                      ? handleEditGoal
                      : handleAddGoal
                  }
                >
                  {loading
                    ? 'Saving...'
                    : editingGoal
                      ? 'Update Goal'
                      : 'Add Goal'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Confetti() {
  const colors = [
    '#2563EB',
    '#7C3AED',
    '#10B981',
    '#38BDF8',
    '#F59E0B',
    '#EF4444',
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}