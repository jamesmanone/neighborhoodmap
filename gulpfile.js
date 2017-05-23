// jshint esversion: 6
const gulp = require('gulp');
const path = require('path');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('copyHtml', () => {
  gulp.src('./src/*.html')
    .pipe(gulp.dest('./public/'));
});

gulp.task('copyCss', () => {
  gulp.src('./src/css/*.css')
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('mangleJs', () => {
  gulp.src([
    './src/js/model.js',
    './src//jsmap.js',
    './src/js/services.js',
    './src/js/app.js'
  ])
    .pipe(concat())
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/app.js'));
});

gulp.task('watch', () => {
  gulp.watch('./src/*.html', ['copyHtml']);
  gulp.watch('./src/css/*.css', ['copyCss']);
  gulp.watch('./src/js/*.js', ['mangleJs']);
});
