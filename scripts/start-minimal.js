/**
 * Script para iniciar MapYourWorld con los componentes esenciales
 * Muestra un mensaje de bienvenida y ejecuta la API Gateway y el Frontend Web
 */

const { spawn } = require('child_process');
const path = require('path');
const chalk = require('chalk') || { green: (text) => text, blue: (text) => text, yellow: (text) => text };

console.log('\n');
console.log(chalk.green('=== Bienvenido a MapYourWorld ==='));
console.log(chalk.blue('Iniciando los componentes esenciales...'));
console.log(chalk.yellow('• API Gateway (backend)'));
console.log(chalk.yellow('• Frontend Web (vite)'));
console.log('\n');
console.log(chalk.blue('Esto puede tardar unos segundos...'));
console.log('\n');

// Directorios de los servicios
const apiGatewayDir = path.join(__dirname, '../backend/api-gateway');
const baseDatosDir = path.join(__dirname, '../backend');

const webFrontendDir = path.join(__dirname, '../frontend/web');

// Función para iniciar un servicio
function startService(name, dir, command, args) {
  console.log(chalk.green(`Iniciando ${name}...`));
  
  const process = spawn(command, args, { 
    cwd: dir,
    shell: true,
    stdio: 'inherit'
  });
  
  process.on('error', (error) => {
    console.error(chalk.red(`Error al iniciar ${name}:`), error);
  });
  
  return process;
}

// Iniciar API Gateway
const apiGateway = startService('API Gateway', apiGatewayDir, 'npm', ['run', 'dev']);

// Iniciar Frontend Web
const webFrontend = startService('Frontend Web', webFrontendDir, 'npm', ['run', 'dev']);

// Iniciar Base de Datos (usando npm run dev:db)
const baseDatos = startService('Database', baseDatosDir, 'npm', ['run', 'dev:db']);




console.log(chalk.green('\nTodos los servicios iniciados correctamente.'));
console.log(chalk.blue('API Gateway disponible en: http://localhost:3000'));
console.log(chalk.blue('Frontend Web disponible en: http://localhost:5173'));
console.log('\n');
console.log(chalk.yellow('Presiona Ctrl+C para detener todos los servicios.'));

// Manejar cierre controlado
process.on('SIGINT', () => {
  console.log(chalk.yellow('\nDeteniendo servicios...'));
  
  apiGateway.kill();
  webFrontend.kill();
  baseDatos.kill()
  
  setTimeout(() => {
    console.log(chalk.green('Servicios detenidos correctamente.'));
    process.exit();
  }, 1000);
}); 