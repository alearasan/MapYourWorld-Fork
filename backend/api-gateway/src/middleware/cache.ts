/**
 * Sistema de caché para el API Gateway
 * Implementa un sistema de caché en memoria con TTL para mejorar el rendimiento
 */

import { Request, Response, NextFunction, Express, Router } from 'express';

interface CacheOptions {
  ttl?: number;         // Tiempo de vida en ms (por defecto 5 minutos)
  maxSize?: number;     // Tamaño máximo en elementos (por defecto 1000)
  cleanupInterval?: number; // Intervalo de limpieza en ms (por defecto 1 minuto)
}

interface CacheItem {
  value: any;
  expiresAt: number;
  size: number;
}

class MemoryCache {
  private cache: Map<string, CacheItem>;
  private options: Required<CacheOptions>;
  private hits: number;
  private misses: number;
  private cleanupTimer: NodeJS.Timeout | null;
  
  constructor(options: CacheOptions = {}) {
    this.cache = new Map<string, CacheItem>();
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutos por defecto
      maxSize: options.maxSize || 1000,  // 1000 elementos por defecto
      cleanupInterval: options.cleanupInterval || 60 * 1000 // 1 minuto
    };
    this.hits = 0;
    this.misses = 0;
    this.cleanupTimer = null;
    
    // Iniciar la limpieza periódica
    this.startCleanupTimer();
  }
  
  generateKey(req: Request): string {
    // Crear una clave única basada en la URL y parámetros
    let key = `${req.method}:${req.originalUrl}`;
    
    // Añadir query params si existen
    if (Object.keys(req.query).length > 0) {
      key += `:${JSON.stringify(req.query)}`;
    }
    
    // Si es una solicitud autenticada, incluir el userId para evitar
    // compartir caché entre usuarios diferentes
    const authHeader = req.headers.authorization;
    if (authHeader) {
      // Solo incluir el token truncado para mantener privacidad
      key += `:auth:${authHeader.substring(0, 20)}`;
    }
    
    return key;
  }
  
  get(key: string): any {
    const item = this.cache.get(key);
    
    if (!item) {
      this.misses++;
      return null;
    }
    
    // Verificar si el item ha expirado
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    
    this.hits++;
    return item.value;
  }
  
  set(key: string, value: any, customTtl?: number): void {
    // Si ya alcanzamos el tamaño máximo, eliminar el más antiguo
    if (this.cache.size >= this.options.maxSize) {
      this.removeOldestItem();
    }
    
    // Estimar el tamaño (aproximado) del valor
    const valueString = JSON.stringify(value);
    const size = valueString ? valueString.length : 0;
    
    // Almacenar con tiempo de expiración
    const ttl = customTtl || this.options.ttl;
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
      size
    });
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
  
  protected removeOldestItem(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt < oldestTime) {
        oldestTime = item.expiresAt;
        oldestKey = key;
      }
    }
    
    if (oldestKey !== null) {
      this.cache.delete(oldestKey);
    }
  }
  
  cleanup(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
        expiredCount++;
      }
    }
    
    if (expiredCount > 0) {
      console.log(`[Cache] Limpieza: eliminados ${expiredCount} elementos expirados`);
    }
  }
  
  getStats(): Record<string, any> {
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? (this.hits / totalRequests) * 100 : 0;
    
    return {
      size: this.cache.size,
      maxSize: this.options.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: hitRate.toFixed(2) + '%',
      ttl: this.options.ttl
    };
  }
  
  startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.options.cleanupInterval);
  }
  
  stop(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
}

let cacheInstance: MemoryCache | null = null;

export const setupCache = (app: Express): void => {
  // Crear una instancia de caché si no existe
  if (!cacheInstance) {
    cacheInstance = new MemoryCache();
    console.log('[Cache] Sistema de caché inicializado');
  }
  
  // Crear un router para manejar los endpoints de caché
  const cacheRouter = Router();
  
  // Definir la función de handler para estadísticas
  const statsHandler = (req: Request, res: Response): void => {
    if (!cacheInstance) {
      res.status(500).json({ error: 'Sistema de caché no inicializado' });
      return;
    }
    res.json(cacheInstance.getStats());
  };
  
  // Definir la función de handler para limpiar la caché
  const clearHandler = (req: Request, res: Response): void => {
    if (!cacheInstance) {
      res.status(500).json({ error: 'Sistema de caché no inicializado' });
      return;
    }
    cacheInstance.clear();
    res.json({ message: 'Caché limpiada correctamente' });
  };
  
  // Configurar endpoints para la gestión de caché usando el router
  cacheRouter.get('/stats', statsHandler);
  cacheRouter.post('/clear', clearHandler);
  
  // Montar el router en la aplicación
  app.use('/api/gateway/cache', cacheRouter);
};

export const cacheMiddleware = (duration?: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // No cachear para métodos de escritura
    if (req.method !== 'GET') {
      return next();
    }
    
    if (!cacheInstance) {
      return next();
    }
    
    const key = cacheInstance.generateKey(req);
    const cachedResponse = cacheInstance.get(key);
    
    if (cachedResponse) {
      // Añadir cabecera para indicar que es una respuesta cacheada
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }
    
    // Cabecera para indicar cache miss
    res.setHeader('X-Cache', 'MISS');
    
    // Guardar la respuesta original para poder cachearla
    const originalSend = res.json;
    
    // @ts-ignore: Sobrescribir el método json
    res.json = function(body: any): Response {
      // Restaurar el método original
      // @ts-ignore
      res.json = originalSend;
      
      // Solo cachear respuestas exitosas
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheInstance?.set(key, body, duration);
      }
      
      // Llamar al método original
      return originalSend.call(this, body);
    };
    
    next();
  };
};

export const invalidateCache = (path: string): void => {
  if (!cacheInstance) return;
  
  for (const [key] of cacheInstance['cache'].entries()) {
    if (key.includes(path)) {
      cacheInstance.delete(key);
    }
  }
  
  console.log(`[Cache] Invalidadas entradas de caché que contienen: ${path}`);
}; 