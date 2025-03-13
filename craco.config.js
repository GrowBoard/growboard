const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
      '@provider': path.resolve(__dirname, './src/provider'),
      '@components': path.resolve(__dirname, './src/components'),
      '@localization': path.resolve(__dirname, './src/localization'),
      '@router': path.resolve(__dirname, './src/router'),
      '@router/*': path.resolve(__dirname, './src/router/*'),
      '@screens': path.resolve(__dirname, './src/screens'),
      '@screens/*': path.resolve(__dirname, './src/screens/*'),
      '@services': path.resolve(__dirname, './src/services'),
      '@services/*': path.resolve(__dirname, './src/services/*'),
      '@service': path.resolve(__dirname, './src/service'),
      '@service/*': path.resolve(__dirname, './src/service/*'),
      '@store': path.resolve(__dirname, './src/store'),
      '@store/slice': path.resolve(__dirname, './src/store/slice'),
      '@selectors': path.resolve(__dirname, './src/store/selectors'),
    },
  },
};
