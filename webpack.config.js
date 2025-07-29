const path = require('path');

module.exports = [
  {
    entry: './src/index.ts',
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'rwanda.umd.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'RwandaGeoStructure',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      libraryExport: 'default',
      globalObject: 'this',
    },
  },
  {
    entry: './src/index.ts',
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'rwanda.esm.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'module',
    },
    experiments: {
      outputModule: true,
    },
  },
];