import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 18, color: '#2563eb', textDecoration: 'none' }}>
          🧵 Life Threads
        </Link>
        <Link to="/threads" style={{ fontSize: 14, color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Threads</Link>
        <Link to="/entries" style={{ fontSize: 14, color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Pesquisa</Link>
        <Link to="/notifications" style={{ fontSize: 14, color: '#475569', textDecoration: 'none', fontWeight: 500 }}>🔔 Notificações</Link>
      </div>
      <button onClick={handleLogout} style={{ fontSize: 13, padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', fontWeight: 500 }}>
        Sair
      </button>
    </nav>
  );
}