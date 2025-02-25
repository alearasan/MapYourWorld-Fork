/**
 * Tipos relacionados con el sistema de caché
 */

// Elemento almacenado en la caché
export interface CacheItem<T = any> {
  key: string;
  value: T;
  expiresAt: number; // Timestamp en milisegundos
  createdAt: number; // Timestamp en milisegundos
  size: number;      // Tamaño aproximado en bytes
}

// Opciones de configuración de la caché
export interface CacheOptions {
  ttl: number;           // Tiempo de vida en milisegundos (Time-To-Live)
  maxSize: number;       // Tamaño máximo de la caché en bytes
  checkPeriod: number;   // Período para verificar caducidad en milisegundos
  allowStale: boolean;   // Permitir devolver elementos caducados si aún no fueron eliminados
  deleteOnExpire: boolean; // Eliminar automáticamente elementos caducados
}

// Estadísticas de la caché
export interface CacheStats {
  hits: number;          // Número de aciertos (elementos encontrados)
  misses: number;        // Número de fallos (elementos no encontrados)
  keys: number;          // Número de claves en la caché actualmente
  size: number;          // Tamaño actual aproximado en bytes
  hitRate: number;       // Tasa de aciertos (hit/(hit+miss))
  maxSize: number;       // Tamaño máximo configurado
  ttl: number;           // TTL configurado
  purgeCount: number;    // Número de purgas realizadas
  oldest?: CacheItem;    // Elemento más antiguo en la caché
  newest?: CacheItem;    // Elemento más reciente en la caché
}

// Configuración de rutas para la caché
export interface CacheRouteConfig {
  path: string;          // Patrón de ruta (puede ser regex o string)
  ttl: number;           // TTL específico para esta ruta
  methods?: string[];    // Métodos HTTP a los que aplicar caché (por defecto solo GET)
  varyByAuth?: boolean;  // Variar caché por token de autenticación
  varyByQuery?: boolean; // Variar caché por parámetros de consulta
  ignoreQuery?: string[]; // Parámetros de consulta a ignorar para la clave de caché
}

// Función middleware para Express
export interface CacheMiddleware {
  (req: any, res: any, next: any): void;
}

// Función para invalidar la caché
export interface CacheInvalidator {
  (pattern: string | RegExp): number; // Devuelve número de elementos eliminados
} 