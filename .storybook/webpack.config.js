const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = function({ config }) {
  config.resolve.extensions = [...config.resolve.extensions, '.ts', '.tsx'];

  config.resolve.modules = [
    ...config.resolve.modules,
    path.resolve(__dirname, '../src'),
    '../node_modules',
  ];

  config.module.rules = [
    // exclude .css and .svg loaders to provide our own
    ...config.module.rules.filter(
      rule => rule.test.toString() !== /\.css$/.toString() && !rule.test.toString().includes('svg')
    ),
    {
      enforce: 'pre',
      test: /\.(jsx?|tsx?)$/,
      use: 'eslint-loader?{emitWarning: true}',
      include: path.resolve(__dirname, '../src'),
    },
    {
      test: /\.(jsx?|tsx?)$/,
      use: [{ loader: 'babel-loader', options: { cacheDirectory: true } }],
      exclude: /node_modules/,
    },
    {
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]',
          },
        },
        { loader: 'postcss-loader' },
      ],
      exclude: /node_modules/,
    },
    {
      test: /\.css$/,
      use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      include: /node_modules/,
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: 'file-loader?name=images/[name].[ext]',
      include: /node_modules/,
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: 'url-loader?limit=4096&name=images/[name].[hash].[ext]',
      include: /icons/,
    },
    {
      test: /\.svg$/,
      include: [path.resolve(__dirname, '../src/icons')],
      use: [
        'babel-loader',
        {
          loader: 'react-svg-loader',
          query: {
            svgo: { plugins: [{ removeTitle: false }], floatPrecision: 2 },
          },
        },
      ],
    },
  ];

  config.plugins = [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    }),
    ...config.plugins,
  ];

  return config;
};
