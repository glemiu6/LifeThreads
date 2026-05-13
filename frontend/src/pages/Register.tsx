import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', avatar: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/users/auth/register', form);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Erro no registo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ background: 'white', padding: 40, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: 400 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, textAlign: 'center', color: '#0f172a' }}>
          Criar Conta
        </h1>
        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}
            placeholder="Nome" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}
            type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}
            type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <input style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}
            placeholder="URL do avatar (opcional)" value={form.avatar}
            onChange={e => setForm({ ...form, avatar: e.target.value })} />
          <button disabled={loading} style={{
            background: '#2563eb', color: 'white', border: 'none', borderRadius: 8,
            padding: '12px', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginTop: 4
          }}>
            {loading ? 'A registar...' : 'Criar conta'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
          Já tens conta?{' '}
          <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}