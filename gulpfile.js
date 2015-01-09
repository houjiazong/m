////////////////////////////////////////////////////////////
//                   SRC && DIST PATHS                    //
////////////////////////////////////////////////////////////

var srcPath = './src/',
	distPath = './dist/';

var paths = {
	viewSrc: srcPath + 'views/*.html',
	viewDist: distPath + 'views/',
	cssSrc: srcPath + 'css/*.css',
	cssDist: distPath + 'css/',
	jsSrc: srcPath + 'js/*.js',
	jsDist: distPath + 'js/',
	imageSrc: srcPath + 'images/*',
 	imageDist: distPath + 'images/',
 	fontSrc: srcPath + 'font/*',
 	fontDist: distPath + 'font/',
 	bowerSrc: './bower_components/'
};

///////////////////////////////////////////////////////
//                   DEPENDENCIES                    //
///////////////////////////////////////////////////////

var gulp = require('gulp'),						// gulp core
	jshint = require('gulp-jshint'),			// check if js is ok
	csslint = require('gulp-csslint'),			// check if css is ok
	gutil = require('gulp-util'),				// utility functions for gulp
	browserSync = require('browser-sync'),		// inject code to all devices
	reload = browserSync.reload,				// reload code
	rename = require('gulp-rename'),			// rename files
	concat = require('gulp-concat'),			// concatenates files
	minifycss = require('gulp-minify-css'),		// minify css with clean-css
	uglify = require('gulp-uglify'),			// minify files width uglifyjs
	clean = require('gulp-clean'),				// removing files and folders
	imagemin = require('gulp-imagemin'),		// minify png, jpeg, gif and svg images
	pngquant = require('imagemin-pngquant');	// pngquant imagemin plugin

///////////////////////////////////////////////////////////////////////////
//                   CUSTOM ERRORS OUTPUT FOR CSSLINT                    //
///////////////////////////////////////////////////////////////////////////

var customCSSReporter = function(file) {
	gutil.log(gutil.colors.red(file.csslint.errorCount) + ' errors in ' + gutil.colors.yellow(file.path));
	file.csslint.results.forEach(function(result) {
		gutil.log(gutil.colors.cyan(result.error.message) + ' on line ' + gutil.colors.magenta(result.error.line));
	});
};

////////////////////////////////////////////////////////
//                   CHECK JS TASK                    //
////////////////////////////////////////////////////////

gulp.task('js-lint', function() {
	gulp.src(paths.jsSrc)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

/////////////////////////////////////////////////////////
//                   CHECK CSS TASK                    //
/////////////////////////////////////////////////////////

gulp.task('css-lint', function() {
	gulp.src(paths.cssSrc)
		.pipe(csslint())
		.pipe(csslint.reporter(customCSSReporter));
});

//////////////////////////////////////////////////
//                   JS TASK                    //
//////////////////////////////////////////////////

gulp.task('scripts', function() {
	gulp.src(paths.jsSrc)
		.pipe(concat('common.js'))
		.pipe(gulp.dest(paths.jsDist))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest(paths.jsDist))
		.pipe(reload({stream: true}));
});

///////////////////////////////////////////////////
//                   CSS TASK                    //
///////////////////////////////////////////////////

gulp.task('styles', function() {
	gulp.src(paths.cssSrc)
		.pipe(concat('main.css'))
		.pipe(gulp.dest(paths.cssDist))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss({keepBreaks: true}))
		.pipe(gulp.dest(paths.cssDist))
		.pipe(reload({stream: true}));
});

/////////////////////////////////////////////////////////////
//                   MINIFY IMAGES TASK                    //
/////////////////////////////////////////////////////////////

gulp.task('images', function() {
	return gulp.src(paths.imageSrc)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(paths.imageDist));
});

/////////////////////////////////////////////////////
//                   FONTS TASK                    //
/////////////////////////////////////////////////////

gulp.task('fonts', function() {
	gulp.src(paths.fontSrc)
		.pipe(gulp.dest(paths.fontDist));
});

///////////////////////////////////////////////////////
//                   BROWSER SYNC                    //
///////////////////////////////////////////////////////

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: './',
			directory: true
		},
		files: [
			paths.cssSrc,
			paths.viewSrc,
			paths.jsSrc
		]
	});
});

///////////////////////////////////////////////////////////
//                   BUILD BOWER TASK                    //
///////////////////////////////////////////////////////////

gulp.task('build-bower', function() {
	gulp.src(paths.bowerSrc + 'zepto/zepto.js')
		.pipe(gulp.dest(paths.jsDist));
	gulp.src(paths.bowerSrc + 'zepto/zepto.min.js')
		.pipe(gulp.dest(paths.jsDist));
});

/////////////////////////////////////////////////////
//                   CLEAN TASK                    //
/////////////////////////////////////////////////////

gulp.task('clean', function() {
	gulp.src(distPath, {read: false})
		.pipe(clean());
});

////////////////////////////////////////////////////////
//                    DEFAULT TASK                    //
////////////////////////////////////////////////////////

gulp.task('default', ['clean'], function() {
	gulp.run('scripts', 'styles', 'build-bower', 'fonts', 'images', 'browser-sync');
	gulp.watch(paths.cssSrc, ['styles']);
	gulp.watch(paths.jsSrc, ['scripts']);
});

