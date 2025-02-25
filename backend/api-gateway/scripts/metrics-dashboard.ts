/**
 * Dashboard de métricas simple para API Gateway
 * Script para monitorear en tiempo real el rendimiento y estado de los microservicios
 */

import readline from 'readline';
// Importar node-fetch con una importación tipo require para solucionar error de tipos
// @ts-ignore
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// URL del API Gateway
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:3000';
const REFRESH_INTERVAL = 5000; // 5 segundos

// Interfaces para las métricas
interface ServiceMetrics {
  requestCount: number;
  successCount: number;
  failureCount: number;
  responseTimeAvg: number;
}

interface Metrics {
  uptime: number;
  requestsTotal: number;
  requestsPerSecond: number;
  avgResponseTime: number;
  errorRate: number;
  requestsPerMethod: Record<string, number>;
  topEndpoints: Record<string, number>;
  statusCodes: Record<string, number>;
  serviceMetrics: Record<string, ServiceMetrics>;
  minuteStats?: any[];
}

// Limpiar la consola
const clearScreen = (): void => {
  console.clear();
};

// Mostrar encabezado
const showHeader = (): void => {
  console.log('\n🌍 MAPYOURWORLD - API GATEWAY METRICS DASHBOARD 🌍');
  console.log('----------------------------------------------------');
  console.log(`Conectado a: ${API_GATEWAY_URL}`);
  console.log(`Actualizando cada: ${REFRESH_INTERVAL / 1000} segundos`);
  console.log('----------------------------------------------------\n');
};

// Mostrar métricas generales
const showGeneralMetrics = (metrics: Metrics): void => {
  console.log('📊 MÉTRICAS GENERALES');
  console.log(`Tiempo de actividad: ${formatUptime(metrics.uptime)}`);
  console.log(`Solicitudes totales: ${metrics.requestsTotal}`);
  console.log(`Solicitudes por segundo: ${metrics.requestsPerSecond.toFixed(2)}`);
  console.log(`Tiempo de respuesta promedio: ${metrics.avgResponseTime.toFixed(2)} ms`);
  console.log(`Tasa de error: ${(metrics.errorRate * 100).toFixed(2)}%`);
  console.log('');
};

// Mostrar distribución de métodos HTTP
const showMethodDistribution = (methods: Record<string, number>): void => {
  console.log('📊 MÉTODOS HTTP');
  Object.entries(methods).forEach(([method, count]) => {
    console.log(`${method}: ${count}`);
  });
  console.log('');
};

// Mostrar endpoints más utilizados
const showTopEndpoints = (endpoints: Record<string, number>): void => {
  console.log('🔝 TOP ENDPOINTS');
  Object.entries(endpoints).forEach(([endpoint, count], index) => {
    console.log(`${index + 1}. ${endpoint}: ${count}`);
  });
  console.log('');
};

// Mostrar códigos de estado
const showStatusCodes = (statusCodes: Record<string, number>): void => {
  console.log('📊 CÓDIGOS DE ESTADO');
  Object.entries(statusCodes).forEach(([code, count]) => {
    let icon = '✅';
    if (code.startsWith('4')) icon = '⚠️';
    if (code.startsWith('5')) icon = '❌';
    console.log(`${icon} ${code}: ${count}`);
  });
  console.log('');
};

// Mostrar métricas de servicios
const showServiceMetrics = (services: Record<string, ServiceMetrics>): void => {
  console.log('🔌 ESTADO DE SERVICIOS');
  Object.entries(services).forEach(([name, metrics]) => {
    const successRate = metrics.requestCount > 0 
      ? (metrics.successCount / metrics.requestCount * 100).toFixed(2) 
      : '100.00';
    
    let status = '🟢';
    if (parseFloat(successRate) < 95) status = '🟡';
    if (parseFloat(successRate) < 80) status = '🔴';
    
    console.log(`${status} ${name}`);
    console.log(`   Total: ${metrics.requestCount} | Éxito: ${metrics.successCount} | Fallos: ${metrics.failureCount}`);
    console.log(`   Tasa de éxito: ${successRate}% | Tiempo promedio: ${metrics.responseTimeAvg.toFixed(2)} ms`);
  });
  console.log('');
};

// Formatear tiempo de actividad
const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
};

// Obtener y mostrar métricas
const fetchAndShowMetrics = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/gateway/metrics`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const metrics = await response.json() as Metrics;
    
    clearScreen();
    showHeader();
    showGeneralMetrics(metrics);
    showMethodDistribution(metrics.requestsPerMethod);
    showTopEndpoints(metrics.topEndpoints);
    showStatusCodes(metrics.statusCodes);
    showServiceMetrics(metrics.serviceMetrics);
    
    console.log('\nPresiona CTRL+C para salir...');
  } catch (error) {
    clearScreen();
    console.error('❌ Error al obtener métricas:', error instanceof Error ? error.message : String(error));
    console.log('\nVerifique que:');
    console.log('1. El API Gateway esté en ejecución');
    console.log('2. La URL sea correcta:', API_GATEWAY_URL);
    console.log('3. El endpoint de métricas esté habilitado');
    console.log('\nReintentando en 10 segundos...');
  }
};

// Iniciar el dashboard
const startDashboard = (): void => {
  showHeader();
  console.log('Conectando al API Gateway...\n');
  
  // Llamada inicial
  fetchAndShowMetrics();
  
  // Actualizar periódicamente
  setInterval(fetchAndShowMetrics, REFRESH_INTERVAL);
  
  // Manejar salida limpia
  process.on('SIGINT', () => {
    clearScreen();
    console.log('🛑 Deteniendo dashboard de métricas...');
    process.exit(0);
  });
};

// Iniciar el dashboard
startDashboard(); 