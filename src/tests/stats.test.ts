import app from '../app'
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { connectDB } from '../config/db';
import dotenv from 'dotenv'

dotenv.config()

describe('Stats Protected Routes', () => {

  beforeAll(async () => {
      await connectDB();
  });
  
  it('Debería denegar el acceso (401) si no se envía un token', async () => {
    
    const response = await request(app)
      .get('/stats/inventory-value'); 

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/token/i); 
  });

  it('Debería permitir el acceso si el token es válido', async () => {

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ username: 'ivanIA', password: '12345' });

    const token = loginRes.body.token;

    // 2. Usamos ese token para pedir las stats
    const response = await request(app)
      .get('/stats/inventory-value')
      .set('Authorization', `Bearer ${token}`); 

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('InventoryValue'); // O lo que devuelva tu ruta
  });
});