import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', gap: '20px', padding: '20px', background: '#f4f4f4', borderBottom: '1px solid #ddd' }}>
      <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'black' }}>LifeThreads</Link>
      <Link to="/threads" style={{ textDecoration: 'none', color: 'blue' }}>Threads</Link>
      <Link to="/notifications" style={{ textDecoration: 'none', color: 'blue' }}>🔔 Notificações</Link>
      <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>Sair</button>
    </nav>
  );
}

export default Navbar;
