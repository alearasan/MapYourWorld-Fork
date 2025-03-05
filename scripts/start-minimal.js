/**
 * Script para iniciar MapYourWorld con los componentes esenciales
 * Muestra un mensaje de bienvenida y ejecuta la API Gateway y el Frontend Mobile/Web
 */

const { spawn } = require('child_process');
const path = require('path');
// Importando chalk de manera compatible con ESM y CJS
const chalk = require('chalk');

// Creando una versión de respaldo si chalk no funciona correctamente
const colorize = {
  green: (text) => chalk.green ? chalk.green(text) : `\x1b[32m${text}\x1b[0m`,
  blue: (text) => chalk.blue ? chalk.blue(text) : `\x1b[34m${text}\x1b[0m`,
  yellow: (text) => chalk.yellow ? chalk.yellow(text) : `\x1b[33m${text}\x1b[0m`,
  red: (text) => chalk.red ? chalk.red(text) : `\x1b[31m${text}\x1b[0m`
};

console.log('\n');
console.log(colorize.green('=== Bienvenido a MapYourWorld ==='));
console.log(colorize.blue('Iniciando los componentes esenciales...'));
console.log(colorize.yellow('• API Gateway (backend)'));
console.log(colorize.yellow('• Frontend Expo (Web/Mobile)'));
console.log(colorize.yellow('• Base de Datos'));
console.log('\n');
console.log(colorize.blue('Esto puede tardar unos segundos...'));
console.log('\n');

// Directorios de los servicios
const backendDir = path.join(__dirname, '../backend');
const frontendDir = path.join(__dirname, '../frontend/mobile');
const baseDatosDir = path.join(__dirname, '../backend/database');

// Función para iniciar un servicio
function startService(name, dir, command, args) {
  console.log(colorize.green(`Iniciando ${name}...`));
  
  const process = spawn(command, args, { 
    cwd: dir,
    shell: true,
    stdio: 'inherit'
  });
  
  process.on('error', (error) => {
    console.error(colorize.red(`Error al iniciar ${name}:`), error);
  });
  
  return process;
}

// Iniciar Base de Datos
const baseDatos = startService('Database', backendDir, 'npm', ['run', 'dev:db']);

// Iniciar API Gateway desde el backend consolidado
const apiGateway = startService('API Gateway', backendDir, 'npm', ['run', 'dev:gateway']);

// Iniciar Frontend con Expo
const frontend = startService('Frontend (Web/Mobile)', frontendDir, 'npx', ['expo', 'start', '--web']);

console.log(colorize.green('\nTodos los servicios iniciados correctamente.'));
console.log(colorize.blue('API Gateway disponible en: http://localhost:3000'));
console.log(colorize.blue('Frontend Web disponible en: http://localhost:19006'));
console.log('\n');
console.log(colorize.yellow('Presiona Ctrl+C para detener todos los servicios.'));

// Manejar cierre controlado
process.on('SIGINT', () => {
  console.log(colorize.yellow('\nDeteniendo servicios...'));
  
  apiGateway.kill();
  frontend.kill();
  baseDatos.kill();
  
  setTimeout(() => {
    console.log(colorize.green('Servicios detenidos correctamente.'));
    process.exit();
  }, 1000);
}); 