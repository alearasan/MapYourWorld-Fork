/**
 * Sistema de métricas para el API Gateway
 * Recolecta y proporciona métricas sobre el rendimiento y uso de los microservicios
 */

import { Request, Response, NextFunction } from 'express';
import { Express } from 'express';
// Importar response-time con una importación tipo require para solucionar error de tipos
// @ts-ignore
import responseTime from 'response-time';

interface MinuteMetrics {
  timestamp: number;
  requestCount: number;
  responseTime: {
    total: number;
    avg: number;
  };
  statusCodes: Record<string, number>;
  errorRate: number;
}

class MetricsStore {
  private requestsTotal: number;
  private requestsPerEndpoint: Record<string, number>;
  private requestsPerMethod: Record<string, number>;
  private responseTimeTotal: number;
  private responseTimeSamples: number;
  private statusCodes: Record<string, number>;
  private errorTypes: Record<string, number>;
  private errorMessages: Record<string, number>;
  private startTime: number;
  private serviceMetrics: Record<string, {
    requestCount: number;
    successCount: number;
    failureCount: number;
    responseTimeTotal: number;
    responseTimeAvg: number;
  }>;
  private minuteStats: MinuteMetrics[];
  private lastMinuteTimestamp: number;
  private currentMinuteStats: MinuteMetrics;
  
  constructor() {
    this.requestsTotal = 0;
    this.requestsPerEndpoint = {};
    this.requestsPerMethod = {};
    this.responseTimeTotal = 0;
    this.responseTimeSamples = 0;
    this.statusCodes = {};
    this.errorTypes = {};
    this.errorMessages = {};
    this.startTime = Date.now();
    this.serviceMetrics = {};
    this.minuteStats = [];
    this.lastMinuteTimestamp = Math.floor(Date.now() / 60000) * 60000;
    this.currentMinuteStats = this.createMinuteStats();
  }
  
  private createMinuteStats(): MinuteMetrics {
    return {
      timestamp: Date.now(),
      requestCount: 0,
      responseTime: {
        total: 0,
        avg: 0
      },
      statusCodes: {},
      errorRate: 0
    };
  }
  
  registerRequest(method: string, url: string): void {
    this.requestsTotal++;
    this.currentMinuteStats.requestCount++;
    
    // Registrar por método
    this.requestsPerMethod[method] = (this.requestsPerMethod[method] || 0) + 1;
    
    // Simplificar la URL para agrupar endpoints similares
    const simplifiedUrl = this.simplifyUrl(url);
    
    // Registrar por endpoint
    this.requestsPerEndpoint[simplifiedUrl] = (this.requestsPerEndpoint[simplifiedUrl] || 0) + 1;
  }
  
  registerResponseTime(responseTime: number): void {
    this.responseTimeTotal += responseTime;
    this.responseTimeSamples++;
    this.currentMinuteStats.responseTime.total += responseTime;
    
    // Calcular el promedio para el minuto actual
    if (this.currentMinuteStats.requestCount > 0) {
      this.currentMinuteStats.responseTime.avg = 
        this.currentMinuteStats.responseTime.total / this.currentMinuteStats.requestCount;
    }
  }
  
  registerStatusCode(statusCode: number): void {
    const code = statusCode.toString();
    this.statusCodes[code] = (this.statusCodes[code] || 0) + 1;
    
    // Registrar también en las estadísticas por minuto
    this.currentMinuteStats.statusCodes[code] = 
      (this.currentMinuteStats.statusCodes[code] || 0) + 1;
    
    // Calcular tasa de error para el minuto actual
    const errorCount = Object.entries(this.currentMinuteStats.statusCodes)
      .filter(([code]) => code.startsWith('4') || code.startsWith('5'))
      .reduce((sum, [_, count]) => sum + count, 0);
      
    this.currentMinuteStats.errorRate = this.currentMinuteStats.requestCount > 0 
      ? errorCount / this.currentMinuteStats.requestCount 
      : 0;
  }
  
  registerError(errorType: string, errorMessage: string): void {
    // Registrar tipo de error
    this.errorTypes[errorType] = (this.errorTypes[errorType] || 0) + 1;
    
    // Simplificar y truncar mensajes de error para evitar explosión de claves
    let simplifiedMessage = errorMessage;
    if (simplifiedMessage.length > 100) {
      simplifiedMessage = simplifiedMessage.substring(0, 100) + '...';
    }
    
    // Eliminar datos variables como IDs y fechas para agrupar errores similares
    simplifiedMessage = simplifiedMessage
      .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '[UUID]')
      .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/g, '[DATETIME]')
      .replace(/\b\d+\b/g, '[NUMBER]');
    
    this.errorMessages[simplifiedMessage] = (this.errorMessages[simplifiedMessage] || 0) + 1;
  }
  
  registerServiceMetric(serviceName: string, responseTime: number, success: boolean): void {
    // Inicializar las métricas del servicio si no existen
    if (!this.serviceMetrics[serviceName]) {
      this.serviceMetrics[serviceName] = {
        requestCount: 0,
        successCount: 0,
        failureCount: 0,
        responseTimeTotal: 0,
        responseTimeAvg: 0
      };
    }
    
    const metrics = this.serviceMetrics[serviceName];
    
    // Actualizar contadores
    metrics.requestCount++;
    if (success) {
      metrics.successCount++;
    } else {
      metrics.failureCount++;
    }
    
    // Actualizar tiempo de respuesta
    metrics.responseTimeTotal += responseTime;
    metrics.responseTimeAvg = metrics.responseTimeTotal / metrics.requestCount;
  }
  
  storeMinuteStats(): void {
    const currentMinute = Math.floor(Date.now() / 60000) * 60000;
    
    // Si ha pasado al menos un minuto, guardar las estadísticas
    if (currentMinute > this.lastMinuteTimestamp) {
      // Solo guardar si hubo alguna petición en este minuto
      if (this.currentMinuteStats.requestCount > 0) {
        // Guardar estadísticas actuales
        this.minuteStats.push(this.currentMinuteStats);
        
        // Limitar el historial a la última hora (60 minutos)
        const maxHistoryMinutes = 60;
        if (this.minuteStats.length > maxHistoryMinutes) {
          this.minuteStats = this.minuteStats.slice(-maxHistoryMinutes);
        }
      }
      
      // Actualizar timestamp del último minuto
      this.lastMinuteTimestamp = currentMinute;
      
      // Crear nuevas estadísticas para el minuto actual
      this.currentMinuteStats = this.createMinuteStats();
    }
  }
  
  simplifyUrl(url: string): string {
    // Simplifiar URLs para agrupar endpoints similares
    // Por ejemplo, /api/users/123 y /api/users/456 se agrupan en /api/users/:id
    
    return url
      .replace(/\/api\/([^\/]+)\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/api/$1/:id')
      .replace(/\/api\/([^\/]+)\/\d+/g, '/api/$1/:id');
  }
  
  getMetrics(): Record<string, any> {
    // Asegurar que las estadísticas del minuto actual están actualizadas
    this.storeMinuteStats();
    
    // Calcular métricas derivadas
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const avgResponseTime = this.responseTimeSamples > 0 ? 
      this.responseTimeTotal / this.responseTimeSamples : 0;
    
    // Calcular tasa de error global
    const errorCount = Object.entries(this.statusCodes)
      .filter(([code]) => code.startsWith('4') || code.startsWith('5'))
      .reduce((sum, [_, count]) => sum + count, 0);
    
    const errorRate = this.requestsTotal > 0 ? errorCount / this.requestsTotal : 0;
    
    // Calcular peticiones por segundo (basado en el uptime)
    const requestsPerSecond = uptime > 0 ? this.requestsTotal / uptime : 0;
    
    return {
      uptime,
      requestsTotal: this.requestsTotal,
      requestsPerSecond,
      avgResponseTime,
      errorRate,
      requestsPerEndpoint: this.getTopEndpoints(),
      requestsPerMethod: this.requestsPerMethod,
      statusCodes: this.statusCodes,
      topErrors: this.getTopErrors(),
      serviceMetrics: this.serviceMetrics,
      minuteStats: this.minuteStats
    };
  }
  
  getTopEndpoints(limit: number = 10): Record<string, number> {
    // Devolver los endpoints más utilizados
    return Object.entries(this.requestsPerEndpoint)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
  }
  
  getTopErrors(limit: number = 5): Record<string, number> {
    // Devolver los errores más frecuentes
    return Object.entries(this.errorMessages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
  }
  
  reset(): void {
    // Reiniciar todas las métricas
    this.requestsTotal = 0;
    this.requestsPerEndpoint = {};
    this.requestsPerMethod = {};
    this.responseTimeTotal = 0;
    this.responseTimeSamples = 0;
    this.statusCodes = {};
    this.errorTypes = {};
    this.errorMessages = {};
    this.startTime = Date.now();
    this.serviceMetrics = {};
    this.minuteStats = [];
    this.lastMinuteTimestamp = Math.floor(Date.now() / 60000) * 60000;
    this.currentMinuteStats = this.createMinuteStats();
    
    console.log('[Metrics] Todas las métricas han sido reiniciadas');
  }
}

// Instancia global del almacén de métricas
const metricsStore = new MetricsStore();

// Intervalos para actualizar estadísticas
setInterval(() => {
  metricsStore.storeMinuteStats();
}, 30000); // Actualizar cada 30 segundos

export const setupMetrics = (app: Express): void => {
  // Middleware para registro de tiempo de respuesta
  app.use(responseTime((req: Request, res: Response, time: number) => {
    const url = req.originalUrl || req.url;
    const method = req.method;
    
    // Obtener el servicio de destino de la URL
    let service = 'unknown';
    if (url.includes('/api/auth')) {
      service = 'auth-service';
    } else if (url.includes('/api/users')) {
      service = 'user-service';
    } else if (url.includes('/api/maps')) {
      service = 'map-service';
    } else if (url.includes('/api/notifications')) {
      service = 'notification-service';
    } else if (url.includes('/api/social')) {
      service = 'social-service';
    } else if (url.includes('/api/gateway')) {
      service = 'api-gateway';
    }
    
    // Registrar la solicitud y tiempo de respuesta
    metricsStore.registerRequest(method, url);
    metricsStore.registerResponseTime(time);
    metricsStore.registerStatusCode(res.statusCode);
    
    // Registrar métricas del servicio
    const success = res.statusCode >= 200 && res.statusCode < 400;
    metricsStore.registerServiceMetric(service, time, success);
    
    // Si es un error, registrarlo
    if (res.statusCode >= 400) {
      let errorType = 'client-error';
      if (res.statusCode >= 500) {
        errorType = 'server-error';
      }
      
      metricsStore.registerError(errorType, `${res.statusCode} en ${method} ${url}`);
    }
  }));
  
  // Endpoint para obtener métricas
  app.get('/api/gateway/metrics', (req: Request, res: Response) => {
    res.json(metricsStore.getMetrics());
  });
  
  // Endpoint para reiniciar métricas (protegido para administradores)
  app.post('/api/gateway/metrics/reset', (req: Request, res: Response) => {
    // Aquí normalmente añadiríamos autenticación de administrador
    metricsStore.reset();
    res.json({ message: 'Las métricas han sido reiniciadas' });
  });
  
  console.log('[Metrics] Sistema de métricas inicializado');
};

export const getMetricsStore = (): MetricsStore => {
  return metricsStore;
}; 