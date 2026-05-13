import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Navbar from '../components/layout/Navbar';

interface Thread { id: number; title: string; description: string; visibility: boolean; }

export default function Threads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/threads').then(r => setThreads(r.data)).finally(() => setLoading(false));
  }, []);

  const createThread = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/api/threads', form);
      setThreads([res.data, ...threads]);
      setForm({ title: '', description: '' });
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Erro ao criar thread.');
    }
  };

  const toggleVisibility = async (t: Thread) => {
    const res = await api.put(`/api/threads/${t.id}/visibility`, { visibility: !t.visibility });
    setThreads(threads.map(th => th.id === t.id ? res.data : th));
  };

  const deleteThread = async (id: number) => {
    if (!confirm('Eliminar esta thread?')) return;
    await api.delete(`/api/threads/${id}`);
    setThreads(threads.filter(t => t.id !== id));
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>As minhas Threads</h1>

        {/* Create form */}
        <form onSubmit={createThread} style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Nova Thread</h2>
          {error && <div style={{ color: '#dc2626', fontSize: 13 }}>{error}</div>}
          <input style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}
            placeholder="Título (3-20 caracteres)" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} required />
          <textarea style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 14, resize: 'vertical' }}
            placeholder="Descrição" rows={2} value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} required />
          <button style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '10px', fontWeight: 600, cursor: 'pointer' }}>
            Criar
          </button>
        </form>

        {/* Thread list */}
        {loading ? <p style={{ color: '#94a3b8' }}>A carregar...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {threads.map(t => (
              <div key={t.id} style={{ background: 'white', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to={`/threads/${t.id}`} style={{ textDecoration: 'none', flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#0f172a', margin: 0 }}>{t.title}</p>
                  <p style={{ color: '#64748b', fontSize: 13, margin: '2px 0 0' }}>{t.description}</p>
                </Link>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button onClick={() => toggleVisibility(t)} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, border: 'none', cursor: 'pointer', background: t.visibility ? '#dcfce7' : '#f1f5f9', color: t.visibility ? '#16a34a' : '#64748b' }}>
                    {t.visibility ? 'Pública' : 'Privada'}
                  </button>
                  <button onClick={() => deleteThread(t.id)} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 8, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}