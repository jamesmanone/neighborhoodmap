const uglifyes = require('uglify-es');
const gulp = require('gulp');
const path = require('path');
const concat = require('gulp-concat');
const pump = require('pump');
const composer = require('gulp-uglify/composer');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');

const minify = composer(uglifyes, console);

gulp.task('copyHtml', () => {
  gulp.src('./src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./public/'));
});

gulp.task('copyCss', () => {
  gulp.src('./src/css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('./public/'));
});

gulp.task('mangleJs', () => {
  pump([
    gulp.src([
      './src/js/model.js',
      './src/js/listviewmodel.js',
      './src/js/map.js',
      './src/js/init.js'
    ]),
    minify(),
    concat('app.js'),
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
