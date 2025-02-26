/**
 * Implementación del patrón Circuit Breaker para el API Gateway
 * Protege contra fallos en cascada en los microservicios
 */

import { Request, Response, NextFunction } from 'express';
// Importar opossum con una importación tipo require para solucionar error de tipos
// @ts-ignore
import CircuitBreakerFactory from 'opossum';

// Estados posibles del circuit breaker
enum STATE {
  CLOSED = 'CLOSED',     // Funcionando normalmente
  OPEN = 'OPEN',         // Detectando errores, rechazando peticiones
  HALF_OPEN = 'HALF_OPEN'// Estado de prueba, permitiendo algunas peticiones
}

interface CircuitBreakerOptions {
  timeout?: number;       // Timeout para las operaciones en ms
  errorThresholdPercentage?: number; // % de fallos para abrir el circuito
  resetTimeout?: number;  // Tiempo en ms para pasar a HALF_OPEN
  volumeThreshold?: number; // Número mínimo de peticiones antes de abrir
  rollingCountTimeout?: number; // Período para estadísticas
  rollingCountBuckets?: number; // Número de buckets para estadísticas
}

// Mapa de circuit breakers para diferentes servicios
const breakers: Record<string, CircuitBreaker> = {};

class CircuitBreaker {
  private name: string;
  private breaker: any; // Tipo del circuit breaker de la librería opossum
  private status: STATE;

  constructor(serviceName: string, options: CircuitBreakerOptions = {}) {
    this.name = serviceName;
    this.status = STATE.CLOSED;
    
    const defaultOptions: CircuitBreakerOptions = {
      timeout: 5000, // 5 segundos
      errorThresholdPercentage: 50, // 50% de errores para abrir
      resetTimeout: 10000, // 10 segundos en estado OPEN
      volumeThreshold: 10, // 10 peticiones mínimo
      rollingCountTimeout: 10000, // 10 segundos
      rollingCountBuckets: 10 // 10 buckets
    };
    
    this.breaker = new CircuitBreakerFactory(async (operation: () => Promise<any>) => {
      return await operation();
    }, { ...defaultOptions, ...options });
    
    this.setupListeners();
  }
  
  private setupListeners(): void {
    this.breaker.on('open', () => this.toOpen());
    this.breaker.on('halfOpen', () => this.toHalfOpen());
    this.breaker.on('close', () => this.toClose());
  }
  
  async exec(operation: () => Promise<any>): Promise<any> {
    try {
      const result = await this.breaker.fire(() => operation());
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error);
      throw error;
    }
  }
  
  onSuccess(): void {
    // Registrar éxito para estadísticas y métricas
    console.log(`[CircuitBreaker] ${this.name}: Operación exitosa`);
    
    // Podríamos emitir un evento para recopilar métricas
    // Por ejemplo, incrementar contador de éxitos, registrar tiempo, etc.
  }
  
  onFailure(error: any): void {
    // Registrar fallo para estadísticas y métricas
    console.error(`[CircuitBreaker] ${this.name}: Error - ${error.message}`);
    
    // Podríamos emitir un evento para recopilar métricas
    // Por ejemplo, incrementar contador de fallos, registrar tipo de error, etc.
  }
  
  toClose(): void {
    if (this.status !== STATE.CLOSED) {
      this.status = STATE.CLOSED;
      console.log(`[CircuitBreaker] ${this.name}: Circuito CERRADO - Funcionando normalmente`);
      // Aquí podríamos emitir un evento para notificar el cambio de estado
    }
  }
  
  toOpen(): void {
    if (this.status !== STATE.OPEN) {
      this.status = STATE.OPEN;
      console.log(`[CircuitBreaker] ${this.name}: Circuito ABIERTO - Rechazando peticiones`);
      // Aquí podríamos emitir un evento para alertar de que el servicio está fallando
      // También podríamos enviar una notificación a un sistema de monitoreo
    }
  }
  
  toHalfOpen(): void {
    if (this.status !== STATE.HALF_OPEN) {
      this.status = STATE.HALF_OPEN;
      console.log(`[CircuitBreaker] ${this.name}: Circuito SEMI-ABIERTO - Probando recuperación`);
      // Aquí podríamos emitir un evento para notificar que estamos probando la recuperación
    }
  }
  
  getState(): STATE {
    return this.status;
  }
}

export const setupCircuitBreakers = (): void => {
  // Crear circuit breakers para los diferentes servicios
  breakers['auth-service'] = new CircuitBreaker('auth-service');
  breakers['user-service'] = new CircuitBreaker('user-service');
  breakers['map-service'] = new CircuitBreaker('map-service');
  breakers['notification-service'] = new CircuitBreaker('notification-service');
  breakers['social-service'] = new CircuitBreaker('social-service');
  
  console.log('[CircuitBreaker] Configuración completada para todos los servicios');
};

export const circuitBreakerMiddleware = (serviceName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const breaker = breakers[serviceName];
    
    if (!breaker) {
      console.warn(`[CircuitBreaker] No se encontró un circuit breaker para ${serviceName}`);
      return next();
    }
    
    if (breaker.getState() === STATE.OPEN) {
      return res.status(503).json({
        error: 'Servicio temporalmente no disponible',
        message: `El servicio ${serviceName} no está disponible en este momento. Por favor, inténtelo más tarde.`
      });
    }
    
    next();
  };
};

export const executeWithCircuitBreaker = async (serviceName: string, operation: () => Promise<any>): Promise<any> => {
  const breaker = breakers[serviceName];
  
  if (!breaker) {
    console.warn(`[CircuitBreaker] No se encontró un circuit breaker para ${serviceName}`);
    return operation();
  }
  
  return breaker.exec(operation);
}; 