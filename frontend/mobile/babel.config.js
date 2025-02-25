module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@hooks': './src/hooks',
            '@services': './src/services',
            '@utils': './src/utils',
            '@assets': './src/assets',
            '@navigation': './src/navigation',
            '@constants': './src/constants',
            '@contexts': './src/contexts'
          }
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
}; 