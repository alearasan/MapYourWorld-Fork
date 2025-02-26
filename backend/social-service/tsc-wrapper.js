// Script personalizado para manejar la compilación de TypeScript
const { spawn } = require('child_process');
const path = require('path');

console.log('Iniciando compilación personalizada del Servicio Social...');

// Ejecutar tsc con opciones específicas que ignoran el error de rootDir
const tsc = spawn('npx', ['tsc', 
  '--skipLibCheck',
  '--outDir', './dist',
  '--allowSyntheticDefaultImports', 
  '--esModuleInterop'
], {
  stdio: 'inherit',
  shell: true
});

tsc.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Compilación completada con éxito!');
  } else {
    console.error(`❌ Error en la compilación. Código: ${code}`);
    process.exit(code);
  }
}); 