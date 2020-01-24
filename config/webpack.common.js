const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: path.resolve(__dirname, '../src', 'app.tsx'),
  },
  output: {
    filename: 'app.[hash].js',
    path: path.resolve(__dirname, '../dist'),
  },
  devServer: {
    port: 3042,
    historyApiFallback: true,
    overlay: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: ['babel-loader', 'ts-loader'],
      },
      {
        test: /.*\.(gif|png|jp(e*)g|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 21000,
              name: 'src/images/[name]_[hash:7].[ext]',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, '../node_modules'),
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public', 'index.html'),
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
