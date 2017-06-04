
const gulp = require('gulp');
const path = require('path');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

gulp.task('copyHtml', () => {
  gulp.src('./src/*.html')
    .pipe(gulp.dest('./public/'));
});

gulp.task('copyCss', () => {
  gulp.src('./src/css/*.css')
    .pipe(gulp.dest('./public/'));
});

gulp.task('mangleJs', () => {
  gulp.src([
    './src/js/listviewmodel.js',
    './src/js/model.js',
    './src/js/map.js',
    './src/js/init.js'
  ])
    // .pipe(babel())
    .pipe(concat('app.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('./public/'));
});

gulp.task('default', ['copyHtml', 'copyCss', 'mangleJs']);

gulp.task('watch', () => {
  console.log('Gulp watching for changes...');
  gulp.watch('./src/*.html', ['copyHtml']);
  gulp.watch('./src/css/*.css', ['copyCss']);
  gulp.watch('./src/js/*.js', ['mangleJs']);
});
