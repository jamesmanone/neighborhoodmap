const uglifyes = require('uglify-es');
const gulp = require('gulp');
const path = require('path');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const pump = require('pump');
const composer = require('gulp-uglify/composer');

const minify = composer(uglifyes, console);

gulp.task('copyHtml', () => {
  gulp.src('./src/*.html')
    .pipe(gulp.dest('./public/'));
});

gulp.task('copyCss', () => {
  gulp.src('./src/css/*.css')
    .pipe(gulp.dest('./public/'));
});

gulp.task('mangleJs', () => {
  pump([
    gulp.src([
      './src/js/listviewmodel.js',
      './src/js/model.js',
      './src/js/map.js',
      './src/js/init.js'
    ]),
    concat('app.js'),
    minify({mangle: false}),
    gulp.dest('./public/')
  ]);
});

gulp.task('default', ['copyHtml', 'copyCss', 'mangleJs']);

gulp.task('watch', () => {
  console.log('Gulp watching for changes...');
  gulp.watch('./src/*.html', ['copyHtml']);
  gulp.watch('./src/css/*.css', ['copyCss']);
  gulp.watch('./src/js/*.js', ['mangleJs']);
});
