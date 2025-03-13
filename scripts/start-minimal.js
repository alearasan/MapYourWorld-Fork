/**
 * Script para iniciar los servicios esenciales de MapYourWorld
 * 
 * Este script inicia la base de datos PostgreSQL, el backend y los frontends en un único comando.
 * Está diseñado para proporcionar un entorno de desarrollo completo de forma rápida.
 * Para la aplicación móvil, muestra el código QR de Expo directamente en la consola.
 */

const { spawn } = require('child_process');
const chalk = require('chalk');
const readline = require('readline');
const path = require('path');
const fs = require('fs');
const net = require('net');

// Configuración de servicios
const DB_PATH = path.join(__dirname, '../db');
const BACKEND_PATH = path.join(__dirname, '../backend');
const WEB_PATH = path.join(__dirname, '../frontend/web');
const MOBILE_PATH = path.join(__dirname, '../frontend/mobile');

// Mensajes para detectar que un servicio está listo
const READY_MESSAGES = {
  database: ['Base de datos lista', 'Database is ready', 'Connected to database', 'waiting for connections'],
  backend: ['API Gateway ejecutándose en http', 'Servidor ejecutándose en', 'API Gateway running on', 'Server running'],
  mobile: ['Starting Metro Bundler', 'Starting the Development Server', 'Developer tools running on', 'Web Bundled']
};

// Mensajes de error críticos que indican fallos severos
const ERROR_MESSAGES = [
  'ECONNREFUSED',
  'ETIMEDOUT',
  'Error fatal:',
  'Failed to connect to RabbitMQ',
  'Error al iniciar RabbitMQ',
  'Error crítico en la inicialización',
  'Error: Cannot find module'
];

// Control de procesos
const processes = {};
let shuttingDown = false;

// Estados de los servicios
const serviceStates = {
  database: { ready: false, started: false, required: true, readyCount: 0, neededReadyCount: 1 },
  backend: { ready: false, started: false, required: true, readyCount: 0, neededReadyCount: 2 }, // Necesitamos 2 mensajes (RabbitMQ + API Gateway)
  mobile: { ready: false, started: false, required: false, readyCount: 0, neededReadyCount: 1 }
};

// Registro de puertos utilizados
const usedPorts = {
  apiGateway: 3000,
  mobile: 4444
};

/**
 * Imprime un mensaje formateado en la consola
 */
function log(service, message, type = 'info') {
  const timestamp = new Date().toISOString();
  let coloredMsg = '';
  let serviceColor = '';
  
  // Colorear el servicio
  switch (service) {
    case 'database':
      serviceColor = chalk.green(service);
      break;
    case 'backend':
      serviceColor = chalk.blue(service);
      break;
    case 'web':
      serviceColor = chalk.magenta(service);
      break;
    case 'mobile':
      serviceColor = chalk.cyan(service);
      break;
    default:
      serviceColor = chalk.yellow(service);
  }
  
  // Colorear el mensaje según su tipo
  switch (type) {
    case 'error':
      coloredMsg = chalk.red(message);
      break;
    case 'success':
      coloredMsg = chalk.green(message);
      break;
    case 'warning':
      coloredMsg = chalk.yellow(message);
      break;
    default:
      coloredMsg = message;
  }
  
  console.log(`[${chalk.gray(timestamp)}] [${serviceColor}] ${coloredMsg}`);
  
  // También guardar en un archivo de logs
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const logFile = path.join(logDir, 'start-minimal.log');
  fs.appendFileSync(logFile, `[${timestamp}] [${service}] [${type.toUpperCase()}] ${message}\n`);
}

/**
 * Verifica si PostgreSQL está disponible
 */
async function checkPostgreSQL() {
  return new Promise((resolve) => {
    log('system', 'Verificando disponibilidad de PostgreSQL...', 'info');
    
    // PostgreSQL normalmente usa el puerto 5432
    const client = new net.Socket();
    let isAvailable = false;
    
    // Establecer timeout
    const timeout = setTimeout(() => {
      client.destroy();
      log('system', 'PostgreSQL no parece estar en ejecución en el puerto 5432', 'info');
      resolve(false);
    }, 1000);
    
    client.connect(5432, 'localhost', () => {
      clearTimeout(timeout);
      isAvailable = true;
      log('system', 'PostgreSQL está en ejecución en el puerto 5432', 'success');
      client.destroy();
    });
    
    client.on('error', () => {
      clearTimeout(timeout);
      log('system', 'PostgreSQL no está en ejecución, se intentará iniciar', 'info');
      client.destroy();
    });
    
    client.on('close', () => {
      resolve(isAvailable);
    });
  });
}

/**
 * Verifica si RabbitMQ está disponible
 */
async function checkRabbitMQ() {
  return new Promise((resolve) => {
    log('system', 'Verificando disponibilidad de RabbitMQ...', 'info');
    
    // RabbitMQ normalmente usa el puerto 5672
    const client = new net.Socket();
    let isAvailable = false;
    
    // Establecer timeout
    const timeout = setTimeout(() => {
      client.destroy();
      log('system', 'RabbitMQ no parece estar en ejecución en el puerto 5672', 'warning');
      resolve(false);
    }, 2000);
    
    client.connect(5672, 'localhost', () => {
      clearTimeout(timeout);
      isAvailable = true;
      log('system', 'RabbitMQ está disponible en el puerto 5672', 'success');
      client.destroy();
    });
    
    client.on('error', () => {
      clearTimeout(timeout);
      log('system', 'RabbitMQ no está disponible - se recomienda instalarlo para el funcionamiento completo', 'warning');
      client.destroy();
    });
    
    client.on('close', () => {
      resolve(isAvailable);
    });
  });
}

/**
 * Inicia un servicio
 */
function startService(name, command, args, cwd, env = {}) {
  return new Promise((resolve, reject) => {
    if (serviceStates[name]?.started) {
      log(name, 'Servicio ya iniciado', 'warning');
      return resolve();
    }
    
    log(name, `Iniciando servicio: ${command} ${args.join(' ')}`, 'info');
    
    // Configurar variables de entorno adicionales
    const serviceEnv = {
      ...process.env,
      UNIFIED_START: 'true', // Indica que se está iniciando desde este script
      ...env
    };
    
    // Configuración especial para mostrar correctamente el QR
    const spawnOptions = {
      cwd,
      env: serviceEnv,
      shell: true
    };
    
    // Para el servicio mobile (Expo), usar stdio 'inherit' para mostrar correctamente el QR
    if (name === 'mobile') {
      // Simplemente mostramos directamente la salida, sin filtros
      spawnOptions.stdio = 'inherit';
    } else {
      spawnOptions.stdio = 'pipe';
    }
    
    // Iniciar el proceso
    const proc = spawn(command, args, spawnOptions);
    
    // Almacenar referencia al proceso
    processes[name] = proc;
    
    if (serviceStates[name]) {
      serviceStates[name].started = true;
      
      // Si es el servicio mobile, marcamos como listo después de un tiempo
      if (name === 'mobile') {
        setTimeout(() => {
          log(name, 'Servicio móvil iniciado. El QR se muestra en la consola.', 'success');
          serviceStates[name].ready = true;
        }, 1000);
      }
    }
    
    // Solo manejar salida si no estamos usando stdio heredado
    if (proc.stdout) {
      // Manejar salida estándar
      proc.stdout.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          // Detectar mensajes de que el servicio está listo
          if (READY_MESSAGES[name]) {
            for (const readyMsg of READY_MESSAGES[name]) {
              if (line.includes(readyMsg)) {
                if (serviceStates[name]) {
                  serviceStates[name].readyCount++;
                  log(name, `Mensaje de inicialización detectado (${serviceStates[name].readyCount}/${serviceStates[name].neededReadyCount}): ${readyMsg}`, 'success');
                  
                  // Si alcanzamos el número requerido de mensajes, marcamos como listo
                  if (serviceStates[name].readyCount >= serviceStates[name].neededReadyCount) {
                    serviceStates[name].ready = true;
                    log(name, 'Servicio iniciado completamente ✅', 'success');
                    
                    // Si es el backend, podemos iniciar los frontends
                    if (name === 'backend' && !serviceStates.mobile.started) {
                      setTimeout(() => {
                        log('system', 'Backend listo, iniciando servicios de frontend...', 'info');
                        startFrontendServices();
                      }, 2000);
                    }
                  }
                }
                break;
              }
            }
          }
          
          // Detectar errores críticos
          let isError = false;
          for (const errorMsg of ERROR_MESSAGES) {
            if (line.includes(errorMsg)) {
              log(name, `Error detectado: ${line}`, 'error');
              isError = true;
              break;
            }
          }
          
          // Log normal si no es error ni mensaje de ready
          if (!isError) {
            log(name, line);
          }
        }
      });
    }
    
    // Manejar errores solo si tenemos acceso a stderr
    if (proc.stderr) {
      proc.stderr.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          // Algunos mensajes en stderr son informativos, no errores reales
          if (line.includes('DeprecationWarning') || 
              line.includes('ExperimentalWarning') || 
              line.includes('Starting compilation in watch mode')) {
            log(name, line, 'warning');
          } else {
            log(name, line, 'error');
          }
          
          // Detectar errores críticos
          for (const errorMsg of ERROR_MESSAGES) {
            if (line.includes(errorMsg)) {
              log(name, `Error crítico detectado: ${line}`, 'error');
              
              // Si es un servicio obligatorio, considerar detener todo
              if (serviceStates[name]?.required) {
                log('system', `Error en servicio esencial ${name}, se detendrá la ejecución en 10 segundos...`, 'error');
                
                if (!shuttingDown) {
                  shuttingDown = true;
                  setTimeout(() => {
                    stopAllServices();
                  }, 10000);
                }
              }
              break;
            }
          }
        }
      });
    }
    
    // Manejar cierre del proceso
    proc.on('close', (code) => {
      delete processes[name];
      
      if (serviceStates[name]) {
        serviceStates[name].started = false;
        serviceStates[name].ready = false;
        serviceStates[name].readyCount = 0;
      }
      
      if (shuttingDown) {
        log(name, `Servicio detenido (código: ${code})`, 'info');
        return;
      }
      
      if (code !== 0) {
        log(name, `Servicio terminado con código de error: ${code}`, 'error');
        
        // Si es un servicio obligatorio, detener todo
        if (serviceStates[name]?.required && !shuttingDown) {
          log('system', `Servicio esencial ${name} falló, deteniendo todos los servicios...`, 'error');
          shuttingDown = true;
          stopAllServices();
        }
        
        reject(new Error(`Servicio ${name} falló con código ${code}`));
      } else {
        log(name, 'Servicio detenido correctamente', 'info');
        resolve();
      }
    });
    
    // Timeout para servicio que no alcanza el estado ready
    setTimeout(() => {
      if (serviceStates[name] && !serviceStates[name].ready && serviceStates[name].started) {
        if (name === 'backend' && serviceStates[name].readyCount > 0) {
          // Si al menos detectamos algún mensaje de ready, asumimos que está funcionando parcialmente
          log(name, `Tiempo de espera agotado pero servicio parece estar funcionando parcialmente. Continuando...`, 'warning');
          serviceStates[name].ready = true;
          
          // Iniciar frontends de todos modos
          if (!serviceStates.mobile.started) {
            setTimeout(() => {
              log('system', 'Iniciando servicios de frontend a pesar de inicialización parcial del backend...', 'warning');
              startFrontendServices();
            }, 2000);
          }
          
          resolve();
        } else if (serviceStates[name].required) {
          log(name, `Tiempo de espera agotado para inicialización completa`, 'error');
          // No rechazamos para permitir que el sistema siga funcionando
          resolve();
        } else {
          // Si es el servicio móvil, siempre marcarlo como listo para evitar timeout innecesario
          if (name === 'mobile') {
            serviceStates[name].ready = true;
            log(name, `Servicio móvil en ejecución. Puedes acceder mediante http://localhost:${usedPorts.mobile} o con la app Expo Go`, 'success');
          } else {
            log(name, `Tiempo de espera agotado pero servicio no es crítico. Continuando...`, 'warning');
          }
          resolve();
        }
      }
    }, name === 'backend' ? 180000 : (name === 'mobile' ? 120000 : 60000)); // 3 minutos para backend, 2 minutos para mobile, 1 minuto para otros
  });
}

/**
 * Inicia la base de datos PostgreSQL
 */
async function startDatabase() {
  log('system', 'Iniciando base de datos...', 'info');
  
  const isPostgreSQLRunning = await checkPostgreSQL();
  
  if (isPostgreSQLRunning) {
    log('database', 'PostgreSQL ya está en ejecución, no es necesario iniciarlo', 'success');
    serviceStates.database.started = true;
    serviceStates.database.ready = true;
    return;
  }
  
  // No intentamos iniciar PostgreSQL si no está en ejecución
  // PostgreSQL debe ser instalado y configurado manualmente
  log('database', 'PostgreSQL no está en ejecución. Debe instalarlo y configurarlo manualmente.', 'warning');
  log('database', 'Usando la configuración TypeORM para verificar la conexión a la base de datos', 'info');
  
  // En lugar de iniciar el servidor, vamos a cargar los scripts de inicialización
  try {
    // Importar el script de inicialización de la base de datos
    const dbPath = path.join(__dirname, './backend/database');
    
    // Ejecutar script de inicialización en un proceso separado
    const initProcess = spawn('npx', ['-r', 'ts-node/register', 'db.ts'], {
      cwd: dbPath,
      stdio: 'pipe'
    });
    
    processes.database = initProcess;
    serviceStates.database.started = true;
    
    // Manejar salida
    initProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      log('database', output, 'info');
      
      if (output.includes('Tablas creadas satisfactoriamente') || 
          output.includes('Conexión a la base de datos establecida')) {
        serviceStates.database.ready = true;
        serviceStates.database.readyCount++;
        log('database', 'Base de datos inicializada correctamente', 'success');
      }
    });
    
    initProcess.stderr.on('data', (data) => {
      log('database', data.toString().trim(), 'error');
    });
    
    // Manejar errores
    initProcess.on('error', (error) => {
      log('database', `Error al iniciar script de base de datos: ${error.message}`, 'error');
    });
    
    // Esperar un tiempo prudencial
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Si no detectamos mensaje de éxito pero tampoco errores, asumimos que está bien
    if (!serviceStates.database.ready && processes.database) {
      log('database', 'No se detectó mensaje de éxito, pero el proceso sigue en ejecución', 'warning');
      serviceStates.database.ready = true;
    }
    
  } catch (error) {
    log('database', `Error al iniciar la base de datos: ${error.message}`, 'error');
    throw new Error(`Error al iniciar la base de datos: ${error.message}`);
  }
}

/**
 * Inicia el backend
 */
async function startBackend() {
  log('system', 'Iniciando backend...', 'info');
  
  // Verificar si el puerto 3000 está realmente libre
  const port3000Free = await isPortFree(3000);
  
  // Variables de entorno adicionales
  let env = {};
  
  // Si el puerto 3000 no está libre, buscar uno alternativo
  if (!port3000Free) {
    // Intentar puertos alternativos: 3001, 3002, 3003, 3004
    let alternativePort = null;
    for (let port of [3001, 3002, 3003, 3004]) {
      if (await isPortFree(port)) {
        alternativePort = port;
        break;
      }
    }
    
    if (alternativePort) {
      log('system', `Puerto 3000 en uso, usando puerto alternativo: ${alternativePort}`, 'warning');
      env.PORT = alternativePort.toString();
      env.API_PORT = alternativePort.toString();
      usedPorts.apiGateway = alternativePort;
    } else {
      log('system', 'No se encontró ningún puerto libre (3000-3004), intentando forzar el cierre', 'error');
      // Intento más agresivo de liberar el puerto 3000
      await killProcessOnPort(3000);
    }
  }
  
  try {
    await startService(
      'backend',
      'npm',
      ['run', 'dev:gateway'],
      BACKEND_PATH,
      env
    );
    
    log('system', 'API Gateway iniciado correctamente', 'success');
    return true;
  } catch (error) {
    log('system', `Error al iniciar el backend: ${error.message}`, 'error');
    throw new Error(`Error al iniciar el backend: ${error.message}`);
  }
}

/**
 * Verifica si un puerto está libre
 */
async function isPortFree(port) {
  return new Promise((resolve) => {
    const testSocket = new net.Socket();
    const timeout = setTimeout(() => {
      testSocket.destroy();
      resolve(true); // El puerto está libre
    }, 500);
    
    testSocket.on('connect', () => {
      clearTimeout(timeout);
      testSocket.destroy();
      resolve(false); // El puerto está en uso
    });
    
    testSocket.on('error', (err) => {
      clearTimeout(timeout);
      // ECONNREFUSED significa que nada está escuchando en ese puerto
      resolve(err.code === 'ECONNREFUSED');
    });
    
    testSocket.connect(port, 'localhost');
  });
}

/**
 * Último recurso - mata de forma agresiva los procesos en un puerto
 */
async function killProcessOnPort(port) {
  return new Promise((resolve) => {
    log('system', `Forzando cierre de procesos en puerto ${port}...`, 'warning');
    
    let command, args;
    
    if (process.platform === 'win32') {
      // Windows - más agresivo
      command = 'cmd.exe';
      args = [
        '/c',
        `for /f "tokens=5" %a in ('netstat -ano ^| findstr LISTENING ^| findstr :${port}') do taskkill /F /PID %a`
      ];
    } else {
      // Linux/Mac - más agresivo
      command = 'sh';
      args = [
        '-c',
        `lsof -i :${port} -t | xargs -r kill -9`
      ];
    }
    
    const proc = spawn(command, args, { shell: true });
    
    proc.on('close', () => {
      // Esperar un poco más antes de continuar
      setTimeout(resolve, 2000);
    });
    
    proc.on('error', () => {
      // Continuar de todos modos
      setTimeout(resolve, 2000);
    });
  });
}

/**
 * Inicia los servicios de frontend (web y mobile)
 */
async function startFrontendServices() {
  try {
    // Verificar si el puerto 4444 está realmente libre
    const port4444Free = await isPortFree(4444);
    
    // Variables de entorno adicionales
    let env = {
      // Solo dejamos lo mínimo necesario
      CI: "0" // Asegurar que es interactivo
    };
    
    // Si el puerto 4444 no está libre, buscar uno alternativo
    if (!port4444Free) {
      // Intentar puertos alternativos: 4445, 4446, 4447, 4448
      let alternativePort = null;
      for (let port of [4445, 4446, 4447, 4448]) {
        if (await isPortFree(port)) {
          alternativePort = port;
          break;
        }
      }
      
      if (alternativePort) {
        log('system', `Puerto 4444 en uso, usando puerto alternativo: ${alternativePort}`, 'warning');
        env.PORT = alternativePort.toString();
        usedPorts.mobile = alternativePort;
      } else {
        log('system', 'No se encontró ningún puerto libre (4444-4448), intentando forzar el cierre', 'error');
        // Intento más agresivo de liberar el puerto 4444
        await killProcessOnPort(4444);
      }
    }
    
    log('system', '📱 Iniciando Expo - El código QR aparecerá a continuación:', 'info');
    
    // Iniciamos Expo de la forma más simple posible
    await startService(
      'mobile',
      'npx',
      ['expo', 'start', '--port', usedPorts.mobile.toString()],
      MOBILE_PATH,
      env
    );
    
    log('system', 'Servicio de frontend móvil iniciado (proporciona también versión web)', 'success');
    log('system', `📱 Si no ves el código QR, abre manualmente: http://localhost:${usedPorts.mobile}`, 'info');
  } catch (error) {
    log('system', `Error al iniciar servicio de frontend: ${error.message}`, 'error');
  }
}

/**
 * Detiene todos los servicios
 */
function stopAllServices() {
  log('system', 'Deteniendo todos los servicios...', 'info');
  shuttingDown = true;
  
  // Servicio mobile
  if (processes.mobile) {
    log('mobile', 'Enviando señal para detener...', 'info');
    processes.mobile.kill('SIGINT');
  }
  
  // Backend (este gestionará el cierre de todos los microservicios)
  if (processes.backend) {
    log('backend', 'Enviando señal para detener...', 'info');
    processes.backend.kill('SIGINT');
  }
  
  // Base de datos (último para asegurar que los datos se guarden)
  setTimeout(() => {
    if (processes.database) {
      log('database', 'Enviando señal para detener...', 'info');
      processes.database.kill('SIGINT');
    }
    
    // Salir después de un tiempo
    setTimeout(() => {
      log('system', 'Sistema detenido completamente', 'info');
      process.exit(0);
    }, 2000);
  }, 3000);
}

/**
 * Libera puertos específicos matando procesos que los estén usando
 */
async function freePort(port) {
  return new Promise((resolve, reject) => {
    log('system', `Liberando puerto ${port} si está en uso...`, 'info');
    
    // El comando varía según plataforma
    let command, args;
    
    if (process.platform === 'win32') {
      // Windows - usamos netstat y taskkill que son más confiables
      command = 'cmd.exe';
      args = [
        '/c',
        `for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port}') do taskkill /F /PID %a`
      ];
    } else {
      // Linux/Mac
      command = 'sh';
      args = [
        '-c',
        `lsof -i :${port} -t | xargs -r kill -9`
      ];
    }
    
    const proc = spawn(command, args, { shell: true });
    
    proc.on('close', (code) => {
      // Código 1 es normal cuando no hay procesos en ese puerto
      if (code === 0 || code === 1) {
        log('system', `Puerto ${port} liberado exitosamente`, 'success');
      } else {
        log('system', `Intento de liberar puerto ${port} completado (código: ${code})`, 'warning');
      }
      
      // Verificar que el puerto realmente esté libre
      setTimeout(() => {
        const testSocket = new net.Socket();
        const timeout = setTimeout(() => {
          testSocket.destroy();
          log('system', `Puerto ${port} está libre`, 'success');
          resolve(true);
        }, 500);
        
        testSocket.on('error', (err) => {
          // Error ECONNREFUSED significa que el puerto está libre
          if (err.code === 'ECONNREFUSED') {
            clearTimeout(timeout);
            log('system', `Puerto ${port} está libre (verificado)`, 'success');
            resolve(true);
          } else {
            clearTimeout(timeout);
            log('system', `Puerto ${port} aún parece estar en uso: ${err.code}`, 'warning');
            resolve(false); // Resolvemos con false para indicar que no se pudo liberar
          }
        });
        
        testSocket.connect(port, 'localhost');
      }, 1000); // Esperamos 1 segundo antes de verificar
    });
    
    proc.on('error', (err) => {
      log('system', `Error al ejecutar comando para liberar puerto ${port}: ${err.message}`, 'error');
      resolve(false);
    });
  });
}

/**
 * Libera todos los puertos necesarios
 */
async function freePorts() {
  log('system', 'Liberando puertos utilizados por la aplicación...', 'info');
  await freePort(3000); // API Gateway
  await freePort(4444); // Mobile
}

/**
 * Función principal
 */
async function main() {
  console.clear();
  log('system', '🚀 Iniciando sistema MapYourWorld', 'success');
  log('system', 'Para detener todos los servicios, presione CTRL+C', 'info');
  
  // Manejar señales para cierre limpio
  process.on('SIGINT', () => {
    if (!shuttingDown) {
      log('system', 'Recibida señal de interrupción (CTRL+C)', 'info');
      stopAllServices();
    }
  });
  
  process.on('SIGTERM', () => {
    if (!shuttingDown) {
      log('system', 'Recibida señal de terminación', 'info');
      stopAllServices();
    }
  });
  
  try {
    // Liberar puertos antes de iniciar
    await freePorts();
    
    // Iniciar base de datos
    log('system', 'Iniciando base de datos...', 'info');
    await startDatabase();
    
    // Iniciar backend
    log('system', 'Iniciando backend...', 'info');
    const rabbitMQAvailable = await checkRabbitMQ();
    await startBackend();
    
    // Verificar estado del sistema después de un tiempo
    setTimeout(() => {
      if (!shuttingDown) {
        log('system', '📊 Estado del sistema:', 'info');
        
        if (serviceStates.database.ready) {
          log('system', '✅ Base de datos: PostgreSQL', 'success');
        } else {
          log('system', '❌ Base de datos: No iniciada o con errores', 'error');
        }
        
        if (serviceStates.backend.ready) {
          log('system', '✅ Backend: Servicios', 'success');
          log('system', `✅ API Gateway: http://localhost:${usedPorts.apiGateway}`, 'success');
          log('system', `✅ Documentación API: http://localhost:${usedPorts.apiGateway}/api/docs`, 'success');
        } else {
          log('system', '❌ Backend: No iniciado completamente o con errores', 'error');
        }
        
        if (serviceStates.mobile.started) {
          log('system', `✅ Aplicación Móvil (Expo): http://localhost:${usedPorts.mobile}`, 'success');
          log('system', '   📱 El código QR debe mostrarse directamente en la consola', 'info');
          log('system', '   📱 Si no ves el QR, abre la URL directamente en el navegador', 'info');
        } else {
          log('system', '❌ Aplicación Móvil: No iniciada o con errores', 'error');
        }
      }
    }, 15000);
    
  } catch (error) {
    log('system', `Error al iniciar el sistema: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Ejecutar la función principal
main().catch(error => {
  log('system', `Error inesperado: ${error.message}`, 'error');
  stopAllServices();
}); 