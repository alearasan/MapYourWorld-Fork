/**
 * @fileoverview Utilidad centralizada de logging para la aplicación
 * 
 * Este módulo proporciona una interfaz unificada para el logging en toda la aplicación,
 * permitiendo un control centralizado sobre los niveles de log y formatos.
 * 
 * @module Logger
 */

/**
 * Interfaz que define los métodos de logging
 */
export interface Logger {
  /**
   * Registra un mensaje informativo
   */
  info(message: string, meta?: Record<string, any>): void;
  
  /**
   * Registra un mensaje de advertencia
   */
  warn(message: string, meta?: Record<string, any>): void;
  
  /**
   * Registra un mensaje de error
   */
  error(message: string, meta?: Record<string, any> | Error): void;
  
  /**
   * Registra un mensaje de depuración (solo en desarrollo)
   */
  debug(message: string, meta?: Record<string, any>): void;
}

/**
 * Implementación de la interfaz Logger
 */
class AppLogger implements Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  /**
   * Registra un mensaje informativo
   */
  info(message: string, meta?: Record<string, any>): void {
    console.log(`[INFO] ${message}`, meta || '');
  }

  /**
   * Registra un mensaje de advertencia
   */
  warn(message: string, meta?: Record<string, any>): void {
    console.warn(`[WARN] ${message}`, meta || '');
  }

  /**
   * Registra un mensaje de error
   */
  error(message: string, meta?: Record<string, any> | Error): void {
    if (meta instanceof Error) {
      console.error(`[ERROR] ${message}`, {
        error: meta.message,
        stack: meta.stack
      });
    } else {
      console.error(`[ERROR] ${message}`, meta || '');
    }
  }

  /**
   * Registra un mensaje de depuración (solo en desarrollo)
   */
  debug(message: string, meta?: Record<string, any>): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, meta || '');
    }
  }
}

// Exportamos una única instancia del logger
export const logger = new AppLogger(); 