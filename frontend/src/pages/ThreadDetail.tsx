import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import Navbar from '../components/layout/Navbar';

interface Entry { id: number; title: string; body: string; entry_date: string; is_published: boolean; location?: string; tags?: { tag: { name: string } }[]; }

export default function ThreadDetail() {
  const { id } = useParams();
  const [thread, setThread] = useState<any>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState({ title: '', body: '', location: '' });
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [draftPrompt, setDraftPrompt] = useState('');
  const [drafting, setDrafting] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResults, setAiResults] = useState<Entry[]>([]);
  const [aiSearching, setAiSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'entries' | 'ai'>('entries');

  useEffect(() => {
    api.get(`/api/threads/${id}`).then(r => setThread(r.data));
    api.get(`/api/threads/${id}/entries`).then(r => setEntries(r.data));
  }, [id]);

  const createEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post(`/api/threads/${id}/entries`, form);
    setEntries([res.data, ...entries]);
    setForm({ title: '', body: '', location: '' });
  };

  const updateStatus = async (entry: Entry) => {
    const res = await api.put(`/api/entries/${entry.id}/status`, { is_published: !entry.is_published });
    setEntries(entries.map(e => e.id === entry.id ? { ...e, ...res.data } : e));
  };

  const deleteEntry = async (entryId: number) => {
    if (!confirm('Eliminar esta entrada?')) return;
    await api.delete(`/api/entries/${entryId}`);
    setEntries(entries.filter(e => e.id !== entryId));
  };

  const autoTag = async (entryId: number) => {
    const res = await api.post(`/api/entries/${entryId}/tags`);
    alert(`Tags geradas: ${res.data.tags.join(', ')}`);
    // refresh entries to show new tags
    const updated = await api.get(`/api/threads/${id}/entries`);
    setEntries(updated.data);
  };

  const handleSummarize = async () => {
    setSummarizing(true);
    try {
      const res = await api.get(`/api/threads/${id}/summary`);
      setSummary(res.data.summary);
    } catch { alert('Erro ao gerar resumo.'); }
    finally { setSummarizing(false); }
  };

  const handleDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setDrafting(true);
    try {
      const res = await api.post('/api/entries/draft', { prompt: draftPrompt });
      setForm({ title: res.data.title, body: res.data.body, location: '' });
      setDraftPrompt('');
      setActiveTab('entries');
    } catch { alert('Erro ao gerar rascunho.'); }
    finally { setDrafting(false); }
  };

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiSearching(true);
    try {
      const res = await api.post('/api/entries/search', { q: aiQuery, threadId: Number(id), limit: 5 });
      setAiResults(res.data);
    } catch { alert('Erro na pesquisa.'); }
    finally { setAiSearching(false); }
  };

  if (!thread) return <><Navbar /><div style={{ padding: 24 }}>A carregar...</div></>;

  const tabStyle = (tab: string) => ({
    padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
    background: activeTab === tab ? '#2563eb' : '#f1f5f9',
    color: activeTab === tab ? 'white' : '#64748b'
  });

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 }}>{thread.title}</h1>
          <p style={{ color: '#64748b', marginTop: 4 }}>{thread.description}</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <button style={tabStyle('entries')} onClick={() => setActiveTab('entries')}>📖 Entradas</button>
          <button style={tabStyle('ai')} onClick={() => setActiveTab('ai')}>✨ IA</button>
        </div>

        {/* ── Entries tab ── */}
        {activeTab === 'entries' && (
          <>
            {/* New entry form */}
            <form onSubmit={createEntry} style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Nova Entrada</h2>
              <input style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}
                placeholder="Título" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} required />
              <textarea style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 14, resize: 'vertical' }}
                placeholder="Escreve a tua memória..." rows={4} value={form.body}
                onChange={e => setForm({ ...form, body: e.target.value })} required />
              <input style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}
                placeholder="Localização (opcional)" value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })} />
              <button style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: 10, fontWeight: 600, cursor: 'pointer' }}>
                Adicionar entrada
              </button>
            </form>

            {/* Entry list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {entries.map(entry => (
                <div key={entry.id} style={{ background: 'white', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h3 style={{ fontWeight: 600, color: '#0f172a', margin: 0 }}>{entry.title}</h3>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: entry.is_published ? '#dcfce7' : '#f1f5f9', color: entry.is_published ? '#16a34a' : '#94a3b8' }}>
                      {entry.is_published ? 'Publicada' : 'Rascunho'}
                    </span>
                  </div>
                  <p style={{ color: '#475569', fontSize: 14, margin: '0 0 8px', lineHeight: 1.6 }}>{entry.body}</p>
                  {entry.location && <p style={{ color: '#94a3b8', fontSize: 12, margin: '0 0 8px' }}>📍 {entry.location}</p>}

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                      {entry.tags.map(t => (
                        <span key={t.tag.name} style={{ background: '#eff6ff', color: '#2563eb', fontSize: 11, padding: '2px 8px', borderRadius: 999 }}>
                          #{t.tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => updateStatus(entry)} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 8, border: 'none', background: '#eff6ff', color: '#2563eb', cursor: 'pointer' }}>
                      {entry.is_published ? 'Despublicar' : 'Publicar'}
                    </button>
                    <button onClick={() => autoTag(entry.id)} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 8, border: 'none', background: '#f5f3ff', color: '#7c3aed', cursor: 'pointer' }}>
                      ✨ Auto-tag
                    </button>
                    <button onClick={() => deleteEntry(entry.id)} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 8, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── AI tab ── */}
        {activeTab === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Summary */}
            <div style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>📝 Resumo da Thread</h2>
                <button onClick={handleSummarize} disabled={summarizing} style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: summarizing ? 'not-allowed' : 'pointer', opacity: summarizing ? 0.7 : 1 }}>
                  {summarizing ? 'A gerar...' : 'Gerar resumo'}
                </button>
              </div>
              {summary && <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic', margin: 0, background: '#f8fafc', padding: 14, borderRadius: 8 }}>{summary}</p>}
            </div>

            {/* Draft generator */}
            <div style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>🤖 Gerar Rascunho com IA</h2>
              <form onSubmit={handleDraft} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}
                  placeholder='Ideia, ex: "passeio na praia ao pôr do sol"'
                  value={draftPrompt} onChange={e => setDraftPrompt(e.target.value)} required />
                <button disabled={drafting} style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: 8, padding: 10, fontWeight: 600, cursor: drafting ? 'not-allowed' : 'pointer', opacity: drafting ? 0.7 : 1 }}>
                  {drafting ? 'A gerar...' : '✨ Gerar rascunho'}
                </button>
              </form>
              {draftPrompt === '' && form.title && (
                <p style={{ fontSize: 12, color: '#7c3aed', marginTop: 8 }}>✓ Rascunho pronto no separador Entradas — edita e guarda!</p>
              )}
            </div>

            {/* Semantic search */}
            <div style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>🔍 Pesquisa Semântica</h2>
              <form onSubmit={handleAiSearch} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 14, flex: 1 }}
                  placeholder='Ex: "momentos felizes" ou "viagens com amigos"'
                  value={aiQuery} onChange={e => setAiQuery(e.target.value)} />
                <button disabled={aiSearching} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '0 16px', fontWeight: 600, cursor: aiSearching ? 'not-allowed' : 'pointer', opacity: aiSearching ? 0.7 : 1 }}>
                  {aiSearching ? '...' : 'Pesquisar'}
                </button>
              </form>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {aiResults.map(e => (
                  <div key={e.id} style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 8, borderLeft: '3px solid #2563eb' }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', margin: '0 0 2px' }}>{e.title}</p>
                    <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>{e.body.slice(0, 120)}...</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}