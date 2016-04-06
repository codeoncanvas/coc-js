var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();

gulp.task('build-example', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './examples/js/index.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        // Uncomment this line to minify
        // .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/js/'));
});

// create a task that ensures the build task is complete before
// reloading browsers
gulp.task('js-watch', ['build-example'], browserSync.reload);

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['build-example'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./",
            index: "examples/index.html"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("src/*.js", ['js-watch']);
});
