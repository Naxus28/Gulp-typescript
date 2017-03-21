const gulp = require("gulp");
      plugins = require('gulp-load-plugins')(),
      browserify = require("browserify"),
      browserSync = require('browser-sync'),
      runSequence = require('run-sequence'),
      source = require('vinyl-source-stream'),
      tsify = require("tsify"),
      buffer = require('vinyl-buffer'),
      paths = {
        html: {
          dist: ['dist/index.html'],
          src : ['src/*.html']
        },
        ts: {
          dist: 'dist/*.js',
          src: 'src/*.ts'
        }
      };

// copies html to dist
gulp.task('copy-html', () => {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest('dist'));
});

// injects script tag into HTML
gulp.task('inject', ['browserify'], () => {
  let injectOptions = { addRootSlash: false, ignorePath: '/dist' };

  let tsSource = gulp.src(paths.ts.dist);
  let targetHtml = paths.html.dist;

  return gulp.src(targetHtml)
    .pipe(plugins.inject(tsSource, injectOptions))
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

// watch files for changes and runs tasks in sequence
gulp.task('watch', () => {
  gulp.watch(paths.html.src, () => runSequence('copy-html', 'inject', 'reload'));
  gulp.watch(paths.ts.src, () => runSequence('browserify', 'reload'));
});


// reload server
gulp.task('reload', () => browserSync.reload());

//initialize server
let browserSyncInit = () => {
  browserSync({
    server: {
      baseDir: './dist'
    }
  });
};

// build task
gulp.task('build', ['copy-html', 'browserify', 'inject']);

// serve task
gulp.task('serve', ['build', 'watch'], () => browserSyncInit())







