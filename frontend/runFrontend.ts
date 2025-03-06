/**
 * Script para iniciar los servicios frontend de MapYourWorld
 * 
 * Este script inicia:
 * - La aplicación web en el puerto 4444
 * - La aplicación móvil en el puerto 6969
 * 
 * Uso:
 * - npm run run:frontend        (desarrollo)
 * - npm run run:frontend:prod   (producción)
 */

import { spawn, ChildProcess } from 'child_process';
import { resolve } from 'path';
import * as fs from 'fs';
import chalk from 'chalk';

// Configuraciones
const FRONTENDS = {
  web: {
    name: 'web',
    port: 4444,
    directory: resolve(__dirname, 'web'),
    devCommand: 'npm start -- --port 4444',
    prodCommand: 'npm run build && npx serve -s dist -p 4444',
    readyMessage: 'Local:',
  },
  mobile: {
    name: 'mobile', 
    port: 6969,
    directory: resolve(__dirname, 'mobile'),
    devCommand: 'npx expo start --port 6969',
    prodCommand: 'npx expo start --port 6969 --no-dev --minify',
    readyMessage: 'Developer tools',
  }
};

// Procesos de cada frontend
const processes: Record<string, ChildProcess> = {};

// Directorio para logs
const LOGS_DIR = resolve(__dirname, '../logs');
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// Logger
function log(frontend: string, message: string, type: 'info' | 'error' | 'success' = 'info'): void {
  const timestamp = new Date().toISOString();
  let colorizedMessage: string;
  
  switch (type) {
    case 'error':
      colorizedMessage = chalk.red(`[${frontend}] ${message}`);
      break;
    case 'success':
      colorizedMessage = chalk.green(`[${frontend}] ${message}`);
      break;
    default:
      colorizedMessage = chalk.blue(`[${frontend}] ${message}`);
  }
  
  console.log(`${chalk.gray(timestamp)} ${colorizedMessage}`);
  
  // También guardar en archivo de log
  const logEntry = `${timestamp} [${frontend}] [${type.toUpperCase()}] ${message}\n`;
  fs.appendFileSync(resolve(LOGS_DIR, 'frontend.log'), logEntry);
  fs.appendFileSync(resolve(LOGS_DIR, `${frontend}.log`), logEntry);
}

/**
 * Inicia un frontend específico
 */
function startFrontend(frontendName: string, mode: 'dev' | 'prod'): Promise<void> {
  return new Promise((resolve, reject) => {
    const frontend = FRONTENDS[frontendName as keyof typeof FRONTENDS];
    if (!frontend) {
      reject(new Error(`Frontend desconocido: ${frontendName}`));
      return;
    }

    const command = mode === 'dev' ? frontend.devCommand : frontend.prodCommand;
    log(frontend.name, `Iniciando en modo ${mode} con: ${command}`, 'info');
    
    // Dividir el comando en partes (comando principal y argumentos)
    const [cmd, ...args] = command.split(' ');
    
    // Crear variables para el entorno del proceso
    const envVars = {
      ...process.env,
      PORT: String(frontend.port), // Asegurar que se use el puerto configurado
      FORCE_COLOR: '1', // Mantener colores en los logs
    };
    
    // Iniciar el proceso
    const childProcess = spawn(cmd, args, {
      cwd: frontend.directory,
      shell: true,
      env: envVars,
    });
    
    processes[frontendName] = childProcess;
    
    // Manejar stdout
    childProcess.stdout.on('data', (data: Buffer) => {
      const output = data.toString();
      console.log(chalk.gray(`[${frontend.name}] `) + output.trimEnd());
      
      // Detectar cuando el servicio está listo
      if (output.includes(frontend.readyMessage)) {
        log(frontend.name, `¡Listo! Corriendo en puerto ${frontend.port}`, 'success');
        resolve();
      }
      
      // Guardar logs detallados
      fs.appendFileSync(`${LOGS_DIR}/${frontend.name}.log`, output);
    });
    
    // Manejar stderr
    childProcess.stderr.on('data', (data: Buffer) => {
      const output = data.toString();
      console.error(chalk.red(`[${frontend.name}] `) + output.trimEnd());
      fs.appendFileSync(`${LOGS_DIR}/${frontend.name}.log`, output);
    });
    
    // Manejar cierre del proceso
    childProcess.on('close', (code: number | null) => {
      if (code !== 0 && code !== null) {
        log(frontend.name, `Proceso terminado con código ${code}`, 'error');
        reject(new Error(`${frontend.name} terminado con código ${code}`));
      } else {
        log(frontend.name, 'Proceso terminado correctamente', 'info');
        delete processes[frontendName];
      }
    });
    
    // Tiempo máximo de espera para inicio (3 minutos)
    setTimeout(() => {
      if (processes[frontendName] === childProcess) {
        reject(new Error(`Tiempo de espera agotado para ${frontend.name}`));
      }
    }, 3 * 60 * 1000);
  });
}

/**
 * Inicia todos los frontends
 */
async function startAllFrontends(mode: 'dev' | 'prod'): Promise<void> {
  log('system', `Iniciando todos los frontends en modo ${mode}`, 'info');
  
  try {
    // Primero la web, luego mobile
    await startFrontend('web', mode);
    await startFrontend('mobile', mode);
    
    log('system', 'Todos los frontends están en ejecución', 'success');
    log('system', '- Web: http://localhost:4444', 'success');
    log('system', '- Mobile: http://localhost:6969', 'success');
    log('system', '- Expo Go: exp://localhost:6969', 'success');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log('system', `Error al iniciar frontends: ${errorMessage}`, 'error');
    await stopAllFrontends();
    process.exit(1);
  }
}

/**
 * Detiene todos los frontends
 */
async function stopAllFrontends(): Promise<void> {
  log('system', 'Deteniendo todos los frontends...', 'info');
  
  // Detener en orden inverso
  const frontendNames = Object.keys(processes).reverse();
  
  for (const name of frontendNames) {
    if (processes[name]) {
      log(name, 'Enviando señal de terminación...', 'info');
      processes[name].kill('SIGTERM');
      
      // Esperar un momento para que termine
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Forzar terminación si sigue ejecutándose
      if (processes[name]) {
        log(name, 'Forzando terminación...', 'info');
        processes[name].kill('SIGKILL');
        delete processes[name];
      }
    }
  }
  
  log('system', 'Todos los frontends han sido detenidos', 'success');
}

/**
 * Punto de entrada principal
 */
async function main(): Promise<void> {
  // Determinar modo (desarrollo o producción)
  const isProd = process.argv.includes('--prod');
  const mode = isProd ? 'prod' : 'dev';
  
  // Manejar señales para cerrar adecuadamente
  process.on('SIGINT', async () => {
    log('system', 'Recibida señal de interrupción (CTRL+C)', 'info');
    await stopAllFrontends();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    log('system', 'Recibida señal de terminación', 'info');
    await stopAllFrontends();
    process.exit(0);
  });
  
  // Iniciar frontends
  try {
    await startAllFrontends(mode);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log('system', `Error fatal: ${errorMessage}`, 'error');
    process.exit(1);
  }
}

// Iniciar programa
main(); 