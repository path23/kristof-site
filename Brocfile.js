var compileSass = require('broccoli-sass');
var mergeTrees = require('broccoli-merge-trees');
var funnel = require('broccoli-funnel');
var compileSass = require('broccoli-sass');
var autoprefixer = require('broccoli-autoprefixer');
var injectLivereload = require('broccoli-inject-livereload');
var concat = require('broccoli-concat');
var livereload = require('livereload');
var env = require('broccoli-env').getEnv();
var cleanCss = require('broccoli-clean-css');
var htmlMin = require('broccoli-htmlmin');
var assetRev = require('broccoli-asset-rev');
var uglify = require('broccoli-uglify-js');
var imageMin = require('broccoli-imagemin');

// Start up live reload.
var server = livereload.createServer();
server.watch(__dirname + "/tmp");

var html = funnel('app', {
  files   : ['index.html', 'CNAME'],
  destDir : '/'
});

if (env !== 'production') {
  html = injectLivereload(html);
}

html = htmlMin(html);
// 
// var jstree = funnel('app/js', {
//   destDir: '/assets/'
// });

var jstree = concat('app', {
  inputFiles : ['**/*.js'],
  outputFile : '/assets/app.js'
});

if (env === 'production') {
  jstree = uglify(jstree, {compress: true, mangle: false});
}

var publicFiles = funnel('public', {
  destDir: '/'
});

var css = compileSass(['app/styles'], 'app.scss', 'assets/styles.css', {sourceMap: true, outputStyle: 'compressed'});
css = autoprefixer(css);
css = cleanCss(css);

// merge HTML, JavaScript and CSS trees into a single tree and export it
var revvable = mergeTrees([html, css, jstree, publicFiles], {overwrite: true});
if (env === 'production') {
  revvable = new assetRev(revvable, {
    extensions: ['js', 'css', 'eot', 'svg', 'ttf', 'woff'],
    exclude: ['assets/svg/*.svg', 'assets/webfonts/montserrat*'],
    replaceExtensions: ['html', 'js', 'css']
  });
}

module.exports = mergeTrees([revvable], {overwrite: true});
