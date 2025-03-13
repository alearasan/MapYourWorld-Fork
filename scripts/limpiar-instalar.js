#!/usr/bin/env node

  /**
   * Script para limpiar e instalar todas las dependencias
   */

  const { execSync } = require('child_process');
  const fs = require('fs');
  const path = require('path');
  const os = require('os');

  // Códigos de color para la salida
  const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    bright: '\x1b[1m'
  };

  // Función para ejecutar comandos shell de forma segura
  function runCommand(command, directory = '.') {
    try {
      console.log(`${colors.cyan}Ejecutando:${colors.reset} ${command} ${colors.yellow}(en ${directory})${colors.reset}`);
      execSync(command, { cwd: directory, stdio: 'inherit' });
      return true;
    } catch (error) {
      console.error(`${colors.red}Error al ejecutar comando:${colors.reset} ${command}`);
      console.error(`${colors.red}${error.message}${colors.reset}`);
      return false;
    }
  }

  // Función para eliminar directorios de forma segura
  function removeDirSafely(dir) {
    const fullPath = path.resolve(__dirname, '..', dir);
    
    if (!fs.existsSync(fullPath)) {
      return true;
    }
    
    console.log(`${colors.yellow}Eliminando${colors.reset} ${dir}`);
    
    try {
      if (os.platform() === 'win32') {
        // En Windows, usar comandos específicos para manejar carpetas bloqueadas
        try {
          execSync(`rd /s /q "${fullPath}"`, { stdio: 'ignore' });
        } catch (error) {
          // Si falla, intentar con robocopy (truco para eliminar carpetas bloqueadas en Windows)
          const tempEmptyDir = path.join(os.tmpdir(), 'empty_dir_' + Date.now());
          fs.mkdirSync(tempEmptyDir, { recursive: true });
          execSync(`robocopy "${tempEmptyDir}" "${fullPath}" /MIR /NFL /NDL /NJH /NJS /nc /ns /np`, { stdio: 'ignore' });
          execSync(`rd /s /q "${fullPath}"`, { stdio: 'ignore' });
          fs.rmdirSync(tempEmptyDir);
        }
      } else {
        // En sistemas Unix
        execSync(`rm -rf "${fullPath}"`);
      }
      return true;
    } catch (error) {
      console.error(`${colors.red}Error al eliminar ${dir}:${colors.reset} ${error.message}`);
      return false;
    }
  }

  console.log(`\n${colors.bright}${colors.blue}===================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}         LIMPIEZA E INSTALACIÓN DE DEPENDENCIAS      ${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}===================================================${colors.reset}\n`);

  // Verificar entorno primero
  console.log(`${colors.bright}${colors.magenta}PASO 1: Verificando entorno${colors.reset}\n`);
  runCommand('node scripts/verificar-entorno.js');

  // Cerrar procesos de Node que puedan bloquear archivos (en Windows)
  if (os.platform() === 'win32') {
    console.log(`\n${colors.bright}${colors.magenta}PASO 2: Cerrando procesos de Node${colors.reset}\n`);
    try {
      execSync('taskkill /f /im node.exe', { stdio: 'ignore' });
    } catch (error) {
      // Ignorar errores si no hay procesos que matar
    }
  }

  // Directorios a limpiar
  console.log(`\n${colors.bright}${colors.magenta}PASO 3: Limpiando node_modules${colors.reset}\n`);
  const dirsToClean = [
    'node_modules',
    'frontend/node_modules',
    'frontend/web/node_modules',
    'frontend/mobile/node_modules',
    'backend/node_modules',
    'backend/api-gateway/node_modules',
    'shared/node_modules'
  ];

  // Eliminar node_modules
  dirsToClean.forEach(dir => {
    removeDirSafely(dir);
  });

  // Eliminar package-lock.json
  console.log(`\n${colors.bright}${colors.magenta}PASO 4: Limpiando package-lock.json${colors.reset}\n`);
  const locksToClean = [
    'package-lock.json',
    'frontend/package-lock.json',
    'frontend/web/package-lock.json',
    'frontend/mobile/package-lock.json',
    'backend/package-lock.json',
    'backend/api-gateway/package-lock.json',
    'shared/package-lock.json'
  ];

  locksToClean.forEach(file => {
    const fullPath = path.resolve(__dirname, '..', file);
    if (fs.existsSync(fullPath)) {
      console.log(`${colors.yellow}Eliminando${colors.reset} ${file}`);
      fs.unlinkSync(fullPath);
    }
  });

  // Instalar dependencias
  console.log(`\n${colors.bright}${colors.magenta}PASO 5: Instalando dependencias${colors.reset}\n`);
  if (runCommand('npm install', path.resolve(__dirname, '..'))) {
    console.log(`\n${colors.bright}${colors.green}¡Instalación completada con éxito!${colors.reset}\n`);
    console.log(`Para iniciar el desarrollo:\n`);
    console.log(`- Frontend web:   ${colors.cyan}npm run dev:web${colors.reset}`);
    console.log(`- Frontend móvil: ${colors.cyan}npm run dev:mobile${colors.reset}`);
    console.log(`- Backend:        ${colors.cyan}npm run dev:backend${colors.reset}`);
    console.log(`- Todo junto:     ${colors.cyan}npm run dev${colors.reset}\n`);
  } else {
    console.log(`\n${colors.bright}${colors.red}Hubo problemas durante la instalación.${colors.reset}`);
    console.log(`Intenta ejecutar manualmente: ${colors.cyan}npm install${colors.reset}\n`);
  }
  