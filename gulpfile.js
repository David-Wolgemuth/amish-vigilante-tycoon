var gulp = require("gulp");
var gutil = require("gulp-util");
var exec = require("gulp-exec");
var nodemon = require("gulp-nodemon");
var browserify = require("browserify");
var source = require("vinyl-source-stream");

gulp.task("server", function (cb) {
    nodemon({
        script: 'server.js',
        ignore: ["*"]
    });
});

gulp.task("browserify", function() {
    browserify("./game/main.js")
    .bundle()
    .on("error", function (err) {
        gutil.log("Gulp Error:", err);
    })
    .pipe(source("amish-vigilante-tycoon.js"))
    .pipe(gulp.dest("./build"));
});

gulp.task("watch", function () {
    gulp.watch("**", ["browserify"]);
});

gulp.task("default", ["server", "browserify", "watch"]);

module.exports = gulp;
