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
          dist: 'dist/js',
          src: 'src/main.ts'
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
  let tsSource = gulp.src(paths.ts.dist, { read: false });
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

// watch
gulp.task('watch', () => {
   console.log('paths.html.src: ', paths.html.src) 
   console.log('paths.ts.src: ', paths.ts.src) 
  gulp.watch(paths.html.src, () => runSequence('html', 'inject', 'reload'));
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

// default task--optionally we could pass the browserify task as a function to this task. i.e. gulp.task('default', ['copy-html'], function() { // task goes here } );
gulp.task('build', ['html', 'browserify', 'inject']);

gulp.task('serve', ['build', 'watch'], () => browserSyncInit())







