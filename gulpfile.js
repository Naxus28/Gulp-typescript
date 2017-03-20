var gulp = require("gulp");
var ts = require("gulp-typescript"); // https://github.com/ivogabe/gulp-typescript
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
  return tsProject.src()
      .pipe(tsProject())
      .js.pipe(gulp.dest("dist"));
});



