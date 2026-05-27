import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('Suite de Testes - Threads', () => {

  const setup = async () => {
    const email = `thread_${Date.now()}@gmail.com`;
    await request(app)
      .post('/api/users/auth/register')
      .send({ name: 'Thread User', email, password: 'Segura1!', avatar: '' });
    const login = await request(app)
      .post('/api/users/auth/login')
      .send({ email, password: 'Segura1!' });
    return login.body.token as string;
  };

  // ── Create ────────────────────────────────────────────────────────────────

  it('Deve retornar 201 ao criar uma nova thread', async () => {
    const token = await setup();

    const response = await request(app)
      .post('/api/threads')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Memories', description: 'Family memories' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.visibility).toBe(false);
  });

  it('Deve retornar 400 ao criar thread com título curto', async () => {
    const token = await setup();

    const response = await request(app)
      .post('/api/threads')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'AB', description: 'desc' }); // título com menos de 3 caracteres

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar 400 ao criar thread sem descrição', async () => {
    const token = await setup();

    const response = await request(app)
      .post('/api/threads')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Valid Title' }); // descrição omitida propositadamente

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar 401 ao criar thread sem token', async () => {
    const response = await request(app)
      .post('/api/threads')
      .send({ title: 'No Auth', description: 'desc' });

    expect(response.status).toBe(401);
  });

  // ── List ──────────────────────────────────────────────────────────────────

  it('Deve retornar 200 e lista de threads do utilizador', async () => {
    const token = await setup();

    const response = await request(app)
      .get('/api/threads')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // ── Get by id ─────────────────────────────────────────────────────────────

  it('Deve retornar 200 ao obter thread do próprio utilizador', async () => {
    const token = await setup();

    const created = await request(app)
      .post('/api/threads')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My Thread', description: 'desc' });

    const response = await request(app)
      .get(`/api/threads/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(created.body.id);
  });

  it('Deve retornar 403 ao aceder a thread privada de outro utilizador', async () => {
    const ownerToken = await setup();
    const otherToken = await setup();

    const created = await request(app)
      .post('/api/threads')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Private', description: 'desc' });

    const response = await request(app)
      .get(`/api/threads/${created.body.id}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar 404 para thread inexistente', async () => {
    const token = await setup();

    const response = await request(app)
      .get('/api/threads/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  // ── Update ────────────────────────────────────────────────────────────────

  it('Deve retornar 200 ao atualizar a própria thread', async () => {
    const token = await setup();

    const created = await request(app)
      .post('/api/threads')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Old Title', description: 'old' });

    const response = await request(app)
      .put(`/api/threads/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Title', description: 'new' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('New Title');
  });

  it('Deve retornar 403 ao atualizar thread de outro utilizador', async () => {
    const ownerToken = await setup();
    const otherToken = await setup();

    const created = await request(app)
      .post('/api/threads')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Not Mine', description: 'desc' });

    const response = await request(app)
      .put(`/api/threads/${created.body.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Hacked', description: 'desc' });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error');
  });

  // ── Visibility ────────────────────────────────────────────────────────────

  it('Deve retornar 200 ao tornar thread pública', async () => {
    const token = await setup();

    const created = await request(app)
      .post('/api/threads')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Go Public', description: 'desc' });

    const response = await request(app)
      .put(`/api/threads/${created.body.id}/visibility`)
      .set('Authorization', `Bearer ${token}`)
      .send({ visibility: true });

    expect(response.status).toBe(200);
    expect(response.body.visibility).toBe(true);
  });

  // ── Explore & Search ──────────────────────────────────────────────────────

  it('Deve retornar 200 ao explorar threads públicas sem autenticação', async () => {
    const response = await request(app).get('/api/threads/explore');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Deve retornar 200 ao pesquisar threads públicas', async () => {
    const response = await request(app).get('/api/threads/search?q=Public');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Deve retornar 400 ao pesquisar sem query', async () => {
    const response = await request(app).get('/api/threads/search');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // ── Delete ────────────────────────────────────────────────────────────────

  it('Deve retornar 204 ao eliminar a própria thread', async () => {
    const token = await setup();

    const created = await request(app)
      .post('/api/threads')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'To Delete', description: 'desc' });

    const response = await request(app)
      .delete(`/api/threads/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it('Deve retornar 403 ao eliminar thread de outro utilizador', async () => {
    const ownerToken = await setup();
    const otherToken = await setup();

    const created = await request(app)
      .post('/api/threads')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Not Yours', description: 'desc' });

    const response = await request(app)
      .delete(`/api/threads/${created.body.id}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error');
  });

});