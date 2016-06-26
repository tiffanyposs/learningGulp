var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');

// File Paths
var DIST_PATH = 'public/dist';
var SCRIPTS_PATH = 'public/scripts/**/*.js';
var CSS_PATH = 'public/css/**/*.css';

// Styles
gulp.task('styles', function() {
  console.log('starting styles task');

  return gulp.src(['public/css/reset.css', CSS_PATH])
  		.pipe(concat('styles.css'))
  		.pipe(gulp.dest(DIST_PATH))
  		.pipe(livereload());
});

// Scripts
gulp.task('scripts', function() {
	console.log('starting scripts task');

	return gulp.src(SCRIPTS_PATH)
		.pipe(uglify())
		.pipe(gulp.dest(DIST_PATH))
		.pipe(livereload());
		
});

// Images
gulp.task('images', function() {
	console.log('starting images task');
});


gulp.task('default', function() {
	console.log('Starting Default Task');
});


gulp.task('watch', function() {
	console.log('Starting Watch Task');
	require('./server.js');
	livereload.listen();
	gulp.watch(SCRIPTS_PATH, ['scripts']);
});