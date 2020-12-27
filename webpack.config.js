
const path = require('path');

const packageDir = path.resolve(__dirname);

module.exports = {
  entry: './src/examples.ts',
  mode: 'development',
  output: {
    filename: 'examples.bundle.js',
    path: packageDir,
  },
  devServer: {
    host: '0.0.0.0',
    historyApiFallback: true,
  },
  devtool: 'eval-cheap-module-source-map',
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@emotion/babel-plugin',
            ],
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }
      }
    ]
  }
};

