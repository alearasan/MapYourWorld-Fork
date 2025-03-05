/**
 * Script para sincronizar las versiones de dependencias entre todos los package.json
 * y corregir problemas detectados por expo-doctor.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colores para la consola
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bright: '\x1b[1m',
  reset: '\x1b[0m'
};

/**
 * Ejecutar un comando en la terminal y devolver el resultado
 */
function runCommand(command, directory = '.') {
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      cwd: path.resolve(__dirname, directory) 
    });
    return { output: result, error: false };
  } catch (error) {
    return { 
      error: true, 
      stderr: error.stderr,
      stdout: error.stdout 
    };
  }
}

/**
 * Función principal que sincroniza todas las dependencias
 */
function sincronizarDependencias() {
  console.log(`\n${colors.bright}${colors.blue}===================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}     SINCRONIZACIÓN DE DEPENDENCIAS DEL PROYECTO     ${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}===================================================${colors.reset}\n`);
  
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
    
    // Versiones preferidas de las principales dependencias
    const dependenciesMap = {
      // Dependencias principales
      'react': '18.2.0',
      'react-dom': '18.2.0',
      'react-native': '0.73.2',
      'expo': '~52.0.0',
      '@expo/webpack-config': '^0.17.4',
      
      // Otras dependencias comunes
      'typescript': '5.1.6',
      'bcryptjs': '3.0.2',
      'jsonwebtoken': '9.0.2',
      'pg': '8.11.3',
      'typeorm': '0.3.17',
      'nodemailer': '6.9.7',
      'socket.io-client': '4.7.2',
      'axios': '1.6.2',
      'class-validator': '0.14.0',
      
      // Tipos
      '@types/react': '18.2.14',
      '@types/react-dom': '18.2.7',
      '@types/react-native': '~0.73.0',
      '@types/bcryptjs': '2.4.6',
      '@types/jsonwebtoken': '9.0.2',
      '@types/nodemailer': '6.4.13'
    };
    
    // Actualizar cada package.json encontrado
    for (const packagePath of packagePaths) {
      if (fs.existsSync(packagePath)) {
        const packageDir = path.dirname(packagePath);
        const relativePath = path.relative(__dirname, packagePath);
        console.log(`\n${colors.yellow}Procesando ${relativePath}...${colors.reset}`);
        
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
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
          
          packageJson.expo.doctor.reactNativeDirectoryCheck = {
            listUnknownPackages: false
          };
          
          console.log(`${colors.green}✓ Configuración de expo-doctor actualizada${colors.reset}`);
        }
        
        // Actualizar versiones de dependencias
        let dependenciesUpdated = false;
        let devDependenciesUpdated = false;
        
        if (packageJson.dependencies) {
          for (const [dep, version] of Object.entries(dependenciesMap)) {
            if (packageJson.dependencies[dep] && packageJson.dependencies[dep] !== version) {
              console.log(`${colors.yellow}→ Actualizando ${dep} de ${packageJson.dependencies[dep]} a ${version}${colors.reset}`);
              packageJson.dependencies[dep] = version;
              dependenciesUpdated = true;
            }
          }
        }
        
        if (packageJson.devDependencies) {
          for (const [dep, version] of Object.entries(dependenciesMap)) {
            if (packageJson.devDependencies[dep] && packageJson.devDependencies[dep] !== version) {
              console.log(`${colors.yellow}→ Actualizando ${dep} de ${packageJson.devDependencies[dep]} a ${version}${colors.reset}`);
              packageJson.devDependencies[dep] = version;
              devDependenciesUpdated = true;
            }
          }
        }
        
        // Guardar cambios si hubo actualizaciones
        if (dependenciesUpdated || devDependenciesUpdated || packagePath.includes('backend') || packagePath.includes('mobile')) {
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
    
    // Agregar configuración para expo-doctor en la raíz
    if (!rootPackageJson.expo) {
      rootPackageJson.expo = {};
    }
    
    if (!rootPackageJson.expo.doctor) {
      rootPackageJson.expo.doctor = {};
    }
    
    rootPackageJson.expo.doctor.reactNativeDirectoryCheck = {
      listUnknownPackages: false
    };
    
    fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackageJson, null, 2) + '\n');
    console.log(`\n${colors.green}✓ Package.json raíz actualizado con todas las resoluciones${colors.reset}`);
    
    // Regenerar package-lock.json
    console.log(`\n${colors.yellow}Regenerando package-lock.json...${colors.reset}`);
    
    // Eliminar package-lock.json existente
    const lockFilePath = path.join(__dirname, 'package-lock.json');
    if (fs.existsSync(lockFilePath)) {
      fs.unlinkSync(lockFilePath);
      console.log(`${colors.blue}→ Package-lock.json existente eliminado${colors.reset}`);
    }
    
    // Crear .npmrc temporal
    const npmrcPath = path.join(__dirname, '.npmrc');
    let originalNpmrcContent = '';
    
    if (fs.existsSync(npmrcPath)) {
      originalNpmrcContent = fs.readFileSync(npmrcPath, 'utf8');
    }
    
    // Configuración temporal para npm
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
    console.log(`${colors.blue}→ Configuración .npmrc temporal creada${colors.reset}`);
    
    try {
      // Ejecutar npm install para regenerar package-lock.json
      console.log(`\n${colors.yellow}Ejecutando npm install --package-lock-only...${colors.reset}`);
      const result = runCommand('npm install --package-lock-only');
      
      if (result.error) {
        console.log(`${colors.red}Error al regenerar package-lock.json: ${result.stderr}${colors.reset}`);
      } else {
        console.log(`${colors.green}✓ Package-lock.json regenerado correctamente${colors.reset}`);
      }
    } finally {
      // Restaurar .npmrc original
      if (originalNpmrcContent) {
        fs.writeFileSync(npmrcPath, originalNpmrcContent);
      } else {
        fs.unlinkSync(npmrcPath);
      }
      console.log(`${colors.blue}→ Configuración .npmrc original restaurada${colors.reset}`);
    }
    
    console.log(`\n${colors.bright}${colors.green}====================================================${colors.reset}`);
    console.log(`${colors.bright}${colors.green}  ¡PROCESO COMPLETADO!${colors.reset}`);
    console.log(`${colors.bright}${colors.green}====================================================${colors.reset}`);
    console.log(`\n${colors.cyan}Para completar la instalación, ejecuta:${colors.reset}`);
    console.log(`${colors.cyan}npm install${colors.reset}`);
    console.log(`\n${colors.yellow}Si encuentras algún problema, ejecuta:${colors.reset}`);
    console.log(`${colors.yellow}npm install --legacy-peer-deps${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}Error al sincronizar dependencias:${colors.reset} ${error.message}`);
  }
}

// Ejecutar el script
sincronizarDependencias(); 