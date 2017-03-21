var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['src/*.html']
};

// copies html to dist
gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});


// browserifies code
gulp.task("browserify", function() {
  var browserifyConfig = {
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
  };

  return browserify(browserifyConfig)
  .plugin(tsify) // browserify plugin to compile typescript
  .bundle()
    .on('error', function (err) { console.error(err); })
  .pipe(source('bundle.js')) // in memory bundled file
  .pipe(buffer()) // need to buffer to be able to use other js plugins
  .pipe(sourcemaps.init({loadMaps: true})) // this will start the creation of a separate sourcemap file as opposed to inline
  .pipe(uglify())
  .pipe(sourcemaps.write('./')) // the calls to buffer and sourcemaps exist to make sure sourcemaps keep working
  .pipe(gulp.dest("dist"));
});

// default task--optionally we could pass the browserify task as a function to this task. i.e. gulp.task("default", ["copy-html"], function() { // task goes here } );
gulp.task("default", ["copy-html", "browserify"]);







