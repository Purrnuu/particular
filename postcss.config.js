module.exports = {
  plugins: [
    require('postcss-import')({
      path: 'src',
    }),
    require('postcss-cssnext'),
    require('postcss-nested'),
    require('postcss-color-function'),
    require('postcss-units')({
      size: 16,
      fallback: false,
      precision: 2,
    }),
  ],
};
