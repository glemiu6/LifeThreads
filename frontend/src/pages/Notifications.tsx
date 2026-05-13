import { useEffect, useState } from 'react';
import api from '../api/client';
import Navbar from '../components/layout/Navbar';

const typeLabel: Record<string, string> = {
  INVITE: '📩 Convite para uma Thread',
  COMMENT: '💬 Novo comentário',
  REACT: '❤️ Nova reação',
  FOLLOW: '👤 Novo seguidor'
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/notifications').then(r => setNotifications(r.data)).finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await api.put('/api/notifications/status');
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const deleteNotification = async (id: number) => {
    await api.delete(`/api/notifications/${id}`);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  if (loading) return <><Navbar /><div style={{ padding: 24 }}>A carregar...</div></>;

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>🔔 Notificações</h1>
          {notifications.some(n => !n.is_read) && (
            <button onClick={markAllRead} style={{ fontSize: 13, padding: '6px 14px', borderRadius: 8, border: 'none', background: '#eff6ff', color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}>
              Marcar todas como lidas
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: 48 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔕</div>
            <p>Não tens notificações.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notifications.map(n => (
              <div key={n.id} style={{ background: n.is_read ? 'white' : '#eff6ff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: n.is_read ? 'none' : '3px solid #2563eb' }}>
                <div>
                  <p style={{ fontWeight: 600, color: '#0f172a', margin: 0, fontSize: 14 }}>
                    {typeLabel[n.type] ?? n.type}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: 12, margin: '2px 0 0' }}>
                    {new Date(n.created_at).toLocaleDateString('pt-PT')}
                  </p>
                </div>
                <button onClick={() => deleteNotification(n.id)} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 8, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}>
                  Apagar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}