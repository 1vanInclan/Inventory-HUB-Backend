import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app'; 
import { connectDB } from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

describe('Auth Integration', () => {
  // Opcional: Solo si necesita la DB real, conéctala aquí
  beforeAll(async () => {
    await connectDB();
  });

  it('POST /auth/login - Éxito total', async () => {
    const response = await request(app)
      .post('/auth/login') // Nota que ahora usas la ruta real
      .send({
        username: 'ivanIA',
        password: '12345'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Loggeado con exito');
  });

  it('POST /auth/login - Datos erroneos', async () => {
    const response = await request(app)
      .post('/auth/login') 
      .send({
        username: 'ivanI',
        password: '12345'
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Credenciales inválidas');
  });

  it('POST /auth/login - Datos erroneos con el tipo', async () => {
    const response = await request(app)
      .post('/auth/login') 
      .send({
        username: 'ivanI',
        password: 12345
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Credenciales inválidas');
  })

  it('POST /auth/login - Contrasenia erronea', async () => {
    const response = await request(app)
      .post('/auth/login') 
      .send({
        username: 'ivanIA',
        password: "123456"
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Credenciales inválidas');
  })
});