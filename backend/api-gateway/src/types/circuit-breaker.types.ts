/**
 * Tipos relacionados con el patrón Circuit Breaker
 */

// Estados posibles del Circuit Breaker
export enum CircuitBreakerState {
  CLOSED = 'CLOSED',   // Funcionamiento normal, las peticiones pasan
  OPEN = 'OPEN',       // Circuito abierto, las peticiones son rechazadas
  HALF_OPEN = 'HALF_OPEN' // Estado intermedio para probar si el servicio se ha recuperado
}

// Opciones de configuración para el Circuit Breaker
export interface CircuitBreakerOptions {
  failureThreshold: number;        // Número de fallos antes de abrir el circuito
  resetTimeout: number;            // Tiempo (ms) antes de pasar a estado HALF_OPEN
  halfOpenSuccessThreshold: number; // Éxitos necesarios en HALF_OPEN para cerrar el circuito
  maxRetries: number;              // Número máximo de reintentos
  timeout: number;                 // Tiempo (ms) antes de considerar una petición como fallida
  fallbackResponse?: any;          // Respuesta por defecto cuando el circuito está abierto
}

// Estadísticas del Circuit Breaker
export interface CircuitBreakerStats {
  state: CircuitBreakerState;      // Estado actual
  failures: number;                // Número de fallos actuales
  successes: number;               // Número de éxitos consecutivos (para HALF_OPEN)
  totalFailures: number;           // Total de fallos desde el inicio
  totalSuccesses: number;          // Total de éxitos desde el inicio
  lastFailure?: Date;              // Timestamp del último fallo
  lastSuccess?: Date;              // Timestamp del último éxito
  openedAt?: Date;                 // Cuándo se abrió el circuito
  lastStateChange?: Date;          // Último cambio de estado
}

// Evento emitido cuando cambia el estado del Circuit Breaker
export interface CircuitBreakerEvent {
  serviceName: string;
  previousState: CircuitBreakerState;
  newState: CircuitBreakerState;
  timestamp: Date;
  failures: number;
}

// Función middleware para Express
export interface CircuitBreakerMiddleware {
  (req: any, res: any, next: any): void;
}

// Mapa de Circuit Breakers por servicio
export interface CircuitBreakerMap {
  [serviceName: string]: any; // Instancia del Circuit Breaker
} 