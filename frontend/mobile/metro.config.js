const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

// Encuentra el directorio raíz del proyecto (workspace)
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Configurar App.tsx como punto de entrada principal
config.resolver.sourceExts = ['tsx', 'ts', 'jsx', 'js', 'json'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// 1. Configuración para el resolver de Metro optimizada
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 2. Limitar los directorios vigilados para mejorar rendimiento
config.watchFolders = [
  path.resolve(projectRoot, 'src'),
  path.resolve(projectRoot, 'assets'),
  path.resolve(workspaceRoot, 'shared'),
];

// 3. Configuración de caché optimizada
config.cacheStores = [
  new (require('metro-cache').FileStore)({
    root: path.join(projectRoot, 'node_modules', '.cache', 'metro')
  })
];

// 4. Mejorar el manejo de assets
config.resolver.assetExts = [
  ...config.resolver.assetExts.filter(ext => !['svg'].includes(ext)),
  'pem', 'crt', 'db', 'json', 'md', 'sqlite'
];
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'cjs', 'mjs', 'json', 'svg'];

// 5. Optimizaciones para el transformer
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
  minifierPath: require.resolve('metro-minify-terser'),
  minifierConfig: {
    // Opciones de minificación para producción
    compress: { 
      drop_console: false, // Set true in production
      drop_debugger: true
    }
  },
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: true,
      inlineRequires: true,
    },
  }),
};

// 6. Optimizaciones para el resolver
config.resolver.disableHierarchicalLookup = true; // Evita búsquedas jerárquicas lentas
config.resolver.useWatchman = true; // Usa watchman si está disponible para mejor rendimiento

// 7. Configuración específica para react-native-reanimated y otros módulos críticos
config.resolver.extraNodeModules = {
  'react-native-reanimated': path.resolve(workspaceRoot, 'node_modules', 'react-native-reanimated'),
  '@': path.resolve(projectRoot, 'src'),
  '@components': path.resolve(projectRoot, 'src/components'),
  '@assets': path.resolve(projectRoot, 'src/assets'),
  '@screens': path.resolve(projectRoot, 'src/screens'),
  '@hooks': path.resolve(projectRoot, 'src/hooks'),
  '@services': path.resolve(projectRoot, 'src/services'),
  '@shared': path.resolve(workspaceRoot, 'shared'),
  '@frontend': path.resolve(workspaceRoot, 'frontend'),
  '@backend': path.resolve(workspaceRoot, 'backend'),
};

// 8. Aumentar tamaño de caché de Metro
config.maxWorkers = Math.max(2, require('os').cpus().length - 1);
config.resetCache = false;

module.exports = config; 