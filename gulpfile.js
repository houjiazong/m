var srcPath = './src/',
	distPath = './dist/';

var options = {
	viewSrc: srcPath + 'views/*.html',
	viewDist: distPath + 'views/',
	cssSrc: srcPath + 'css/*.css',
	cssDist: distPath + 'css/',
	jsSrc: srcPath + 'js/*.js',
	jsDist: distPath + 'js/',
	imageSrc: srcPath + 'images/*',
	imageDist: distPath + 'images/'
};

var gulp = require('gulp'),
	minifycss = require('gulp-minify-css'),
	csslint = require('gulp-csslint'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	clean = require('gulp-clean'),
	useref = require('gulp-useref'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	livereload = require('gulp-livereload'),
	LIVE_RELOAD_PORT = 35729;

gulp.task('html', function () {
	var assets = useref.assets();
	return gulp.src(options.viewSrc)
		.pipe(assets)
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest(options.viewDist))
		.pipe(livereload());
});

gulp.task('css', function() {
	return gulp.src(options.cssSrc)
		.pipe(csslint())
		.pipe(csslint.reporter())
		.pipe(concat('all.css'))
		.pipe(gulp.dest(options.cssDist))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest(options.cssDist))
		.pipe(livereload());
});

gulp.task('js', function (){
	return gulp.src(options.jsSrc)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(concat('all.js'))
		.pipe(gulp.dest(options.jsDist))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest(options.jsDist))
		.pipe(livereload());
});

gulp.task('image', function() {
	return gulp.src(options.imageSrc)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(options.imageDist))
		.pipe(livereload());
});

gulp.task('watch', function() {
	livereload.listen(LIVE_RELOAD_PORT);
	gulp.watch(options.viewSrc, ['html']);
	gulp.watch(options.cssSrc, ['css']);
	gulp.watch(options.jsSrc, ['js']);
	gulp.watch(options.imageSrc, ['image']);
});

gulp.task('clean', function (){
	return gulp.src(distPath, {read: false})
		.pipe(clean());
});

gulp.task('default', ['clean'], function() {
	gulp.run('html', 'css', 'js', 'image');
});