import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('Suite de Testes - Users', () => {

  const getTokenAndId = async () => {
    const email = `user_${Date.now()}@gmail.com`;
    await request(app)
      .post('/api/users/auth/register')
      .send({ name: 'Test User', email, password: 'Segura1!', avatar: '' });
    const login = await request(app)
      .post('/api/users/auth/login')
      .send({ email, password: 'Segura1!' });
    const id = JSON.parse(atob(login.body.token.split('.')[1])).id;
    return { token: login.body.token as string, id: id as number };
  };

  // ── Get profile ───────────────────────────────────────────────────────────

  it('Deve retornar 200 ao obter o próprio perfil', async () => {
    const { token, id } = await getTokenAndId();

    const response = await request(app)
      .get(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).not.toHaveProperty('password');
  });

  it('Deve retornar 401 sem token ao obter perfil', async () => {
    const { id } = await getTokenAndId();

    const response = await request(app).get(`/api/users/${id}`);

    expect(response.status).toBe(401);
  });

  // ── Update profile ────────────────────────────────────────────────────────

  it('Deve retornar 200 ao atualizar o próprio perfil', async () => {
    const { token, id } = await getTokenAndId();

    const response = await request(app)
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nome Atualizado', bio: 'Nova bio' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Nome Atualizado');
  });

  it('Deve retornar 403 ao tentar atualizar outro utilizador', async () => {
    const { token } = await getTokenAndId();
    const { id: otherId } = await getTokenAndId();

    const response = await request(app)
      .put(`/api/users/${otherId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Hacked' });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error');
  });

  // ── Search ────────────────────────────────────────────────────────────────

  it('Deve retornar 200 ao pesquisar utilizadores', async () => {
    const response = await request(app)
      .get('/api/users/search?query=Test');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Deve retornar 400 ao pesquisar sem query', async () => {
    const response = await request(app).get('/api/users/search');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // ── Follow ────────────────────────────────────────────────────────────────

  it('Deve retornar 201 ao seguir outro utilizador', async () => {
    const { token } = await getTokenAndId();
    const { id: otherId } = await getTokenAndId();

    const response = await request(app)
      .post(`/api/users/${otherId}/follow`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
  });

  it('Deve retornar 400 ao tentar seguir-se a si próprio', async () => {
    const { token, id } = await getTokenAndId();

    const response = await request(app)
      .post(`/api/users/${id}/follow`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar 204 ao deixar de seguir', async () => {
    const { token } = await getTokenAndId();
    const { id: otherId } = await getTokenAndId();

    await request(app)
      .post(`/api/users/${otherId}/follow`)
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .delete(`/api/users/${otherId}/follow`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  // ── Delete ────────────────────────────────────────────────────────────────

  it('Deve retornar 204 ao eliminar a própria conta', async () => {
    const { token, id } = await getTokenAndId();

    const response = await request(app)
      .delete(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

});