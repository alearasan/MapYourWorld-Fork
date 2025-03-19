import request from 'supertest';
import { Request, Response } from 'express';
import app from '../index';
import { Server } from 'http';

let server: Server;

beforeAll((done) => {
  server = app.listen(3001, () => {
    console.log('Servidor en ejecución en puerto 3001 para tests');
    done();
  });
});

afterAll((done) => {
  if (server) {
    server.close(() => {
      console.log('Servidor cerrado');
      done();
    });
  }
});

describe('Auth Service - Pruebas de Endpoints', () => {
  // Variables globales para almacenar datos del usuario de prueba
  let testUserToken: string;
  let testUserId: string;

  describe('POST /api/auth/register', () => {
    it('debe registrar un usuario nuevo y retornar token y datos mínimos', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'usuario_prueba@example.com',
          password: 'Password1!',
          profile: {
            username: 'usuario_prueba',
            firstName: 'Usuario',
            lastName: 'Prueba'
          }
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('usuario_prueba@example.com');

      // Guardamos el token y el id para pruebas posteriores
      testUserToken = response.body.token;
      testUserId = response.body.user.id;
    });

    it('debe retornar error por email inválido', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'no-es-un-email',
          password: 'Password1!'
        });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('debe iniciar sesión correctamente con credenciales válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'usuario_prueba@example.com',
          password: 'Password1!'
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });
  });
});
