const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    sourceMapFilename: 'index.map',
    library: 'Particular',
    libraryTarget: 'commonjs',
  },
  externals: {
    classnames: 'classnames',
    react: 'react',
    'react-dom': 'react-dom',
    'react-motion': 'react-motion',
    ramda: 'ramda',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        use: 'eslint-loader',
        exclude: /node_modules/,
      },
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: 'tslint-loader?{emitWarning: true}',
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            { loader: 'postcss-loader' },
          ],
        }),
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
        include: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif)$/,
        include: /icons|components/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: /icons|components/,
        loaders: [
          'babel-loader',
          {
            loader: 'react-svg-loader',
            query: {
              svgo: { plugins: [{ removeTitle: false }], floatPrecision: 2 },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: './icons',
        to: 'icons',
      },
    ]),
    new ExtractTextPlugin('styles.css'),
  ],
};
