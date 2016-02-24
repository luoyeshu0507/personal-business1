var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var reload       = browserSync.reload;
var rename       = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: {
		    baseDir: "./"
		},
		port:3012
    });
    gulp.watch(["*/**/*.scss","!node_modules/**"], ['sass']);
    gulp.watch(['*.html','*/*.html',"!node_modules/**"]).on('change', reload);
    gulp.watch(["*/**/*.js","!node_modules/**"]).on('change', reload);
});

gulp.task('sass', function() {
    return gulp.src("*/**/sass/*.scss")
    	.pipe(autoprefixer({
            browsers: ['last 4 versions','> 1%','ie 7'],
            cascade: false,
            remove:true
		}))
        .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
        .pipe(rename(function(path){
        	path.dirname=path.dirname.replace(/sass$/,'css');
    	}))
        .pipe(gulp.dest("."))
        .pipe(reload({stream: true}));
});

gulp.task('default', ['serve']);
