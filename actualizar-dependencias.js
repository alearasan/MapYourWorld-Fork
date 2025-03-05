/**
 * Script para actualizar todas las dependencias de MapYourWorld 
 * para hacerlas compatibles con Node.js 22.14.0 LTS
 * 
 * Este script actualiza:
 * - Configuración de npm
 * - Dependencias principales
 * - Dependencias de frontend/web
 * - Dependencias de frontend/mobile con Expo
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Códigos de color para la salida
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// Verificación de la versión de Node.js
function checkNodeVersion() {
  const requiredVersion = '22.14.0';
  const currentVersion = process.version.slice(1); // Elimina el 'v' inicial
  
  console.log(`${colors.cyan}Versión de Node.js:${colors.reset} ${currentVersion}`);
  console.log(`${colors.cyan}Versión requerida:${colors.reset} ${requiredVersion}`);
  
  // Comprobar si la versión actual coincide con la requerida
  if (currentVersion !== requiredVersion) {
    console.log(`\n${colors.red}⚠ ¡ATENCIÓN! La versión de Node.js (${currentVersion}) no coincide con la requerida (${requiredVersion}).${colors.reset}`);
    console.log(`${colors.yellow}Se recomienda instalar Node.js 22.14.0 LTS para evitar problemas de compatibilidad.${colors.reset}`);
    console.log(`${colors.yellow}Puedes descargarla desde: https://nodejs.org/download/release/v22.14.0/${colors.reset}\n`);
    
    // Preguntar si desea continuar
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question(`${colors.bright}¿Desea continuar de todos modos? (s/N): ${colors.reset}`, (answer) => {
      readline.close();
      if (answer.toLowerCase() !== 's') {
        console.log(`${colors.red}Operación cancelada por el usuario.${colors.reset}`);
        process.exit(1);
      } else {
        console.log(`${colors.yellow}Continuando con la versión actual de Node.js...${colors.reset}\n`);
        startScript();
      }
    });
    return false;
  }
  
  console.log(`${colors.green}✓ Versión de Node.js correcta${colors.reset}\n`);
  return true;
}

// Función para ejecutar comandos shell de forma segura
function runCommand(command, directory = '.') {
  try {
    console.log(`${colors.cyan}Ejecutando:${colors.reset} ${command} ${colors.yellow}(en ${directory})${colors.reset}`);
    return execSync(command, { cwd: directory, stdio: 'inherit' });
  } catch (error) {
    console.error(`${colors.red}Error al ejecutar comando:${colors.reset} ${command}`);
    console.error(`${colors.red}${error.message}${colors.reset}`);
    return null;
  }
}

// Función para actualizar un archivo package.json
function updatePackageJson(packagePath, updates) {
  try {
    console.log(`${colors.cyan}Actualizando:${colors.reset} ${packagePath}`);
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Actualizar las dependencias
    ['dependencies', 'devDependencies', 'resolutions'].forEach(depType => {
      if (updates[depType] && packageJson[depType]) {
        Object.entries(updates[depType]).forEach(([pkg, version]) => {
          if (packageJson[depType][pkg]) {
            console.log(`${colors.green}→ Actualizando ${depType}/${pkg}:${colors.reset} ${packageJson[depType][pkg]} ${colors.bright}→${colors.reset} ${version}`);
            packageJson[depType][pkg] = version;
          }
        });
      }
    });

    // Agregar campos nuevos si existen en las actualizaciones
    Object.entries(updates).forEach(([key, value]) => {
      if (!['dependencies', 'devDependencies', 'resolutions'].includes(key) && value !== undefined) {
        packageJson[key] = value;
      }
    });

    // Guardar el archivo actualizado
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`${colors.green}✓ Archivo actualizado:${colors.reset} ${packagePath}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error al actualizar ${packagePath}:${colors.reset} ${error.message}`);
    return false;
  }
}

// Función para crear o sobrescribir un archivo
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content);
    console.log(`${colors.green}✓ Archivo creado/actualizado:${colors.reset} ${filePath}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error al escribir ${filePath}:${colors.reset} ${error.message}`);
    return false;
  }
}

/**
 * Sincroniza las versiones de dependencias entre todos los archivos package.json
 * y corrige los problemas detectados por expo-doctor
 */
function sincronizarDependencias() {
  console.log(`\n${colors.bright}${colors.blue}SINCRONIZANDO DEPENDENCIAS EN TODOS LOS PACKAGE.JSON${colors.reset}\n`);
  
  try {
    // Leer el package.json raíz
    const rootPackagePath = path.join(__dirname, 'package.json');
    const rootPackageJson = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
    
    // Corregir el problema de "mapyourworld-backend" detectado por expo-doctor
    if (rootPackageJson.dependencies && rootPackageJson.dependencies['mapyourworld-backend']) {
      delete rootPackageJson.dependencies['mapyourworld-backend'];
      console.log(`${colors.green}✓ Eliminada dependencia circular 'mapyourworld-backend' del package.json raíz${colors.reset}`);
    }
    
    // Lista de ubicaciones de package.json en el proyecto
    const packagePaths = [
      path.join(__dirname, 'frontend', 'package.json'),
      path.join(__dirname, 'frontend', 'mobile', 'package.json'),
      path.join(__dirname, 'frontend', 'web', 'package.json'),
      path.join(__dirname, 'backend', 'package.json')
    ];
    
    // Dependencias específicas para el frontend/mobile
    const mobileDependenciesMap = {
      // Dependencias principales
      'react': '18.3.1',
      'react-dom': '18.3.1',
      'react-native': '0.76.7',
      'expo': '~52.0.37',
      '@expo/webpack-config': '^0.17.4',
      '@react-native-async-storage/async-storage': '1.23.1',
      'react-native-svg': '15.8.0',
      'react-native-gesture-handler': '~2.24.0',
      'react-native-reanimated': '~3.17.1',
      'lottie-react-native': '7.1.0',
      'axios': '1.8.1',
      'tailwindcss': '3.3.2',
      'nativewind': '2.0.11',
      
      // Componentes de navegación
      '@react-navigation/native': '6.1.9',
      '@react-navigation/native-stack': '6.9.17',
      '@react-navigation/stack': '^7.1.2',
      '@react-navigation/bottom-tabs': '^7.2.1',
      'react-native-safe-area-context': '5.3.0',
      'react-native-screens': '~4.9.1',
      
      // Mapas y localización
      'react-native-maps': '1.20.1',
      'expo-location': '~18.0.7',
      'leaflet': '^1.9.4',
      'react-leaflet': '5.0.0',
      
      // Gestión de estados y API
      '@tanstack/react-query': '5.67.1',
      'jwt-decode': '4.0.0',
      'jose': '^6.0.8',
      'native-notify': '^4.0.9',
      
      // UI y estilos
      '@mui/material': '^6.4.6',
      '@mui/icons-material': '^6.4.6',
      '@emotion/react': '^11.14.0',
      '@emotion/styled': '^11.14.0',
      'styled-components': '6.1.15',
      'react-native-vector-icons': '10.2.0',
      'react-icons': '5.5.0',
      
      // Utilidades
      'expo-image-picker': '~16.0.6',
      'expo-camera': '~16.0.17',
      'expo-file-system': '~18.0.11',
      'expo-media-library': '~17.0.6',
      'expo-constants': '~17.0.7',
      'expo-device': '~7.0.2',
      'expo-splash-screen': '~0.29.22',
      'expo-status-bar': '~2.0.1',
      'expo-auth-session': '~6.0.3',
      'expo-image-manipulator': '~13.0.6',
      'formik': '^2.4.6',
      'yup': '^1.6.1',
      'moment': '^2.30.1',
      'date-fns': '^4.1.0',
      'chart.js': '4.4.8',
      'react-chartjs-2': '5.3.0',
      'lightningcss': '1.29.1',
      'react-router-dom': '^7.2.0',
      '@expo/metro-runtime': '~4.0.1',
      'react-native-web': '~0.19.13',
      
      // Tipos
      '@types/react': '~18.3.12',
      '@types/react-dom': '~18.3.1',
      '@types/react-native-vector-icons': '6.4.18',
      '@types/leaflet': '^1.9.16',
      'typescript': '5.8.2'
    };
    
    // DevDependencies específicas para el frontend/mobile
    const mobileDevDependenciesMap = {
      '@babel/core': '^7.26.9',
      '@babel/plugin-transform-runtime': '7.26.9',
      '@testing-library/react': '16.2.0',
      '@testing-library/react-native': '^13.1.0',
      '@types/node': '22.13.9',
      '@typescript-eslint/eslint-plugin': '^8.26.0',
      '@typescript-eslint/parser': '^8.26.0',
      'autoprefixer': '^10.4.20',
      'babel-loader': '^10.0.0',
      'babel-plugin-module-resolver': '^5.0.2',
      'babel-preset-expo': '12.0.9',
      'buffer': '^6.0.3',
      'chalk': '^5.4.1',
      'cross-env': '7.0.3',
      'crypto-browserify': '^3.12.1',
      'css-loader': '^7.1.2',
      'file-loader': '^6.2.0',
      'html-webpack-plugin': '^5.6.3',
      'jest': '^29.7.0',
      'jest-expo': '^52.0.5',
      'os-browserify': '^0.3.0',
      'path-browserify': '^1.0.1',
      'postcss': '^8.5.3',
      'react-native-svg-transformer': '1.5.0',
      'react-test-renderer': '18.3.1',
      'stream-browserify': '^3.0.0',
      'style-loader': '^4.0.0',
      'terser-webpack-plugin': '5.3.12',
      'ts-jest': '^29.2.6',
      'ts-node': '^10.9.2',
      'webpack': '^5.98.0',
      'webpack-cli': '^6.0.1',
      'webpack-dev-server': '5.2.0'
    };
    
    // Dependencias específicas para el backend
    const backendDependenciesMap = {
      'typescript': '5.8.2',
      'bcryptjs': '3.0.2',
      'jsonwebtoken': '9.0.2',
      'pg': '8.13.3',
      'pg-promise': '11.10.2',
      'typeorm': '0.3.21',
      'nodemailer': '6.10.0',
      'socket.io-client': '3.0.0',
      'socket.io': '3.0.0',
      'axios': '1.8.1',
      'class-validator': '0.14.1',
      
      // Tipos
      '@types/bcryptjs': '2.4.6',
      '@types/jsonwebtoken': '9.0.9',
      '@types/nodemailer': '6.4.17'
    };
    
    // Actualizar cada package.json encontrado
    for (const packagePath of packagePaths) {
      if (fs.existsSync(packagePath)) {
        const packageDir = path.dirname(packagePath);
        const relativePath = path.relative(__dirname, packagePath);
        console.log(`\n${colors.yellow}Procesando ${relativePath}...${colors.reset}`);
        
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        // Utilizar el mapa de dependencias específico según el tipo de package.json
        let dependenciesMap = {};
        let devDependenciesMap = {};
        
        if (packagePath.includes('mobile')) {
          dependenciesMap = mobileDependenciesMap;
          devDependenciesMap = mobileDevDependenciesMap;
          console.log(`${colors.blue}Usando mapa de dependencias para frontend/mobile${colors.reset}`);
        } else if (packagePath.includes('backend')) {
          dependenciesMap = backendDependenciesMap;
          console.log(`${colors.blue}Usando mapa de dependencias para backend${colors.reset}`);
        } else {
          // Para otros package.json, usar un conjunto común de dependencias
          dependenciesMap = {
            'typescript': '5.8.2',
            'react': '18.3.1',
            'react-dom': '18.3.1'
          };
          console.log(`${colors.blue}Usando mapa de dependencias común${colors.reset}`);
        }
        
        // Corregir problemas con el nombre del paquete en backend/package.json
        if (packagePath.includes('backend') && packageJson.name === 'mapyourworld-backend') {
          packageJson.name = 'mapyourworld-backend-services';
          console.log(`${colors.green}✓ Nombre del paquete backend cambiado para evitar conflictos${colors.reset}`);
          
          // Eliminar la dependencia circular
          if (packageJson.dependencies && packageJson.dependencies['mapyourworld-backend']) {
            delete packageJson.dependencies['mapyourworld-backend'];
            console.log(`${colors.green}✓ Eliminada dependencia circular${colors.reset}`);
          }
        }
        
        // Corregir configuración para expo-doctor en el proyecto mobile
        if (packagePath.includes('mobile')) {
          if (!packageJson.expo) {
            packageJson.expo = {};
          }
          
          if (!packageJson.expo.doctor) {
            packageJson.expo.doctor = {};
          }
          
          // Actualizar la configuración para desactivar la advertencia de paquetes desconocidos
          packageJson.expo.doctor.reactNativeDirectoryCheck = {
            listUnknownPackages: false,
            exclude: [
              "react-native-maps",
              "jwt-decode"
            ]
          };
          
          console.log(`${colors.green}✓ Configuración de expo-doctor actualizada${colors.reset}`);
        }
        
        // Actualizar dependencias y devDependencies
        if (packageJson.dependencies) {
          for (const [dep, version] of Object.entries(dependenciesMap)) {
            if (packageJson.dependencies[dep] && packageJson.dependencies[dep] !== version) {
              console.log(`${colors.yellow}→ Actualizando ${dep} de ${packageJson.dependencies[dep]} a ${version}${colors.reset}`);
              packageJson.dependencies[dep] = version;
            }
          }
        }
        
        if (packageJson.devDependencies) {
          // Usar el mapa de devDependencies si está disponible, o usar dependenciesMap como fallback
          const mapToUse = packagePath.includes('mobile') ? devDependenciesMap : {};
          
          for (const [dep, version] of Object.entries(mapToUse)) {
            if (packageJson.devDependencies[dep] && packageJson.devDependencies[dep] !== version) {
              console.log(`${colors.yellow}→ Actualizando devDependencies/${dep} de ${packageJson.devDependencies[dep]} a ${version}${colors.reset}`);
              packageJson.devDependencies[dep] = version;
            }
          }
        }
        
        // Guardar cambios si hubo actualizaciones
        if (packagePath.includes('backend') || packagePath.includes('mobile')) {
          fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
          console.log(`${colors.green}✓ ${relativePath} actualizado${colors.reset}`);
        } else {
          console.log(`${colors.blue}→ No se requieren cambios en ${relativePath}${colors.reset}`);
        }
      }
    }
    
    // Actualizar el package.json raíz con las versiones alineadas
    rootPackageJson.resolutions = {
      ...rootPackageJson.resolutions,
      ...dependenciesMap
    };
    
    rootPackageJson.overrides = {
      ...rootPackageJson.overrides,
      ...dependenciesMap
    };
    
    fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackageJson, null, 2) + '\n');
    console.log(`\n${colors.green}✓ Package.json raíz actualizado con todas las resoluciones${colors.reset}`);
    
    console.log(`\n${colors.bright}${colors.green}Dependencias sincronizadas correctamente${colors.reset}`);
    console.log(`${colors.yellow}A continuación, ejecuta la opción 3 para regenerar el package-lock.json${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}Error al sincronizar dependencias:${colors.reset} ${error.message}`);
  }
}

// Función principal que contiene la lógica del script
function startScript() {
  try {
    // Mostrar cabecera
    console.log(`\n${colors.bright}${colors.blue}===================================================${colors.reset}`);
    console.log(`${colors.bright}${colors.blue}     SCRIPT DE ACTUALIZACIÓN DE DEPENDENCIAS     ${colors.reset}`);
    console.log(`${colors.bright}${colors.blue}===================================================${colors.reset}\n`);
    
    // Verificar versión de Node.js
    checkNodeVersion();
    
    // Mostrar opciones al usuario
    console.log(`Seleccione una opción:`);
    console.log(`1. Actualizar dependencias e instalar automáticamente`);
    console.log(`2. Limpiar caché y eliminar node_modules (para instalación manual)`);
    console.log(`3. Solo regenerar package-lock.json (mantener node_modules)`);
    console.log(`4. Sincronizar versiones de dependencias entre todos los package.json`);
    console.log(`\n`);
    
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question(`Opción (1/2/3/4): `, (option) => {
      readline.close();
      
      switch (option.trim()) {
        case '1':
          // Ejecutar actualización e instalación
          ejecutarActualizacion();
          break;
        case '2':
          // Limpiar caché y node_modules
          cleanNodeCache();
          break;
        case '3':
          // Solo regenerar package-lock.json
          regenerarLockFile();
          break;
        case '4':
          // Sincronizar dependencias entre package.json
          sincronizarDependencias();
          break;
        default:
          console.log(`${colors.red}Opción no válida. Por favor seleccione 1, 2, 3 o 4.${colors.reset}`);
          break;
      }
    });
  } catch (error) {
    console.error(`${colors.red}Error al iniciar el script:${colors.reset} ${error.message}`);
  }
}

// Función para limpiar la caché y los directorios node_modules
function cleanNodeCache() {
  console.log(`\n${colors.bright}${colors.magenta}LIMPIANDO CACHÉ DE NPM${colors.reset}\n`);
  
  // Definir directorios para limpiar
  const rootDir = __dirname;
  const directoriesToClean = [
    rootDir,
    path.join(rootDir, 'frontend'),
    path.join(rootDir, 'frontend/web'),
    path.join(rootDir, 'frontend/mobile'),
    path.join(rootDir, 'backend'),
    path.join(rootDir, 'backend/api-gateway'),
    path.join(rootDir, 'backend/auth-service'),
    path.join(rootDir, 'backend/map-service'),
    path.join(rootDir, 'backend/notification-service'),
    path.join(rootDir, 'backend/social-service'),
    path.join(rootDir, 'backend/user-service'),
    path.join(rootDir, 'shared')
  ];
  
  // Limpiar la caché de npm - desactivando temporalmente workspaces
  console.log(`${colors.yellow}Limpiando caché de npm...${colors.reset}`);
  
  // Crear un .npmrc temporal que deshabilite los workspaces
  const tempNpmrcPath = path.join(rootDir, '.npmrc.temp');
  const originalNpmrcPath = path.join(rootDir, '.npmrc');
  let originalNpmrcContent = '';
  
  try {
    // Guardar contenido original de .npmrc
    if (fs.existsSync(originalNpmrcPath)) {
      originalNpmrcContent = fs.readFileSync(originalNpmrcPath, 'utf8');
    }
    
    // Crear .npmrc temporal sin workspaces
    fs.writeFileSync(tempNpmrcPath, 'workspaces=false\n');
    
    // Mover el .npmrc temporal
    if (fs.existsSync(originalNpmrcPath)) {
      fs.renameSync(originalNpmrcPath, `${originalNpmrcPath}.bak`);
    }
    fs.renameSync(tempNpmrcPath, originalNpmrcPath);
    
    // Ejecutar la limpieza de caché
    execSync('npm cache clean --force', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Caché de npm limpiada correctamente${colors.reset}`);
    
    // Restaurar el .npmrc original
    fs.unlinkSync(originalNpmrcPath);
    if (fs.existsSync(`${originalNpmrcPath}.bak`)) {
      fs.renameSync(`${originalNpmrcPath}.bak`, originalNpmrcPath);
    } else if (originalNpmrcContent) {
      fs.writeFileSync(originalNpmrcPath, originalNpmrcContent);
    }
  } catch (error) {
    // Asegurarse de restaurar el .npmrc original en caso de error
    if (fs.existsSync(`${originalNpmrcPath}.bak`)) {
      if (fs.existsSync(originalNpmrcPath)) {
        fs.unlinkSync(originalNpmrcPath);
      }
      fs.renameSync(`${originalNpmrcPath}.bak`, originalNpmrcPath);
    }
    console.error(`${colors.red}Error al limpiar la caché de npm:${colors.reset} ${error.message}`);
  }
  
  // Limpiar solo node_modules si el usuario lo desea
  console.log(`\n${colors.yellow}¿Deseas eliminar también los directorios node_modules?${colors.reset}`);
  console.log(`${colors.yellow}Esto puede ser útil para una instalación totalmente limpia.${colors.reset}`);
  
  const readlineModules = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readlineModules.question(`\n${colors.bright}¿Eliminar node_modules? (s/N): ${colors.reset}`, (answer) => {
    readlineModules.close();
    
    if (answer.toLowerCase() === 's') {
      console.log(`${colors.yellow}Eliminando directorios node_modules...${colors.reset}`);
      
      for (const dir of directoriesToClean) {
        const nodeModulesPath = path.join(dir, 'node_modules');
        
        // Eliminar node_modules
        if (fs.existsSync(nodeModulesPath)) {
          try {
            if (process.platform === 'win32') {
              // En Windows, usar el comando rd para eliminar directorios
              execSync(`rd /s /q "${nodeModulesPath}"`, { stdio: 'ignore' });
            } else {
              // En Unix/Linux, usar rm -rf
              execSync(`rm -rf "${nodeModulesPath}"`, { stdio: 'ignore' });
            }
            console.log(`${colors.green}✓ Eliminado:${colors.reset} ${nodeModulesPath}`);
          } catch (error) {
            console.error(`${colors.red}Error al eliminar ${nodeModulesPath}:${colors.reset} ${error.message}`);
          }
        }
      }
      
      finalizarLimpieza();
    } else {
      finalizarLimpieza();
    }
  });
}

// Función auxiliar para finalizar el proceso de limpieza
function finalizarLimpieza() {
  console.log(`\n${colors.green}✓ Limpieza completada${colors.reset}`);
  console.log(`\n${colors.bright}Para instalar los paquetes:${colors.reset}`);
  console.log(`1. ${colors.cyan}node actualizar-dependencias.js${colors.reset} - Selecciona la opción 3 para regenerar el package-lock.json`);
  console.log(`2. ${colors.cyan}npm install${colors.reset} - Para instalar todas las dependencias\n`);
  console.log(`${colors.yellow}Si encuentras errores con npm install, intenta:${colors.reset}`);
  console.log(`${colors.cyan}npm install --legacy-peer-deps${colors.reset}\n`);
  console.log(`${colors.bright}${colors.blue}====================================================${colors.reset}\n`);
}

// Función para regenerar el package-lock.json y corregir los conflictos de dependencias
function regenerarLockFile() {
  console.log(`${colors.blue}Iniciando regeneración del package-lock.json...${colors.reset}`);
  
  // 1. Corregir conflictos en package.json
  const mobilePackagePath = path.join(__dirname, 'frontend', 'mobile', 'package.json');
  
  if (!fs.existsSync(mobilePackagePath)) {
    console.log(`${colors.red}Error: No se encontró el archivo package.json del proyecto móvil${colors.reset}`);
    return;
  }
  
  // Leer package.json del proyecto móvil
  const mobilePackageJson = JSON.parse(fs.readFileSync(mobilePackagePath, 'utf8'));
  
  // Verificar y ajustar la versión de @expo/webpack-config
  if (mobilePackageJson.dependencies && mobilePackageJson.dependencies.expo) {
    const expoVersion = mobilePackageJson.dependencies.expo;
    console.log(`${colors.yellow}Detectada versión de Expo: ${expoVersion}${colors.reset}`);
    
    // Para Expo SDK 52, necesitamos una versión específica de @expo/webpack-config
    if (expoVersion.includes('52')) {
      if (mobilePackageJson.dependencies['@expo/webpack-config'] !== '^0.17.4') {
        console.log(`${colors.yellow}Actualizando @expo/webpack-config a ^0.17.4 para compatibilidad con Expo SDK 52${colors.reset}`);
        mobilePackageJson.dependencies['@expo/webpack-config'] = '^0.17.4';
      }
      
      // Guardar cambios en el proyecto móvil
      fs.writeFileSync(mobilePackagePath, JSON.stringify(mobilePackageJson, null, 2) + '\n');
      console.log(`${colors.green}✓ package.json del proyecto móvil actualizado${colors.reset}`);
      
      // Crear webpack.config.js personalizado si no existe
      const webpackConfigPath = path.join(__dirname, 'frontend', 'mobile', 'webpack.config.js');
      if (!fs.existsSync(webpackConfigPath)) {
        console.log(`${colors.yellow}Creando webpack.config.js personalizado para Expo SDK 52${colors.reset}`);
        const webpackConfig = `const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      // Deshabilitar la validación de peer dependencies para evitar errores
      disablePeerDependencyValidation: true,
    },
    argv
  );

  // Configuraciones adicionales para Expo SDK 52
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      'react-native': 'react-native-web',
      'react-native/Libraries/Components/View/ViewStylePropTypes': 'react-native-web/dist/exports/View/ViewStylePropTypes',
      'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter': 'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
    },
    extensions: ['.web.js', '.js', '.ts', '.tsx', '.web.tsx', '.web.ts', '.mjs', '.json'],
  };

  return config;
};`;
        fs.writeFileSync(webpackConfigPath, webpackConfig);
        console.log(`${colors.green}✓ webpack.config.js creado${colors.reset}`);
      }
    }
  }
  
  // Actualizar el package.json de la raíz
  const rootPackagePath = path.join(__dirname, 'package.json');
  if (fs.existsSync(rootPackagePath)) {
    const rootPackageJson = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
    
    // Obtener la versión de Expo del proyecto móvil
    const expoVersion = mobilePackageJson.dependencies.expo;
    
    // Agregar resoluciones para mantener consistencia
    rootPackageJson.resolutions = {
      ...rootPackageJson.resolutions,
      'react': '18.3.1',
      'react-dom': '18.3.1',
      'react-native': '0.76.7',
      'expo': expoVersion,
      'react-native-svg': '15.8.0',
      'react-test-renderer': '18.3.1',
      '@types/react': '~18.3.12',
      '@types/react-dom': '~18.3.1',
      'lottie-react-native': '7.1.0'
    };
    
    // Agregar overrides para npm (equivalente a resolutions en Yarn)
    rootPackageJson.overrides = {
      ...rootPackageJson.overrides,
      'react': '18.3.1',
      'react-dom': '18.3.1',
      'react-native': '0.76.7',
      'expo': expoVersion,
      'react-native-svg': '15.8.0',
      'react-test-renderer': '18.3.1',
      '@types/react': '~18.3.12',
      '@types/react-dom': '~18.3.1',
      'lottie-react-native': '7.1.0'
    };
    
    // Guardar cambios en raíz
    fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackageJson, null, 2) + '\n');
    console.log(`${colors.green}✓ package.json raíz actualizado${colors.reset}`);
  }
  
  // 2. Verificar si existe package-lock.json y eliminarlo para regenerar
  const lockFilePath = path.join(__dirname, 'package-lock.json');
  if (fs.existsSync(lockFilePath)) {
    fs.unlinkSync(lockFilePath);
    console.log(`${colors.yellow}Eliminado package-lock.json existente para regenerarlo${colors.reset}`);
  }
  
  // 3. Crear archivo .npmrc temporal para esta operación
  const npmrcPath = path.join(__dirname, '.npmrc');
  let originalNpmrcContent = '';
  
  if (fs.existsSync(npmrcPath)) {
    originalNpmrcContent = fs.readFileSync(npmrcPath, 'utf8');
  }
  
  // Crear .npmrc temporal optimizado para generar package-lock sin workspaces
  const tempNpmrcContent = `
# Configuración temporal para generar package-lock.json
workspaces=false
engine-strict=false
save-exact=true
fund=false
audit=false
loglevel=error
package-lock=true
legacy-peer-deps=true
`;
  
  fs.writeFileSync(npmrcPath, tempNpmrcContent);
  console.log(`${colors.yellow}Configuración temporal de .npmrc creada${colors.reset}`);
  
  try {
    // 4. Ejecutar npm install con opciones específicas para generar package-lock.json
    console.log(`${colors.blue}Ejecutando npm install --package-lock-only...${colors.reset}`);
    const result = runCommand('npm install --package-lock-only');
    
    if (result.error) {
      console.log(`${colors.red}Error al regenerar package-lock.json: ${result.stderr}${colors.reset}`);
    } else {
      console.log(`${colors.green}✓ package-lock.json regenerado correctamente${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}Error al regenerar package-lock.json: ${error.message}${colors.reset}`);
  } finally {
    // 5. Restaurar .npmrc original
    if (originalNpmrcContent) {
      fs.writeFileSync(npmrcPath, originalNpmrcContent);
    } else {
      fs.unlinkSync(npmrcPath);
    }
    console.log(`${colors.green}✓ Configuración original de .npmrc restaurada${colors.reset}`);
  }
  
  console.log(`\n${colors.green}=== Proceso de regeneración completado ====${colors.reset}`);
  console.log(`${colors.yellow}Ahora puedes ejecutar: npm install${colors.reset}`);
  console.log(`${colors.yellow}Si sigues teniendo problemas, prueba: npm install --legacy-peer-deps${colors.reset}`);
}

// Inicio del script
console.log(`\n${colors.bright}${colors.blue}====================================================${colors.reset}`);
console.log(`${colors.bright}${colors.blue}  ACTUALIZANDO DEPENDENCIAS PARA NODE.JS 22.14.0 LTS  ${colors.reset}`);
console.log(`${colors.bright}${colors.blue}====================================================${colors.reset}\n`);

// Ejecutar el script
startScript(); 