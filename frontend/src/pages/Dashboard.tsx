import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Navbar from '../components/layout/Navbar';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const userId = JSON.parse(atob(localStorage.getItem('token')!.split('.')[1])).id;

  useEffect(() => {
    api.get(`/api/users/${userId}`)
      .then(r => setUser(r.data))
      .catch(err => console.error('failed to load user:', err.response?.data));

    api.get('/api/threads')
      .then(r => setThreads(r.data.slice(0, 3)))
      .catch(err => console.error('failed to load threads:', err.response?.data));

    api.get('/api/notifications')
      .then(r => setNotifications(r.data.filter((n: any) => !n.is_read).slice(0, 3)))
      .catch(err => console.error('failed to load notifications:', err.response?.data));
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>

        {/* Profile card */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#2563eb', flexShrink: 0 }}>
            {user?.avatar
              ? <img src={user.avatar} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
              : user?.name?.[0] ?? '?'}
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 }}>
              {user?.name ?? '...'}
            </h1>
            <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
              {user?.bio ?? 'Sem bio'}
            </p>
          </div>
        </div>

        {/* Unread notifications */}
        {notifications.length > 0 && (
          <div style={{ background: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1d4ed8', margin: 0 }}>🔔 Notificações não lidas</h2>
              <Link to="/notifications" style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none' }}>Ver todas</Link>
            </div>
            {notifications.map((n: any) => (
              <div key={n.id} style={{ fontSize: 13, color: '#1e40af', padding: '4px 0', borderBottom: '1px solid #bfdbfe' }}>
                {n.type}
              </div>
            ))}
          </div>
        )}

        {/* Recent threads */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', margin: 0 }}>Threads recentes</h2>
          <Link to="/threads" style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none' }}>Ver todas →</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {threads.length === 0 && (
            <div style={{ background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
              Ainda não tens threads.{' '}
              <Link to="/threads" style={{ color: '#2563eb', textDecoration: 'none' }}>Criar uma</Link>
            </div>
          )}
          {threads.map((t: any) => (
            <Link key={t.id} to={`/threads/${t.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600, color: '#0f172a', margin: 0 }}>{t.title}</p>
                  <p style={{ color: '#64748b', fontSize: 13, margin: '2px 0 0' }}>{t.description}</p>
                </div>
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 999, background: t.visibility ? '#dcfce7' : '#f1f5f9', color: t.visibility ? '#16a34a' : '#64748b' }}>
                  {t.visibility ? 'Pública' : 'Privada'}
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </>
  );
}