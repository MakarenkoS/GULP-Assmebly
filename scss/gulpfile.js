﻿// Подключение пакетов и задач для Gulp
var gulp = require('gulp');

var browserSync = require('browser-sync').create();

var concat = require('gulp-concat');

var sass = require('gulp-sass')(require('sass'));

var sourcemaps = require('gulp-sourcemaps');

var postcss = require('gulp-postcss');

var autoprefixer = require('autoprefixer');

var minify = require('gulp-csso');

var rename = require('gulp-rename');

var imagemin = require('gulp-imagemin');

var svgstore = require('gulp-svgstore');

var posthtml = require('gulp-posthtml');

var include = require('posthtml-include');

var gulpExport = require('gulp-export')

var gulpBabel = require('gulp-babel')

const Sourcemaps = require('gulp-sourcemaps');

var del = require('del')

// gulp.task('less', function(){

// 	return gulp.src('./src/less/*.less')
// 	.pipe(sourcemaps.init())
// 	.pipe(less())
// 	.pipe(postcss([
// 		autoprefixer()
// 		]))
	
// 	.pipe(concat('styles.css'))
// 	.pipe(sourcemaps.write())
	
// 	.pipe(gulp.dest('./dest/css/'))
// 	.pipe(minify())
// 	.pipe(rename('styles.min.css'))
// 	.pipe(gulp.dest('./dest/css/'))

// });


gulp.task('scss', function() {
  return gulp.src('./src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dest/css'));
})


gulp.task('sprite', function() {
	return gulp.src("src/img/m-*.svg")
	.pipe(svgstore({
		inLineSvg: true,
		example: true
	}))
	.pipe(rename('sprite.svg'))
	.pipe(gulp.dest('dest/img'))
})

gulp.task('html', function(){
	return gulp.src('./src/*.html')
	.pipe(posthtml([
		include()
		]))
	.pipe(gulp.dest('./dest/'));
	
});

// gulp.task('clean', cb => {
//   return Del('./dest/scripts', cb)
// })

gulp.task('js', function() {
	return gulp.src('./src/scripts/*.js')
  // .pipe(gulpExport({
  //   context: './src/scripts',
  //   exclude: /_/, 
  //   exportType: 'default'
  // }))
  // .pipe(Sourcemaps.init())
  // .pipe(gulpBabel())
  // .pipe(Sourcemaps.write('.'))
	.pipe(gulp.dest('./dest/scripts'))
})

gulp.task('img', function(){
	return gulp.src('./src/img/**/*.{png,jpg,svg}')
	.pipe(imagemin([
		imagemin.optipng({optimizationLevel: 3}),
		imagemin.jpegtran({quality:75, progressive: true}),
		imagemin.svgo()
		]))
	.pipe(gulp.dest('./dest/img/'));
});

gulp.task('server', function() {

	browserSync.init({

		server: {
            baseDir: './dest',
            index: 'index.html'
          },
		browser: 'chrome'

  });
  
	gulp.watch('src/**/*.html').on('change', gulp.series('html'));
	gulp.watch('dest/**/*.html').on('change', browserSync.reload);
	// gulp.watch('src/**/*.css').on('change', browserSync.reload);
	
	gulp.watch('src/**/*.js',gulp.series('js'));
	gulp.watch('dest/scripts/*.js').on('change', browserSync.reload);

	gulp.watch('src/**/*.scss',gulp.series('scss'));
	gulp.watch('dest/css/**/*.css').on('change', browserSync.reload);

	gulp.watch('src/img/**/*.*', gulp.series('img'));
	gulp.watch('dest/img/**/*.*').on('change', browserSync.reload);

})

gulp.task('task-before',async function() {
	console.log('Hello from gulp!');
});

// gulp.task('hello', async function() {
// 	console.log('Next');
// });



gulp.task('default', gulp.series('server'));


