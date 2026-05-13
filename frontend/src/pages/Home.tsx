// src/pages/Home.tsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f8fafc' }}>

      {/* ── Navbar ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 32px', background: 'white', borderBottom: '1px solid #e2e8f0'
      }}>
        <span style={{ fontWeight: 700, fontSize: 20, color: '#2563eb' }}>🧵 Life Threads</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid #2563eb',
            color: '#2563eb', textDecoration: 'none', fontSize: 14
          }}>
            Entrar
          </Link>
          <Link to="/register" style={{
            padding: '8px 16px', borderRadius: 8, background: '#2563eb',
            color: 'white', textDecoration: 'none', fontSize: 14
          }}>
            Criar conta
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ textAlign: 'center', padding: '80px 24px 64px' }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: '#0f172a', marginBottom: 16, lineHeight: 1.2 }}>
          As tuas memórias,<br />
          <span style={{ color: '#2563eb' }}>num só lugar</span>
        </h1>
        <p style={{ fontSize: 18, color: '#64748b', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Cria diários pessoais, partilha momentos com quem amas
          e explora as tuas memórias com inteligência artificial.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/register" style={{
            padding: '14px 28px', borderRadius: 10, background: '#2563eb',
            color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: 16
          }}>
            Começar agora — é grátis
          </Link>
          <Link to="/login" style={{
            padding: '14px 28px', borderRadius: 10, border: '1px solid #cbd5e1',
            color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: 16
          }}>
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, color: '#0f172a', marginBottom: 40 }}>
          Tudo o que precisas para guardar o que importa
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {[
            {
              icon: '📖',
              title: 'Diário Pessoal',
              desc: 'Regista os teus dias, pensamentos e memórias em Threads privadas. O teu espaço, à tua maneira.'
            },
            {
              icon: '👨‍👩‍👧‍👦',
              title: 'Colaboração',
              desc: 'Convida família e amigos para construírem memórias partilhadas juntos, cada um com a sua perspetiva.'
            },
            {
              icon: '✨',
              title: 'IA integrada',
              desc: 'Tags automáticas, resumos de threads e pesquisa semântica — encontra qualquer memória em segundos.'
            },
            {
              icon: '📍',
              title: 'Localização',
              desc: 'Associa lugares às tuas entradas e revive onde cada memória aconteceu.'
            },
            {
              icon: '🔒',
              title: 'Privacidade total',
              desc: 'Controla quem vê o quê. Threads privadas, partilhadas por convite ou públicas — escoles tu.'
            },
            {
              icon: '🔔',
              title: 'Notificações',
              desc: 'Sabe quando alguém comenta, reage ou te convida para uma Thread em tempo real.'
            }
          ].map(f => (
            <div key={f.title} style={{
              background: 'white', borderRadius: 12, padding: 24,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 600, fontSize: 16, color: '#0f172a', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Scenarios ── */}
      <section style={{ background: '#eff6ff', padding: '64px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, color: '#0f172a', marginBottom: 40 }}>
            Para cada momento da tua vida
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                emoji: '🎂',
                title: 'Arquivo de família',
                desc: 'A Ana criou uma Thread colaborativa para o aniversário da avó. Cada familiar adicionou fotos e memórias — um presente único e inesquecível.'
              },
              {
                emoji: '📝',
                title: 'O diário pessoal',
                desc: 'O Miguel regista a sua semana todos os domingos. A IA diz-lhe que os temas mais frequentes são "trabalho", "amigos" e "passeios em família".'
              },
              {
                emoji: '🎓',
                title: 'O grupo de amigos',
                desc: 'Um grupo de universitários documenta o último ano juntos — a mesma viagem vista de perspetivas diferentes, agrupada automaticamente por data.'
              }
            ].map(s => (
              <div key={s.title} style={{
                background: 'white', borderRadius: 12, padding: 20,
                display: 'flex', gap: 16, alignItems: 'flex-start',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
              }}>
                <span style={{ fontSize: 32, flexShrink: 0 }}>{s.emoji}</span>
                <div>
                  <h3 style={{ fontWeight: 600, color: '#0f172a', marginBottom: 4, fontSize: 15 }}>{s.title}</h3>
                  <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
          Pronto para começar?
        </h2>
        <p style={{ color: '#64748b', marginBottom: 32, fontSize: 16 }}>
          Cria a tua conta gratuitamente e guarda o teu primeiro momento hoje.
        </p>
        <Link to="/register" style={{
          padding: '14px 32px', borderRadius: 10, background: '#2563eb',
          color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: 16
        }}>
          Criar conta grátis
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid #e2e8f0', padding: '24px',
        textAlign: 'center', color: '#94a3b8', fontSize: 13
      }}>
        © 2026 Life Threads · Feito com ❤️ pelo Grupo 8
      </footer>

    </div>
  );
}