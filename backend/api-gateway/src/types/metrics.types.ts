/**
 * Tipos relacionados con el sistema de métricas
 */

// Métrica básica con valor numérico
export interface Metric {
  value: number;
  timestamp: number; // Timestamp en milisegundos
}

// Contador de métricas que mantiene historial
export interface MetricCounter extends Metric {
  previous?: number; // Valor anterior
  delta?: number;    // Diferencia con respecto al valor anterior
  history?: number[]; // Historial de valores (últimos N valores)
}

// Métricas relacionadas con tiempo (en milisegundos)
export interface TimingMetric extends Metric {
  min: number;
  max: number;
  avg: number;
  p95?: number; // Percentil 95
  p99?: number; // Percentil 99
  count: number; // Número de mediciones
}

// Contadores por categoría (ej: por código de estado HTTP)
export interface CategoryCounter {
  [category: string]: number;
}

// Métrica por endpoint
export interface EndpointMetric {
  path: string;
  method: string;
  count: number;
  responseTime: TimingMetric;
  statusCodes: CategoryCounter;
  errors: number;
  lastAccessed: number; // Timestamp
}

// Métrica por microservicio
export interface ServiceMetric {
  name: string;
  available: boolean; // Si el servicio está disponible
  responseTime: TimingMetric;
  requestCount: number;
  errorCount: number;
  errorRate: number; // Porcentaje de errores
  lastCheck: number; // Timestamp de última comprobación
  circuitBreakerState?: string; // Estado del circuit breaker
}

// Estadísticas de sistema
export interface SystemMetrics {
  uptime: number; // En segundos
  startTime: number; // Timestamp de inicio
  memoryUsage: {
    rss: number; // Resident Set Size
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  cpuUsage?: {
    user: number;
    system: number;
  };
}

// Colección completa de métricas
export interface MetricsCollection {
  system: SystemMetrics;
  totalRequests: number;
  requestsPerMinute: number[];
  requestsPerSecond: number;
  avgResponseTime: number;
  responseTimeHistory: number[];
  statusCodes: CategoryCounter;
  methods: CategoryCounter;
  endpoints: EndpointMetric[];
  services: ServiceMetric[];
  errorRate: number;
  errorsPerMinute: number[];
}

// Configuración del recolector de métricas
export interface MetricsConfig {
  enabled: boolean;
  collectInterval: number; // En milisegundos
  historySize: number; // Tamaño del historial a mantener
  logToConsole: boolean;
  logInterval: number; // En milisegundos
}

// Función middleware para Express
export interface MetricsMiddleware {
  (req: any, res: any, next: any): void;
} 