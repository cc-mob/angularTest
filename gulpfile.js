var ngannotate = require('gulp-ng-annotate');


var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    del = require('del');
    minifyhtml = require('gulp-minify-html');
    //stripDebug = require('strip-debug');


var src = './app';
var dist = './dist';

var paths = {
    scripts : src + '/scripts/**/*.js' ,
    fonts : src + '/fonts/**/*.{ttf,woff,eof,svg}*' ,
    images : src + '/images/**/*',
    styles : src + '/styles/**/*',
    html : src + '/html/**/*.html',
    bower : src + '/bower_components/**/*'
}


// jshint
gulp.task('jshint', function() {
  return gulp.src(paths.scripts)
  .pipe(jshint())
  .pipe(jshint.reporter(stylish))
});


// javascript combine and compress
gulp.task('scriptsmin', ['jshint'], function () {
	return gulp.src(paths.scripts)
		//.pipe(stripDebug())
        .pipe(ngannotate())
	    .pipe(uglify())
        //.pipe(rev())
		.pipe(gulp.dest(dist + '/scripts'))
        .pipe(notify({ message: 'scriptsmin task complete' }));
});

// HTML compress
gulp.task('htmlmin', ['jshint'], function () {
	return gulp.src(paths.html)
		.pipe(minifyhtml())
		.pipe(gulp.dest(dist + '/html'))
        .pipe(notify({ message: 'htmlmin task complete' }));
});

// Images compress
gulp.task('imagemin', ['jshint'], function() {
  return gulp.src(paths.images)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(dist+'/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// bower copy
gulp.task('copybower', ['jshint'], function () {
  return gulp.src(paths.bower)
      .pipe(gulp.dest(dist+'/bower_components'))
      .pipe(notify({ message: 'copybower task complete' }));
});

// main.html copy
gulp.task('copymain',['jshint'], function () {
  return gulp.src('./app/index.html')
      .pipe(gulp.dest('dist/'))
      .pipe(notify({ message: 'copymain task complete' }));
});

// stylecopy
gulp.task('copystyle', ['jshint'] , function () {
  return gulp.src(paths.styles)
  	  .pipe(minifycss())
      //.pipe(rev())
      .pipe(gulp.dest(dist+'/styles'))
      .pipe(notify({ message: 'copystyle task complete' }));
});

// copyfonts
gulp.task('copyfonts',['jshint'] , function() {
   gulp.src(paths.fonts)
   .pipe(gulp.dest(dist+'/fonts'))
   .pipe(notify({ message: 'copyfonts task complete' }));
});


// Clean
gulp.task('clean', function() {
    return del(['dist']);
});


// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('copymain', 'htmlmin', 'scriptsmin', 'imagemin','copybower', 'copystyle' , 'copyfonts');
});


// Watch

gulp.task('watch', ['browser-sync'], function() {
  // Watch .js files
  gulp.watch('{./app/scripts/**/*.js,./app/styles/**/*.css,./app/**/*.html}', ['usemin']);
      // Watch image files
  gulp.watch('./app/images/**/*', ['imagemin']);

});

gulp.task('browser-sync', ['default'], function () {
   var files = [
      './app/**/*.html',
       paths.bower,
       paths.fonts,
       paths.html,
       paths.images,
       paths.scripts,
       paths.styles,
      './dist/**/*'
   ];

   browserSync.init(files, {
      server: {
         baseDir: "dist",
         index: "index.html"
      }
   });
        // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', browserSync.reload);
});

