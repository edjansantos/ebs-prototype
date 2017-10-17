/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync');

var jsDependencies = [
	'src/app.js'
]; 

var cssDependencies = [
    'node_modules/font-awesome/css/font-awesome.min.css',
    'node_modules/flexboxgrid/dist/flexboxgrid.min.css',
    'src/styles/core.css'
];   

var fontsDependencies = [
    'node_modules/font-awesome/fonts/**.**'
]

//compiling our SCSS files
gulp.task('build-styles', function() {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src(cssDependencies)
                //get sourceMaps ready
                .pipe(sourcemaps.init())
                //catch errors
                .on('error', gutil.log)
                //the final filename of our combined css file
                .pipe(concat('style.css'))
                //get our sources via sourceMaps
                .pipe(sourcemaps.write())
                //where to save our final, compressed css file
                .pipe(gulp.dest('src/build/styles'))
                //notify browserSync to refresh
                .pipe(browserSync.reload({stream: true}));
});

gulp.task('build-js', function() {
  return gulp.src(jsDependencies)
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('src/build/js'));
});    

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "src/"
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
});

//basically just keeping an eye on all HTML files
gulp.task('html', function() {
	console.log('mudou html')
    //watch any and all HTML files and refresh when something changes
    return gulp.src('src/*.html')
        .pipe(browserSync.reload({stream: true}))
        //catch errors
        .on('error', gutil.log);
});

gulp.task('copy-fonts', function () {
     return gulp
             .src(fontsDependencies)
             .pipe(gulp.dest('src/build/fonts'));
});


//cleans our dist directory in case things got deleted
gulp.task('clean', function() {
    return shell.task([
      'rm -rf dist'
    ]);
});


  gulp.watch(['src/**/*.js', '!src/build'], ['build-js']);
  gulp.watch(['src/styles/*.css', '!src/build'], ['build-styles']);
  gulp.watch(['src/*.html', '!src/build'], ['build-js']);
gulp.watch("src/*.html").on('change', browserSync.reload);
gulp.watch("src/**/*.css").on('change', browserSync.reload);


gulp.task('watch', function() {
});

gulp.task('default', ['browserSync', 'html', 'build-js', 'build-styles', 'copy-fonts']);