var gulp = require("gulp");
var gutil = require("gulp-util");
var browserify = require("browserify");
var source = require("vinyl-source-stream");


gulp.task("browserify", function() {
    browserify("./main.js")
    .bundle()
    .on("error", function (err) {
        gutil.log("Gulp Error:", err);
    })
    .pipe(source("amish-vigilante-tycoon.js"))
    .pipe(gulp.dest("./dist"));
});

gulp.task("watch", function () {
    gulp.watch("*", ["browserify"]);
});

gulp.task("default", ["watch"]);

module.exports = gulp;
