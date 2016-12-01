// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

var projectPath = process.env.PROJECT
    ? path.resolve(process.env.PROJECT)
    : path.resolve(__dirname, '../../../webappnext');

console.log('  Project Path: ' + projectPath);

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(projectPath, 'resources/views/app/vue.blade.php'),
    template: path.resolve(projectPath, 'resources/views/app/vue.template.blade.php'),
    assetsRoot: path.resolve(projectPath, 'public'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'http://zero.institute.app/',
        changeOrigin: true,
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
};
