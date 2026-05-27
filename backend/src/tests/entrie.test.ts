import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('Suite de Testes - Entries', () => {

  const setup = async () => {
    const email = `entry_${Date.now()}@gmail.com`;
    await request(app)
      .post('/api/users/auth/register')
      .send({ name: 'Entry User', email, password: 'Segura1!', avatar: '' });
    const login = await request(app)
      .post('/api/users/auth/login')
      .send({ email, password: 'Segura1!' });
    const token = login.body.token as string;

    const thread = await request(app)
      .post('/api/threads')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Entry Thread', description: 'desc' });

    return { token, threadId: thread.body.id as number };
  };

  // ── Create ────────────────────────────────────────────────────────────────

  it('Deve retornar 201 ao criar uma nova entrada', async () => {
    const { token, threadId } = await setup();

    const response = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My Memory', body: 'Today was a great day' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.is_published).toBe(false);
  });

  it('Deve retornar 400 ao criar entrada sem título', async () => {
    const { token, threadId } = await setup();

    const response = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'No title here' }); // título omitido propositadamente

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar 400 ao criar entrada sem corpo', async () => {
    const { token, threadId } = await setup();

    const response = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'No Body' }); // corpo omitido propositadamente

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // ── List ──────────────────────────────────────────────────────────────────

  it('Deve retornar 200 e lista de entradas de uma thread', async () => {
    const { token, threadId } = await setup();

    await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Entry 1', body: 'Body 1' });

    const response = await request(app)
      .get(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // ── Get by id ─────────────────────────────────────────────────────────────

  it('Deve retornar 200 ao obter uma entrada pelo id', async () => {
    const { token, threadId } = await setup();

    const created = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Get Me', body: 'Some body' });

    const response = await request(app)
      .get(`/api/entries/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(created.body.id);
  });

  it('Deve retornar 404 para entrada inexistente', async () => {
    const { token } = await setup();

    const response = await request(app)
      .get('/api/entries/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  // ── Update ────────────────────────────────────────────────────────────────

  it('Deve retornar 200 ao atualizar uma entrada', async () => {
    const { token, threadId } = await setup();

    const created = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Old', body: 'Old body' });

    const response = await request(app)
      .put(`/api/entries/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated', body: 'Updated body' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated');
  });

  // ── Status ────────────────────────────────────────────────────────────────

  it('Deve retornar 200 ao publicar uma entrada', async () => {
    const { token, threadId } = await setup();

    const created = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Publish Me', body: 'body' });

    const response = await request(app)
      .put(`/api/entries/${created.body.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ is_published: true });

    expect(response.status).toBe(200);
    expect(response.body.is_published).toBe(true);
  });

  it('Deve retornar 200 ao despublicar uma entrada', async () => {
    const { token, threadId } = await setup();

    const created = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Unpublish Me', body: 'body' });

    await request(app)
      .put(`/api/entries/${created.body.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ is_published: true });

    const response = await request(app)
      .put(`/api/entries/${created.body.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ is_published: false });

    expect(response.status).toBe(200);
    expect(response.body.is_published).toBe(false);
  });

  it('Deve retornar 400 ao alterar status sem campo is_published', async () => {
    const { token, threadId } = await setup();

    const created = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Status Test', body: 'body' });

    const response = await request(app)
      .put(`/api/entries/${created.body.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({}); // campo omitido propositadamente

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // ── Comments ──────────────────────────────────────────────────────────────

  it('Deve retornar 201 ao adicionar um comentário', async () => {
    const { token, threadId } = await setup();

    const created = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Comment Test', body: 'body' });

    const response = await request(app)
      .post(`/api/entries/${created.body.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Great memory!' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.body).toBe('Great memory!');
  });

  it('Deve retornar 400 ao comentar com corpo vazio', async () => {
    const { token, threadId } = await setup();

    const created = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Comment Empty', body: 'body' });

    const response = await request(app)
      .post(`/api/entries/${created.body.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: '' }); // corpo vazio propositadamente

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar 200 ao listar comentários de uma entrada', async () => {
    const { token, threadId } = await setup();

    const created = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'List Comments', body: 'body' });

    await request(app)
      .post(`/api/entries/${created.body.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'A comment' });

    const response = await request(app)
      .get(`/api/entries/${created.body.id}/comments`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // ── Reactions ─────────────────────────────────────────────────────────────

  it('Deve retornar 201 ao reagir a uma entrada', async () => {
    const { token, threadId } = await setup();

    const created = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'React Test', body: 'body' });

    const response = await request(app)
      .post(`/api/entries/${created.body.id}/reactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'LIKE' });

    expect(response.status).toBe(201);
  });

  it('Deve retornar 400 com tipo de reação inválido', async () => {
    const { token, threadId } = await setup();

    const created = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'React Invalid', body: 'body' });

    const response = await request(app)
      .post(`/api/entries/${created.body.id}/reactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'INVALIDO' }); // tipo inválido propositadamente

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar 204 ao remover reação', async () => {
    const { token, threadId } = await setup();

    const created = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Remove React', body: 'body' });

    await request(app)
      .post(`/api/entries/${created.body.id}/reactions`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'HEART' });

    const response = await request(app)
      .delete(`/api/entries/${created.body.id}/reactions`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  // ── Media ─────────────────────────────────────────────────────────────────

  it('Deve retornar 201 ao adicionar media a uma entrada', async () => {
    const { token, threadId } = await setup();

    const created = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Media Test', body: 'body' });

    const response = await request(app)
      .post(`/api/entries/${created.body.id}/media`)
      .set('Authorization', `Bearer ${token}`)
      .send({ url: 'https://example.com/photo.jpg', type: 'image' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('Deve retornar 400 ao adicionar media com URL inválido', async () => {
    const { token, threadId } = await setup();

    const created = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Media Invalid', body: 'body' });

    const response = await request(app)
      .post(`/api/entries/${created.body.id}/media`)
      .set('Authorization', `Bearer ${token}`)
      .send({ url: 'nao-e-url', type: 'image' }); // URL inválido propositadamente

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // ── Delete ────────────────────────────────────────────────────────────────

  it('Deve retornar 204 ao eliminar uma entrada', async () => {
    const { token, threadId } = await setup();

    const created = await request(app)
      .post(`/api/threads/${threadId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Delete Me', body: 'body' });

    const response = await request(app)
      .delete(`/api/entries/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

});