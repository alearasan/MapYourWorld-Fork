/**
 * Tests de integración para el servicio social
 */

import request from 'supertest';
import { Server } from 'http';
import { mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { Friend, FriendStatus } from '../models/friend.model';
import { Photo } from '../models/photo.model';
import { PointOfInterest } from '../../../map-service/src/models/poi.model';
import { User } from '../../../auth-service/src/models/user.model';

// Crear mocks para los repositorios
const mockFriendRepo = mock<Repository<Friend>>();
const mockPhotoRepo = mock<Repository<Photo>>();
const mockPoiRepo = mock<Repository<PointOfInterest>>();
const mockUserRepo = mock<Repository<User>>();

// Mock del AppDataSource
jest.mock('../../../database/appDataSource', () => ({
  AppDataSource: {
    isInitialized: true,
    initialize: jest.fn().mockResolvedValue(undefined),
    getRepository: jest.fn((entity) => {
      if (entity.name === 'Friend') return mockFriendRepo;
      if (entity.name === 'Photo') return mockPhotoRepo;
      if (entity.name === 'PointOfInterest') return mockPoiRepo;
      if (entity.name === 'User') return mockUserRepo;
      return mock<Repository<any>>();
    })
  },
  initializeDatabase: jest.fn().mockResolvedValue(undefined)
}));

// Mock de RabbitMQ
jest.mock('@shared/libs/rabbitmq', () => ({
  connect: jest.fn().mockResolvedValue(true),
  publishEvent: jest.fn().mockResolvedValue(true)
}));

// Importar la app después de configurar los mocks
import app from '../index';

let server: Server;
let testToken: string;

// Datos mock para las pruebas
const mockUser1 = {
  id: 'user-1',
  email: 'user1@example.com',
  username: 'user1'
};

const mockUser2 = {
  id: 'user-2',
  email: 'user2@example.com',
  username: 'user2'
};

const mockPoi = {
  id: 'poi-1',
  name: 'Test POI',
  description: 'A test point of interest'
};

const mockPhoto = {
  id: 'photo-1',
  caption: 'Test Photo',
  url: 'http://example.com/photo.jpg',
  poi: mockPoi,
  user: mockUser1
};


// Setup y teardown
beforeAll(async () => {
  try {
    // Configurar comportamiento de los mocks
    mockUserRepo.findOne = jest.fn().mockImplementation((options) => {
      const userId = options?.where?.id;
      if (userId === mockUser1.id) return Promise.resolve(mockUser1);
      if (userId === mockUser2.id) return Promise.resolve(mockUser2);
      return Promise.resolve(null);
    });
    
    mockPoiRepo.findOne = jest.fn().mockImplementation((options) => {
      const poiId = options?.where?.id;
      if (poiId === mockPoi.id) return Promise.resolve(mockPoi);
      return Promise.resolve(null);
    });
    
    mockPhotoRepo.findOne = jest.fn().mockImplementation((options) => {
      const photoId = options?.where?.id;
      if (photoId === mockPhoto.id) return Promise.resolve(mockPhoto);
      return Promise.resolve(null);
    });

    // Iniciar el servidor para pruebas
    server = app.listen(3003);
    console.log('Servidor social en ejecución en puerto 3003 para tests');
    
    // Generar un token de prueba
    testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE2MTY0MzUyMDAsImV4cCI6MjUzMzczNzYwMDB9.token-test';
  } catch (error) {
    console.error('Error al inicializar tests de integración:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => {
          console.log('Servidor social cerrado');
          resolve();
        });
      });
    }
  } catch (error) {
    console.error('Error en la limpieza de tests:', error);
    throw error;
  }
});

describe('Social Service - Pruebas de Endpoints', () => {
    
  describe('POST /api/social/likes', () => {
    const mockReaction = {
      id: 'reaction-1',
      userId: mockUser1.id,
      targetType: 'photo',
      targetId: mockPhoto.id,
      type: 'like',
      createdAt: new Date()
    };
    
    it('debe añadir un like correctamente', async () => {
      // Configurar mock para esta prueba
      mockPhotoRepo.findOne = jest.fn().mockResolvedValue(mockPhoto);
      const mockReactionRepo = mock<Repository<any>>();
      mockReactionRepo.findOne = jest.fn().mockResolvedValue(null); // No existe like previo
      mockReactionRepo.create = jest.fn().mockReturnValue(mockReaction);
      mockReactionRepo.save = jest.fn().mockResolvedValue(mockReaction);
      
      // Sobreescribir el comportamiento de getRepository solo para esta prueba
      jest.spyOn(require('../../../database/appDataSource').AppDataSource, 'getRepository')
        .mockImplementation((entity) => {
          if (entity.name === 'Reaction') return mockReactionRepo;
          if (entity.name === 'Photo') return mockPhotoRepo;
          return mock<Repository<any>>();
        });
      
      const response = await request(app)
        .post('/api/social/likes')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          userId: mockUser1.id,
          targetType: 'photo',
          targetId: mockPhoto.id
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.targetId).toBe(mockPhoto.id);
    });
    
    it('debe retornar error si el objetivo no existe', async () => {
      // Configurar mock para simular que el objetivo no existe
      mockPhotoRepo.findOne = jest.fn().mockResolvedValue(null);
      
      const response = await request(app)
        .post('/api/social/likes')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          userId: mockUser1.id,
          targetType: 'photo',
          targetId: 'non-existent-photo'
        });
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('POST /api/social/friends/request', () => {
    const mockFriendship = {
      id: 'friend-1',
      requesterId: mockUser1.id,
      recipientId: mockUser2.id,
      status: FriendStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    it('debe enviar una solicitud de amistad correctamente', async () => {
      // Configurar mocks para esta prueba
      mockFriendRepo.findOne = jest.fn().mockResolvedValue(null); // No existe amistad previa
      mockFriendRepo.create = jest.fn().mockReturnValue(mockFriendship);
      mockFriendRepo.save = jest.fn().mockResolvedValue(mockFriendship);
      
      const response = await request(app)
        .post('/api/social/friends/request')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          requesterId: mockUser1.id,
          recipientId: mockUser2.id
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.status).toBe(FriendStatus.PENDING);
    });
    
    it('debe retornar error si se intenta enviar solicitud a uno mismo', async () => {
      const response = await request(app)
        .post('/api/social/friends/request')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          requesterId: mockUser1.id,
          recipientId: mockUser1.id
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
    
    it('debe retornar error si el usuario destinatario no existe', async () => {
      // Configurar mock para simular que el usuario no existe
      mockUserRepo.findOne = jest.fn().mockImplementation((options) => {
        const userId = options?.where?.id;
        if (userId === mockUser1.id) return Promise.resolve(mockUser1);
        return Promise.resolve(null);
      });
      
      const response = await request(app)
        .post('/api/social/friends/request')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          requesterId: mockUser1.id,
          recipientId: 'non-existent-user'
        });
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('PUT /api/social/friends/:friendId', () => {
    const mockFriendship = {
      id: 'friend-1',
      requesterId: mockUser2.id,
      recipientId: mockUser1.id,
      status: FriendStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    it('debe aceptar una solicitud de amistad correctamente', async () => {
      // Configurar mocks para esta prueba
      mockFriendRepo.findOne = jest.fn().mockResolvedValue(mockFriendship);
      mockFriendRepo.save = jest.fn().mockImplementation((data) => {
        return Promise.resolve({
          ...data,
          status: FriendStatus.ACCEPTED,
          updatedAt: new Date()
        });
      });
      
      const response = await request(app)
        .put(`/api/social/friends/${mockFriendship.id}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          status: FriendStatus.ACCEPTED,
          userId: mockUser1.id
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(FriendStatus.ACCEPTED);
    });
    
    it('debe retornar error si la solicitud no existe', async () => {
      // Configurar mock para simular que la solicitud no existe
      mockFriendRepo.findOne = jest.fn().mockResolvedValue(null);
      
      const response = await request(app)
        .put('/api/social/friends/non-existent-friendship')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          status: FriendStatus.ACCEPTED,
          userId: mockUser1.id
        });
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('GET /api/social/friends/:userId', () => {
    const mockFriendships = [
      {
        id: 'friend-1',
        requesterId: mockUser1.id,
        recipientId: mockUser2.id,
        status: FriendStatus.ACCEPTED,
        recipient: mockUser2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    it('debe obtener los amigos de un usuario correctamente', async () => {
      // Configurar mocks para esta prueba
      mockFriendRepo.find = jest.fn().mockResolvedValue(mockFriendships);
      
      const response = await request(app)
        .get(`/api/social/friends/${mockUser1.id}`)
        .set('Authorization', `Bearer ${testToken}`)
        .query({ status: FriendStatus.ACCEPTED });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].status).toBe(FriendStatus.ACCEPTED);
    });
    
    it('debe retornar lista vacía si no hay amigos', async () => {
      // Configurar mock para retornar lista vacía
      mockFriendRepo.find = jest.fn().mockResolvedValue([]);
      
      const response = await request(app)
        .get(`/api/social/friends/${mockUser1.id}`)
        .set('Authorization', `Bearer ${testToken}`)
        .query({ status: FriendStatus.ACCEPTED });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(0);
    });
  });
});