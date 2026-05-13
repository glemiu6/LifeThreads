import { useState } from 'react';
import api from '../api/client';
import Navbar from '../components/layout/Navbar';

export default function Entries() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setSearched(true);
    try {
      const res = await api.post('/api/entries/search', { q: query, limit: 10 });
      setResults(res.data);
    } catch {
      alert('Erro na pesquisa semântica.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>🔍 Pesquisa Semântica</h1>
        <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>
          Pesquisa em linguagem natural por todas as tuas memórias.
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          <input style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 16px', fontSize: 15, flex: 1 }}
            placeholder='Ex: "momentos felizes em família" ou "viagens de verão"'
            value={query} onChange={e => setQuery(e.target.value)} />
          <button disabled={searching} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '0 20px', fontWeight: 600, fontSize: 15, cursor: searching ? 'not-allowed' : 'pointer', opacity: searching ? 0.7 : 1 }}>
            {searching ? 'A pesquisar...' : 'Pesquisar'}
          </button>
        </form>

        {searched && results.length === 0 && !searching && (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: 48 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔎</div>
            <p>Nenhuma memória encontrada para "{query}".</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {results.map(e => (
            <div key={e.id} style={{ background: 'white', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: '3px solid #2563eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <h3 style={{ fontWeight: 600, color: '#0f172a', margin: 0 }}>{e.title}</h3>
                <span style={{ color: '#94a3b8', fontSize: 12 }}>
                  {new Date(e.entry_date).toLocaleDateString('pt-PT')}
                </span>
              </div>
              <p style={{ color: '#475569', fontSize: 14, margin: '0 0 8px', lineHeight: 1.6 }}>
                {e.body.slice(0, 200)}{e.body.length > 200 ? '...' : ''}
              </p>
              {e.location && <p style={{ color: '#94a3b8', fontSize: 12, margin: '0 0 8px' }}>📍 {e.location}</p>}
              {e.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {e.tags.map((t: any) => (
                    <span key={t.tag.name} style={{ background: '#eff6ff', color: '#2563eb', fontSize: 11, padding: '2px 8px', borderRadius: 999 }}>
                      #{t.tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}