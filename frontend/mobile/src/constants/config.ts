/**
 * Configuración global para la aplicación móvil
 * Define variables globales y configuraciones del entorno
 */

// Configuración de API
export const API_URL = process.env.API_URL || 'http://localhost:3000';
export const API_TIMEOUT = 30000; // 30 segundos
export const WS_URL = process.env.WS_URL || 'ws://localhost:3000';

// Configuración de autenticación
export const AUTH_STORAGE_KEY = '@MapYourWorld:auth';
export const TOKEN_EXPIRY_BUFFER = 300; // 5 minutos en segundos

// Configuración de mapas
export const MAP_DEFAULT_ZOOM = 14;
export const MAP_DEFAULT_LOCATION = {
  latitude: 37.3886303,
  longitude: -5.9953403, // Sevilla como ubicación por defecto
};
export const MAP_STYLE = 'streets-v11'; // Estilo de mapa por defecto

// Configuración de caché
export const CACHE_EXPIRY = 86400000; // 24 horas en milisegundos
export const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB

// Versión de la aplicación
export const APP_VERSION = '1.0.0';

// Configuración de notificaciones
export const NOTIFICATION_CHANNEL_ID = 'mapyourworld-notifications';
export const NOTIFICATION_CHANNEL_NAME = 'MapYourWorld Notificaciones';

// Configuración de analíticas
export const ANALYTICS_ENABLED = true;
export const ANALYTICS_SAMPLE_RATE = 0.5; // 50% de eventos capturados

// Límites de la aplicación
export const MAX_PHOTOS_PER_POI = 10;
export const MAX_COMMENTS_PER_POST = 50; 