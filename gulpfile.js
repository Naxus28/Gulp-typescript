var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var paths = {
    pages: ['src/*.html']
};

// wraps browserify in watchify and cache the result
var watchedBrowserify = watchify(
   browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
  }).plugin(tsify)
);


// copies html to /dist
gulp.task("copy-html", function () {
  return gulp.src(paths.pages)
    .pipe(gulp.dest("dist"));
});

// crates a function that bundles the watched browserify
// this function will be called by the watchfied browserify on 'update'
// and by the default task (so we bundle when we run 'gulp' for the first time)
function bundle() {
  return watchedBrowserify
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"));
}

gulp.task("default", ["copy-html"], bundle); // instead of registering the browserify task we call the 'bundle' function, which returns the watchified broweserify and bundles it
watchedBrowserify.on("update", bundle); // Browserify will run the bundle function every time one of your TypeScript files changes
watchedBrowserify.on("log", gutil.log); // log to the console




