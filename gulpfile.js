var gulp = require('gulp'),
    del = require('del'),
    run = require('gulp-run'),
    stylus = require('gulp-stylus'),
    cssmin = require('gulp-minify-css'),
    browserify = require('browserify'),
    uglify = require('uglify'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    browserSync = require('browser-sync'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    reactify = require('reactify'),
    package = require('./package.json'),
    reload = browserSync.reload;

gulp.task('bower'), function() {
    run('bower install').exec();
});

.task('clean', function(cb){
    del(['/dist/**'], cb);
});

.task('server', function(){
    browserSync({
        server: {
            baseDir: './'
        }
    }); 
});

.task('stylus', function(){
    return gulp.src(package.paths.sytlus)
    .pipe(stylus())
    .pipe(concat(package.dest.style))
    .pipe(gulp.dest(package.dest.dist));
});