/**
 * Script para verificar la compatibilidad de las versiones de paquetes
 * Este script se ejecuta después de npm install
 */

import * as fs from 'fs';
import * as path from 'path';

console.log('📋 Verificando compatibilidad de versiones...');

// Versiones requeridas para compatibilidad
const REQUIRED_VERSIONS: Record<string, string> = {
  // React y React Native
  'react': '18.2.0', // Versión específica requerida por React Native
  'react-dom': '18.2.0',
  '@types/react': '18.2.48',
  
  // Otros paquetes importantes
  'react-native': '0.73.2',
  '@react-native-async-storage/async-storage': '1.21.0',
  '@tanstack/react-query': '4.36.1'
};

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

let hasErrors = false;

// Verificar versiones en package.json
function checkPackageVersions(packagePath: string): void {
  try {
    if (!fs.existsSync(packagePath)) {
      return;
    }
    
    const packageRaw = fs.readFileSync(packagePath, 'utf8');
    const packageJson: PackageJson = JSON.parse(packageRaw);
    
    const deps: Record<string, string> = { 
      ...packageJson.dependencies, 
      ...packageJson.devDependencies 
    };
    
    for (const [pkg, version] of Object.entries(deps)) {
      // Solo verificamos los paquetes críticos definidos arriba
      if (REQUIRED_VERSIONS[pkg]) {
        const requiredVersion = REQUIRED_VERSIONS[pkg];
        // Eliminar ^ o ~ del comienzo de la versión
        const cleanVersion = version.replace(/[\^~]/, '');
        
        if (cleanVersion !== requiredVersion) {
          console.error(`⚠️ ERROR en ${packagePath}: ${pkg} versión ${version}, pero se requiere exactamente ${requiredVersion}`);
          hasErrors = true;
        }
      }
    }
  } catch (error) {
    console.error(`Error al revisar ${packagePath}:`, error instanceof Error ? error.message : String(error));
  }
}

// Lista de package.json a verificar
const rootDir = path.resolve(__dirname, '..');
const packagesToCheck: string[] = [
  path.join(rootDir, 'package.json'),
  path.join(rootDir, 'frontend', 'package.json'),
  path.join(rootDir, 'frontend', 'web', 'package.json'),
  path.join(rootDir, 'frontend', 'mobile', 'package.json'),
  path.join(rootDir, 'backend', 'package.json')
];

// Verificar cada package.json
packagesToCheck.forEach(pkg => checkPackageVersions(pkg));

if (hasErrors) {
  console.error('\n⚠️ Se encontraron inconsistencias en las versiones de algunos paquetes.');
  console.error('Por favor, asegúrate de que todos los paquetes críticos tengan las mismas versiones en todos los package.json.');
  console.error('Puedes usar "npm run clean" seguido de "npm install" para reinstalar todo con las versiones correctas.');
} else {
  console.log('✅ Todas las versiones de paquetes son compatibles.');
}

// No terminamos el proceso con error para no interrumpir el flujo de instalación
process.exit(0); 