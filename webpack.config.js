const path = require('path');

module.exports = {
  entry: './src/script.ts', // Use your TypeScript file here
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'], // Add .ts so Webpack knows to resolve TypeScript files
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // This rule tells Webpack how to process .ts files
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development',
};
