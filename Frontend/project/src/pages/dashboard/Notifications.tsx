import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, BellRing, Check, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { apiRequest } from '@/lib/api';
import { formatDate } from '@/lib/utils';

type ApiNotification = {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
};

const typeConfig = {
  warning: { icon: AlertTriangle, color: '#F59E0B' },
  success: { icon: CheckCircle2, color: '#22C55E' },
  info: { icon: Info, color: '#38BDF8' },
  danger: { icon: ShieldAlert, color: '#EF4444' },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiRequest('/api/notifications/');
        if (cancelled) return;

        const apiNotifications: ApiNotification[] = data.notifications ?? data;
        setNotifications(apiNotifications);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unable to load notifications');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await apiRequest(`/api/notifications/${id}/update/`, {
        method: 'PUT',
        body: JSON.stringify({ read: true }),
      });
      setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.read)
          .map((n) => apiRequest(`/api/notifications/${n.id}/update/`, {
            method: 'PUT',
            body: JSON.stringify({ read: true }),
          }))
      );
      setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await apiRequest(`/api/notifications/${id}/delete/`, {
        method: 'DELETE',
      });
      setNotifications((ns) => ns.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Stay on top of your finances with smart, contextual alerts.</p>
        </div>
        <Button variant="secondary" size="sm" icon={<Check className="w-4 h-4" />} onClick={markAllRead}>Mark all read</Button>
      </div>

      {loading && (
        <div className="glass rounded-3xl p-12 flex items-center justify-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading notifications...</p>
        </div>
      )}

      {error && (
        <div className="glass rounded-3xl p-6" style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
          <p className="text-sm font-medium" style={{ color: '#EF4444' }}>Unable to load notifications: {error}</p>
        </div>
      )}

      {!loading && !error && notifications.length === 0 && (
        <div className="glass rounded-3xl p-12 flex items-center justify-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No notifications yet.</p>
        </div>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((n, i) => {
            const config = typeConfig[n.type as keyof typeof typeConfig] ?? typeConfig.info;
            const Icon = config.icon;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ x: 4 }}
                className={`glass rounded-2xl p-4 flex items-start gap-4 transition-all ${!n.read ? 'gradient-border' : ''}`}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${config.color}20`, color: config.color }}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{n.title}</h3>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{formatDate(n.created_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-xs font-medium hover:underline"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="p-1.5 rounded-lg hover:bg-white/5"
                    style={{ color: 'var(--text-muted)' }}
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {n.type === 'danger' && <Badge variant="danger">Urgent</Badge>}
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && !error && notifications.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6 text-center">
          <BellRing className="w-8 h-8 mx-auto mb-2 text-blue-400" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>You're all caught up! We'll notify you when something needs your attention.</p>
        </motion.div>
      )}
    </div>
  );
}