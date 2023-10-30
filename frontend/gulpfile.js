const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const flatten = require('gulp-flatten');

const frontendFolder = './src';
const backendStaticFolder = '../backend/src/static';

// Minify HTML files and move them to backend/static with the name "index.html"
gulp.task('minify-html', () => {
  return gulp
    .src([`${frontendFolder}/**/*.html`])
    .pipe(htmlmin({ collapseWhitespace: true }))
    // .pipe(rename({ suffix: '.min' }))
    .pipe(flatten())
    .pipe(gulp.dest(`${backendStaticFolder}`));
});

// Minify JavaScript files and move them to backend/static with the name "*.min.js"
gulp.task('minify-js', () => {
  return gulp
    .src(`${frontendFolder}/**/*.js`)
    .pipe(uglify())
    // .pipe(rename({ suffix: '.min' }))
    .pipe(flatten())
    .pipe(gulp.dest(`${backendStaticFolder}/js`));
});

// Minify CSS files and move them to backend/static with the name "*.min.css"
gulp.task('minify-css', () => {
  return gulp
    .src(`${frontendFolder}/**/*.css`)
    .pipe(cleanCSS())
    // .pipe(rename({ suffix: '.min' }))
    .pipe(flatten())
    .pipe(gulp.dest(`${backendStaticFolder}/css`));
});

// Copy image files to backend/static
gulp.task('copy-images', () => {
  return gulp
    .src(`${frontendFolder}/img/**/*.png`)
    // .pipe(rename({ suffix: '.min' }))
    .pipe(flatten())
    .pipe(gulp.dest(`${backendStaticFolder}/img`));
});

// The default task that runs all tasks
gulp.task('default', gulp.parallel('minify-html', 'minify-js', 'minify-css', 'copy-images'));

