var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var paths = {
    pages: ['src/*.html']
};

// copies html to /dist
gulp.task("copy-html", function () {
  return gulp.src(paths.pages)
    .pipe(gulp.dest("dist"));
});


// browserify the stream so we can render in the browser
gulp.task("default", ["copy-html"], function () {
  return browserify({
    basedir: '.',
    debug: true, // generates inline sourcemap in the bundle.js created below
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
  })
  .plugin(tsify)
  .bundle()
  .on('error', function (error) { console.error(error.toString()); })
  .pipe(source('bundle.js'))
  .pipe(gulp.dest("dist"));
});


