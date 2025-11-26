const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'warriorjs-web.js',
    library: {
      name: 'WarriorJS',
      type: 'umd',
    },
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
  ],
  resolve: {
    extensions: ['.js'],
    alias: {
      '@warriorjs/geography': path.resolve(__dirname, '../warriorjs-geography/lib'),
      '@warriorjs/helper-get-level-config': path.resolve(__dirname, '../warriorjs-helper-get-level-config/lib'),
      '@warriorjs/helper-get-level-score': path.resolve(__dirname, '../warriorjs-helper-get-level-score/lib'),
      '@warriorjs/helper-get-grade-letter': path.resolve(__dirname, '../warriorjs-helper-get-grade-letter/lib'),
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    hot: true,
    open: true,
  },
};
