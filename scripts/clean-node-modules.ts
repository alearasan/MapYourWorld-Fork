/**
 * Script para eliminar todas las carpetas node_modules del proyecto
 * Esto es útil para realizar una instalación limpia
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

console.log('🧹 Limpiando node_modules...');

// Tipo para la función de eliminación
type DeleteCommandFn = (dir: string) => string;

// Función para determinar el comando correcto según el sistema operativo
function getDeleteCommand(): DeleteCommandFn {
  const platform = process.platform;
  if (platform === 'win32') {
    return (dir: string) => `if exist "${dir}" rmdir /s /q "${dir}"`;
  } else {
    return (dir: string) => `rm -rf "${dir}"`;
  }
}

const deleteCommand = getDeleteCommand();

// Directorios a limpiar
const dirsToClean: string[] = [
  // Raíz del proyecto
  path.resolve(__dirname, '..', 'node_modules'),
  
  // Frontend y sus subdirectorios
  path.resolve(__dirname, '..', 'frontend', 'node_modules'),
  path.resolve(__dirname, '..', 'frontend', 'web', 'node_modules'),
  path.resolve(__dirname, '..', 'frontend', 'mobile', 'node_modules'),
  
  // Backend y sus subdirectorios
  path.resolve(__dirname, '..', 'backend', 'node_modules'),
  path.resolve(__dirname, '..', 'backend', 'auth-service', 'node_modules'),
  path.resolve(__dirname, '..', 'backend', 'user-service', 'node_modules'),
  path.resolve(__dirname, '..', 'backend', 'map-service', 'node_modules'),
  path.resolve(__dirname, '..', 'backend', 'notification-service', 'node_modules'),
  path.resolve(__dirname, '..', 'backend', 'social-service', 'node_modules'),
  path.resolve(__dirname, '..', 'backend', 'api-gateway', 'node_modules'),
  
  // Directorio shared
  path.resolve(__dirname, '..', 'shared', 'node_modules')
];

// Limpiar cada directorio
dirsToClean.forEach(dir => {
  try {
    const cmd = deleteCommand(dir);
    console.log(`Eliminando: ${dir}`);
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error al eliminar ${dir}:`, error instanceof Error ? error.message : String(error));
  }
});

// Eliminar también package-lock.json para una instalación totalmente limpia
try {
  const lockFile = path.resolve(__dirname, '..', 'package-lock.json');
  if (fs.existsSync(lockFile)) {
    console.log('Eliminando package-lock.json');
    fs.unlinkSync(lockFile);
  }
} catch (error) {
  console.error('Error al eliminar package-lock.json:', error instanceof Error ? error.message : String(error));
}

console.log('✅ Limpieza completada. Ahora puedes ejecutar "npm install" para una instalación limpia.'); 