import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import { prisma } from '../lib/prisma.js';

describe('Suite de Testes - Notifications', () => {

  const setup = async () => {
    const email = `notif_${Date.now()}@gmail.com`;
    await request(app)
      .post('/api/users/auth/register')
      .send({ name: 'Notif User', email, password: 'Segura1!', avatar: '' });
    const login = await request(app)
      .post('/api/users/auth/login')
      .send({ email, password: 'Segura1!' });
    const token = login.body.token as string;
    const userId = JSON.parse(atob(token.split('.')[1])).id as number;
    return { token, userId };
  };

  // ── Get ───────────────────────────────────────────────────────────────────

  it('Deve retornar 200 e lista de notificações do utilizador', async () => {
    const { token, userId } = await setup();

    await prisma.notification.create({
      data: { userId, type: 'INVITE', is_read: false }
    });

    const response = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('Deve retornar 401 sem token', async () => {
    const response = await request(app).get('/api/notifications');

    expect(response.status).toBe(401);
  });

  // ── Create ────────────────────────────────────────────────────────────────

  it('Deve retornar 201 ao criar uma notificação', async () => {
    const { token, userId } = await setup();

    const response = await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId, type: 'FOLLOW' });

    expect(response.status).toBe(201);
    expect(response.body.type).toBe('FOLLOW');
  });

  it('Deve retornar 400 com tipo de notificação inválido', async () => {
    const { token, userId } = await setup();

    const response = await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId, type: 'INVALIDO' }); // tipo inválido propositadamente

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // ── Mark all read ─────────────────────────────────────────────────────────

  it('Deve retornar 204 ao marcar todas as notificações como lidas', async () => {
    const { token, userId } = await setup();

    await prisma.notification.create({
      data: { userId, type: 'COMMENT', is_read: false }
    });

    const response = await request(app)
      .put('/api/notifications/status')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  // ── Delete ────────────────────────────────────────────────────────────────

  it('Deve retornar 204 ao eliminar uma notificação', async () => {
    const { token, userId } = await setup();

    const notif = await prisma.notification.create({
      data: { userId, type: 'REACT', is_read: false }
    });

    const response = await request(app)
      .delete(`/api/notifications/${notif.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

});