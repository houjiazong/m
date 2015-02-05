// paths

var distPath = './dist/';

var cssPath = './css/',
	jsPath = './js/';

var cssDistPath = distPath + 'css/',
	jsDistPath = distPath + 'js/';

var jsVendorPath = jsDistPath + 'vendor/',
	cssVendorPath = cssDistPath + 'vendor/';

var bowerPath = './bower_components/';

var fontPath = distPath + 'fonts/';

var files = {
	js_files: [
		jsPath + 'm.js'
	],
	css_files: [
		cssPath + 'base.css',
		cssPath + 'buttons.css',
		cssPath + 'forms.css',
		cssPath + 'grids.css',
		cssPath + 'tables.css'
	]
};

// dependencies

var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	csslint = require('gulp-csslint'),
	gutil = require('gulp-util'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	clean = require('gulp-clean'),
	autoprefixer = require('gulp-autoprefixer');

// custom errors output for csslint

var customCSSReporter = function(file) {
	gutil.log(gutil.colors.red(file.csslint.errorCount) + ' errors in ' + gutil.colors.yellow(file.path));
	file.csslint.results.forEach(function(result) {
		gutil.log(gutil.colors.cyan(result.error.message) + ' on line ' + gutil.colors.magenta(result.error.line));
	});
};

// check js task

gulp.task('js-lint', function() {
	return gulp.src(files.js_files)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// check css task

gulp.task('css-lint', function() {
	return gulp.src(files.css_files)
		.pipe(csslint())
		.pipe(csslint.reporter(customCSSReporter));
});

// js task

gulp.task('scripts', function() {
	return gulp.src(files.js_files)
		.pipe(concat('m.js'))
		.pipe(gulp.dest(jsDistPath))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest(jsDistPath))
		.pipe(reload({stream: true}));
});

// css task

gulp.task('styles', function() {
	return gulp.src(files.css_files)
		.pipe(autoprefixer({
			browsers: [
				'last 2 versions',
				'> 1%',
				'IE 9',
				'IE 8'
			],
			cascade: false
		}))
		.pipe(concat('m.css'))
		.pipe(gulp.dest(cssDistPath))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss({keepBreaks: false}))
		.pipe(gulp.dest(cssDistPath))
		.pipe(reload({stream: true}));
});

// build bower

gulp.task('build-bower', function() {

	gulp.src(bowerPath + 'jquery/jquery.min.js')
		.pipe(gulp.dest(jsVendorPath));

	gulp.src(bowerPath + 'jquery/jquery.min.map')
		.pipe(gulp.dest(jsVendorPath));

	gulp.src(bowerPath + 'fontawesome/css/font-awesome.min.css')
		.pipe(gulp.dest(cssDistPath));

	gulp.src(bowerPath + 'fontawesome/fonts/*')
		.pipe(gulp.dest(fontPath));

});

// browser sync

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: './',
			directory: true
		},
		files: [
			'./test/*.html'
		]
	});
});

// clean task

gulp.task('clean', function() {
	return gulp.src(distPath, {read: false})
		.pipe(clean());
});

// default task

gulp.task('default', ['clean'], function() {
	gulp.run('scripts', 'styles', 'build-bower', 'browser-sync');
	gulp.watch(files.js_files, ['scripts']);
	gulp.watch(files.css_files, ['styles']);
});
