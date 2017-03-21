const gulp = require("gulp");
      plugins = require('gulp-load-plugins')(),
      browserify = require("browserify"),
      source = require('vinyl-source-stream'),
      tsify = require("tsify"),
      buffer = require('vinyl-buffer'),
      paths = {
        html: {
          dist: ['/dist/index.html'],
          src : ['src/*.html']
        },
        js: {
          dist: '/dist/js'
        }
      };

// copies html to dist
gulp.task('html', () => {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest('dist'));
});

// injects script tag into HTML
gulp.task('inject', ['browserify'], () => {
  let injectOptions = { addRootSlash: false, ignorePath: './dist', relative: true };
  let jsSource = gulp.src(paths.js.dist, { read: false });
  let targetHtml = paths.html.dist;

  return gulp.src(targetHtml)
    .pipe(plugins.inject(jsSource, injectOptions))
    .pipe(gulp.dest('dist'));
});

// browserifies
gulp.task('browserify', () => {
  let browserifyConfig = {
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
  };

  let babelifyConfig = {
    presets: ['es2015'],
    extensions: ['.ts']
  }

  return browserify(browserifyConfig)
    .plugin(tsify) // browserify plugin to compile typescript
    .transform('babelify', babelifyConfig)
    .bundle()
    .pipe(source('bundle.js')) // in memory bundled file
    .pipe(buffer()) // need to buffer to be able to use other js plugins
    .pipe(plugins.sourcemaps.init({loadMaps: true})) // this will start the creation of a separate sourcemap file as opposed to inline
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write('./')) // the calls to buffer and sourcemaps exist to make sure sourcemaps keep working
    .pipe(gulp.dest('dist'));
});

// default task--optionally we could pass the browserify task as a function to this task. i.e. gulp.task('default', ['copy-html'], function() { // task goes here } );
gulp.task('default', ['html', 'browserify', 'inject']);







