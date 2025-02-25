/**
 * Script de despliegue para MapYourWorld
 * Este script permite desplegar solo backend, solo frontend o ambos
 */

import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Configuración
const CONFIG = {
  dockerComposeFiles: {
    backend: path.join(__dirname, '../infrastructure/compose/docker-compose-backend.yml'),
    frontend: path.join(__dirname, '../infrastructure/compose/docker-compose-frontend.yml'),
    full: path.join(__dirname, '../infrastructure/compose/docker-compose.yml')
  },
  buildScripts: {
    backend: 'npm run build:backend',
    frontend: 'npm run build:web'
  }
};

// Interfaz para input del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Ejecuta un comando como promesa
 * @param command Comando a ejecutar
 * @param args Argumentos del comando
 * @returns Promesa que resuelve cuando termina el comando
 */
function execCommand(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`Ejecutando: ${command} ${args.join(' ')}`);
    
    const process = spawn(command, args, { stdio: 'inherit' });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`El comando ${command} falló con código ${code}`));
      }
    });
    
    process.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Verifica que los archivos necesarios existan
 * @returns Promise<boolean>
 */
async function checkFiles(): Promise<boolean> {
  const filesToCheck = [
    CONFIG.dockerComposeFiles.backend,
    CONFIG.dockerComposeFiles.frontend
  ];
  
  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) {
      console.error(`Error: No se encontró el archivo ${file}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Construye el backend
 */
async function buildBackend(): Promise<void> {
  console.log('🔨 Construyendo backend...');
  try {
    await execCommand('npm', ['run', 'build:backend']);
    console.log('✅ Backend construido correctamente');
  } catch (error) {
    console.error('❌ Error al construir el backend:', error);
    throw error;
  }
}

/**
 * Construye el frontend
 */
async function buildFrontend(): Promise<void> {
  console.log('🔨 Construyendo frontend...');
  try {
    await execCommand('npm', ['run', 'build:web']);
    console.log('✅ Frontend construido correctamente');
  } catch (error) {
    console.error('❌ Error al construir el frontend:', error);
    throw error;
  }
}

/**
 * Despliega backend usando Docker Compose
 */
async function deployBackend(): Promise<void> {
  console.log('🚀 Desplegando backend...');
  try {
    await execCommand('docker-compose', [
      '-f', CONFIG.dockerComposeFiles.backend,
      'up', '-d', '--build'
    ]);
    console.log('✅ Backend desplegado correctamente');
  } catch (error) {
    console.error('❌ Error al desplegar el backend:', error);
    throw error;
  }
}

/**
 * Despliega frontend usando Docker Compose
 */
async function deployFrontend(): Promise<void> {
  console.log('🚀 Desplegando frontend...');
  try {
    await execCommand('docker-compose', [
      '-f', CONFIG.dockerComposeFiles.frontend,
      'up', '-d', '--build'
    ]);
    console.log('✅ Frontend desplegado correctamente');
  } catch (error) {
    console.error('❌ Error al desplegar el frontend:', error);
    throw error;
  }
}

/**
 * Despliega el proyecto completo
 */
async function deployFull(): Promise<void> {
  console.log('🚀 Desplegando proyecto completo...');
  try {
    await execCommand('docker-compose', [
      '-f', CONFIG.dockerComposeFiles.full,
      'up', '-d', '--build'
    ]);
    console.log('✅ Proyecto desplegado correctamente');
  } catch (error) {
    console.error('❌ Error al desplegar el proyecto:', error);
    throw error;
  }
}

/**
 * Función principal
 */
async function main(): Promise<void> {
  console.log('🌍 MapYourWorld - Script de Despliegue');
  console.log('=======================================');
  
  // Verificar archivos
  const filesOk = await checkFiles();
  if (!filesOk) {
    process.exit(1);
  }
  
  // Preguntar al usuario qué desplegar
  rl.question('¿Qué desea desplegar? (1: Backend, 2: Frontend, 3: Ambos): ', async (answer) => {
    try {
      switch (answer.trim()) {
        case '1':
          await buildBackend();
          await deployBackend();
          break;
        case '2':
          await buildFrontend();
          await deployFrontend();
          break;
        case '3':
          await buildBackend();
          await buildFrontend();
          await deployFull();
          break;
        default:
          console.log('Opción no válida. Ejecute el script nuevamente.');
          process.exit(1);
      }
      
      console.log('🎉 ¡Despliegue completado con éxito!');
      rl.close();
    } catch (error) {
      console.error('🔥 Error durante el despliegue:', error);
      rl.close();
      process.exit(1);
    }
  });
}

// Ejecutar script
main().catch(error => {
  console.error('Error inesperado:', error);
  process.exit(1);
}); 