#!/usr/bin/env node

  /**
   * Script para verificar que el entorno de desarrollo está correctamente configurado
   */

  const { execSync } = require('child_process');

  // Códigos de color para la salida
  const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    bright: '\x1b[1m'
  };

  console.log(`${colors.bright}${colors.blue}===================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}       VERIFICANDO ENTORNO DE DESARROLLO           ${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}===================================================${colors.reset}\n`);

  // Verificar versión de Node.js
  try {
    const nodeVersion = execSync('node -v').toString().trim();
    console.log(`${colors.bright}Node.js:${colors.reset} ${nodeVersion}`);
    
    // Comprobar si es Node.js 22.x
    if (nodeVersion.startsWith('v22')) {
      console.log(`${colors.green}✓ Versión de Node.js correcta${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠ Se recomienda usar Node.js 22.x. Actual: ${nodeVersion}${colors.reset}`);
    }
  } catch (error) {
    console.error(`${colors.red}✗ Error al verificar Node.js: ${error.message}${colors.reset}`);
  }

  // Verificar versión de npm
  try {
    const npmVersion = execSync('npm -v').toString().trim();
    console.log(`${colors.bright}npm:${colors.reset} ${npmVersion}`);
  } catch (error) {
    console.error(`${colors.red}✗ Error al verificar npm: ${error.message}${colors.reset}`);
  }

  // Verificar si npx está disponible
  try {
    execSync('npx --version');
    console.log(`${colors.green}✓ npx está disponible${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}✗ npx no está disponible: ${error.message}${colors.reset}`);
  }

  // Verificar Expo CLI
  try {
    execSync('npx expo --version');
    console.log(`${colors.green}✓ Expo CLI está disponible vía npx${colors.reset}`);
  } catch (error) {
    console.log(`${colors.yellow}⚠ Expo CLI no está disponible: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}→ No es un problema, ya que se usará 'npx expo' en su lugar${colors.reset}`);
  }

  console.log(`\n${colors.bright}${colors.green}Verificación completada. Si hay advertencias, revisa la documentación para resolverlas.${colors.reset}`);
  console.log(`${colors.bright}${colors.green}Para instalar todas las dependencias ejecuta: npm run install:clean${colors.reset}\n`);
  