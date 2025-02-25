/**
 * Script de configuración para MapYourWorld
 * Este script ayuda a los nuevos desarrolladores a configurar el proyecto correctamente
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

console.log(`
🌎 Bienvenido a MapYourWorld - Asistente de Configuración 🌎
===============================================================

Este script configurará todo lo necesario para comenzar a desarrollar.
`);

// Función para ejecutar comandos
function runCommand(command: string, message: string): boolean {
  console.log(`\n➡️ ${message}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${message} completado!`);
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// Verificar si .env existe, si no, crearlo a partir de .env.example
const envPath: string = path.resolve(__dirname, '..', '.env');
const envExamplePath: string = path.resolve(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log('\n➡️ Creando archivo .env a partir de .env.example...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ Archivo .env creado! Puedes editarlo según tus necesidades.');
}

// Ejecutar limpieza si es necesario
if (process.argv.includes('--clean')) {
  runCommand('node ./scripts/clean-node-modules.js', 'Limpiando instalaciones previas');
}

// Instalar dependencias
runCommand('npm install', 'Instalando dependencias');

// Instalar dependencias específicas para desarrollo con TypeScript
runCommand('npm install babel-plugin-module-resolver --save-dev', 'Instalando plugin de módulos para React Native');

// Verificar la instalación 
console.log('\n🔍 Verificando la instalación...');

// Verificar que el node_modules principal existe
const nmPath: string = path.resolve(__dirname, '..', 'node_modules');
if (fs.existsSync(nmPath)) {
  console.log('✅ Carpeta node_modules principal instalada correctamente');
} else {
  console.error('❌ Error: No se pudo instalar la carpeta node_modules principal');
}

// Ejecutar la verificación de tipos de TypeScript
runCommand('npm run type-check', 'Verificando tipos de TypeScript');

// Mostrar mensaje final
console.log(`
🎉 ¡Configuración completada!

Para iniciar el proyecto:
  - Backend: npm run dev:backend
  - Frontend Web: npm run dev:web
  - Frontend Mobile: npm run dev:mobile
  - Ambos (backend y web): npm run dev

Si tienes problemas:
  - Usa "npm run clean" para limpiar todas las dependencias
  - Reinstala con "node ./scripts/setup.js --clean"

¡Feliz desarrollo!
`); 