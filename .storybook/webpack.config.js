const path = require('path');

// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add addional webpack configurations.
// For more information refer the docs: https://getstorybook.io/docs/configurations/custom-webpack-config

module.exports = function(storybookBaseConfig, configType) {
  storybookBaseConfig.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];

  storybookBaseConfig.resolve.modules = [
    ...storybookBaseConfig.resolve.modules,
    path.resolve(__dirname, '../src'),
  ];

  storybookBaseConfig.module.rules = [
    ...storybookBaseConfig.module.rules,
    {
      enforce: 'pre',
      test: /\.jsx?$/,
      use: 'eslint-loader?{emitWarning: true}',
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
      test: /\.css$/,
      loader: [
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
      loader: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      include: /node_modules/,
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      include: /node_modules/,
      loader: 'file-loader?name=images/[name].[ext]',
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      include: /icons/,
      loader: 'url-loader?limit=4096&name=images/[name].[ext]',
    },
    {
      test: /\.svg$/,
      include: /icons|components/,
      loader:
        'babel-loader!react-svg-loader?' +
        JSON.stringify({
          svgo: { plugins: [{ removeTitle: false }], floatPrecision: 2 },
        }),
    },
  ];

  return storybookBaseConfig;
};
