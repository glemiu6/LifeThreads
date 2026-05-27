import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('Suite de Testes - Auth', () => {

  // ── Register ──────────────────────────────────────────────────────────────

  it('Deve retornar 201 ao registar um novo utilizador', async () => {
    const response = await request(app)
      .post('/api/users/auth/register')
      .send({
        name: 'João Silva',
        email: `joao_${Date.now()}@gmail.com`,
        password: 'Segura1!',
        avatar: ''
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email');
    expect(response.body).not.toHaveProperty('password');
  });

  it('Deve retornar 400 ao registar sem email', async () => {
    const response = await request(app)
      .post('/api/users/auth/register')
      .send({
        name: 'João Silva',
        password: 'Segura1!',
        avatar: ''
        // email omitido propositadamente
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar 400 com password fraca', async () => {
    const response = await request(app)
      .post('/api/users/auth/register')
      .send({
        name: 'João Silva',
        email: `fraca_${Date.now()}@gmail.com`,
        password: 'fraca', // sem maiúsculas, número ou símbolo
        avatar: ''
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar 409 ao registar com email duplicado', async () => {
    const email = `dup_${Date.now()}@gmail.com`;

    await request(app)
      .post('/api/users/auth/register')
      .send({ name: 'User Um', email, password: 'Segura1!', avatar: '' });

    const response = await request(app)
      .post('/api/users/auth/register')
      .send({ name: 'User Dois', email, password: 'Segura1!', avatar: '' });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('error');
  });

  // ── Login ─────────────────────────────────────────────────────────────────

  it('Deve retornar 200 e um token JWT ao fazer login', async () => {
    const email = `login_${Date.now()}@gmail.com`;

    await request(app)
      .post('/api/users/auth/register')
      .send({ name: 'Login User', email, password: 'Segura1!', avatar: '' });

    const response = await request(app)
      .post('/api/users/auth/login')
      .send({ email, password: 'Segura1!' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
  });

  it('Deve retornar 401 com password errada', async () => {
    const email = `wrong_${Date.now()}@gmail.com`;

    await request(app)
      .post('/api/users/auth/register')
      .send({ name: 'Wrong User', email, password: 'Segura1!', avatar: '' });

    const response = await request(app)
      .post('/api/users/auth/login')
      .send({ email, password: 'Errada1!' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar 401 com email inexistente', async () => {
    const response = await request(app)
      .post('/api/users/auth/login')
      .send({ email: 'naoexiste@gmail.com', password: 'Segura1!' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

});