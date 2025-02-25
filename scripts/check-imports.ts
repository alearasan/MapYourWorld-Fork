/**
 * Script para verificar que todas las importaciones utilicen aliases correctos
 * Este script busca importaciones relativas que deberían usar aliases @backend, @frontend o @shared
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Configuración
const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');
const sharedDir = path.join(rootDir, 'shared');

interface PatternConfig {
  pattern: RegExp;
  message: string;
}

// Patrones para detectar importaciones incorrectas
const patterns: PatternConfig[] = [
  {
    // Importación directa utilizando rutas relativas con ../
    pattern: /import\s+.*from\s+['"]\.\./g,
    message: 'Importación relativa detectada. Usar aliases @backend, @frontend o @shared.'
  },
  {
    // Importación directa dentro de shared sin usar alias
    pattern: /import\s+.*from\s+['"]shared\//g,
    message: 'Importación directa a shared. Usar alias @shared.'
  },
  {
    // Importación directa dentro de backend sin usar alias
    pattern: /import\s+.*from\s+['"]backend\//g,
    message: 'Importación directa a backend. Usar alias @backend.'
  },
  {
    // Importación directa dentro de frontend sin usar alias
    pattern: /import\s+.*from\s+['"]frontend\//g,
    message: 'Importación directa a frontend. Usar alias @frontend.'
  }
];

// Extensiones de archivos a verificar
const fileExtensions = ['.ts', '.tsx', '.js', '.jsx'];

/**
 * Verifica si un archivo debe ser ignorado
 * @param filePath - Ruta del archivo
 * @returns true si el archivo debe ser ignorado
 */
function shouldIgnoreFile(filePath: string): boolean {
  const ignorePaths = [
    'node_modules',
    'dist',
    'build',
    '.git',
    'scripts/check-imports.js',
    'scripts/check-imports.ts'
  ];
  
  return ignorePaths.some(p => filePath.includes(p));
}

/**
 * Busca archivos a verificar
 * @param dir - Directorio a buscar
 * @param files - Array para almacenar los archivos encontrados
 */
function findFiles(dir: string, files: string[] = []): string[] {
  if (shouldIgnoreFile(dir)) return files;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (shouldIgnoreFile(fullPath)) continue;
    
    if (entry.isDirectory()) {
      findFiles(fullPath, files);
    } else if (entry.isFile() && fileExtensions.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Verifica importaciones incorrectas en un archivo
 * @param filePath - Ruta del archivo
 * @returns Problemas encontrados
 */
function checkFile(filePath: string): string[] {
  const issues: string[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(rootDir, filePath);
  
  for (const { pattern, message } of patterns) {
    const matches = content.match(pattern);
    if (matches) {
      issues.push(`${relativePath}: ${message} (${matches.length} ocurrencias)`);
    }
  }
  
  return issues;
}

/**
 * Función principal
 */
function main(): void {
  console.log('🔍 Verificando importaciones incorrectas...');
  
  // Encontrar todos los archivos
  const files = [
    ...findFiles(backendDir),
    ...findFiles(frontendDir),
    ...findFiles(sharedDir)
  ];
  
  console.log(`📁 Encontrados ${files.length} archivos para verificar.`);
  
  // Verificar cada archivo
  let totalIssues = 0;
  const allIssues: string[] = [];
  
  for (const file of files) {
    const issues = checkFile(file);
    totalIssues += issues.length;
    allIssues.push(...issues);
  }
  
  // Mostrar resultados
  if (totalIssues > 0) {
    console.log(`\n❌ Se encontraron ${totalIssues} problemas de importación:`);
    allIssues.forEach(issue => console.log(` - ${issue}`));
    console.log('\n⚠️ Por favor corrige las importaciones usando los aliases @backend, @frontend o @shared.');
    process.exit(1);
  } else {
    console.log('\n✅ No se encontraron problemas de importación. ¡Todo correcto!');
    process.exit(0);
  }
}

main(); 