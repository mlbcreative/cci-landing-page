var path = "./";
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var rename = require("gulp-rename");
var notify = require("gulp-notify");
var replace = require("gulp-replace-path");
var imagemin = require('gulp-imagemin');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var del = require('del');
var gulpSequence = require('gulp-sequence');
var uglify = require('gulp-uglifyjs');
var htmlreplace = require('gulp-html-replace');
var prompt = require('gulp-prompt');

//my vars

var remoteUrl = "";


// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'vendors:js'], function() {

    browserSync.init({
        server: "./src"
    });

    gulp.watch(path + "src/assets/scss/*.scss", ['sass']);
    gulp.watch(path + "src/assets/js/*.js", ['js']),
    gulp.watch(path + "src/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
	
	var src = [path + 'src/assets/scss/*.scss'];
	
	
	var config = {
        sass: {
            outputStyle: 'expanded',
            includePaths : [
	            path + 'node_modules/bootstrap/scss/'
            ]
        },
        autoprefixer: {
            browsers: ['last 5 versions']
        }
    };
    
	
    return gulp.src(src)
    	.pipe(sourcemaps.init())
    	.pipe(postcss([ autoprefixer() ]))
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sass(config.sass).on('error', sass.logError))
        .pipe(concat('main.scss'))
        .pipe(rename('main.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("src/assets/css/"))
        .pipe(browserSync.stream());
});

gulp.task('vendors:js', function() {
	
	var src = [path + 'node_modules/jquery/dist/jquery.js' , path + 'node_modules/popper.js/dist/umd/popper.js', path + 'node_modules/bootstrap/dist/js/bootstrap.js'];
	
	gulp.src(src)
	.pipe(concat('vendors.js'))
	.pipe(sourcemaps.init())
	.pipe(sourcemaps.write()) 
    .pipe(gulp.dest(path + "src/assets/js/"));
        
});

gulp.task('js', function() {
	
	var src = [path + 'src/assets/js/*.js'];
	
	gulp.src(src)
    .pipe(gulp.dest(path + "src/assets/js/"));
        
});


//DEV TASKS
gulp.task('default', ['serve']);


//BUILD TASKS

gulp.task('clean', function(){
	return del([path + "dist/"])
})

gulp.task('build:scss', function() {
	var src = [path + 'src/assets/scss/*.scss'];
	
	
	var config = {
        sass: {
            outputStyle: 'compressed',
            includePaths : [
	            path + 'node_modules/bootstrap/scss/'
            ]
        },
        autoprefixer: {
            browsers: ['last 5 versions']
        }
    };
	
    return gulp.src(src)
    	.pipe(sourcemaps.init())
    	.pipe(postcss([ autoprefixer() ]))
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sass(config.sass).on('error', sass.logError))
        .pipe(concat('main.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path + "dist/assets/css/"))
})

gulp.task('build:js', function(){
	var src = [path + 'node_modules/jquery/dist/jquery.js', path + 'node_modules/popper.js/dist/umd/popper.js', path + 'node_modules/bootstrap/dist/js/bootstrap.js', path + 'src/assets/js/*.js'];
	
	gulp.src(src)
	.pipe(sourcemaps.init())
	.pipe(plumber())
	.pipe(concat('main.js'))
	.pipe(uglify())
	.pipe(rename('main.min.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(path + "dist/assets/js/"))
})

gulp.task('build:html', function(){
	
	return gulp.src(path + 'src/index.html')
    .pipe(htmlreplace({
        'css': 'assets/css/main.min.css',
        'js': 'assets/js/main.min.js'
    }))
    .pipe(gulp.dest(path + "dist/"));
	
	
})

gulp.task('remotePrompt', function() {
	
	
	return gulp.src(path + 'dist/index.html')
    .pipe(prompt.prompt({
        type: 'input',
        name: 'task',
        message: 'Enter the remote url you\'d like to use'
    }, function(res){
        remoteUrl = res.task;
        //console.log(remoteUrl)
    }));
    
})

gulp.task('html:remote', ['remotePrompt'], function(){
	return gulp.src(path + 'dist/index.html')
	.pipe(replace("assets/", remoteUrl + "/assets/"))
	.pipe(gulp.dest(path + "dist/"))
})

gulp.task('images', function(){
	gulp.src(path + "src/assets/img/*")
	.pipe(imagemin())
	.pipe(gulp.dest(path + "dist/assets/img/"))
})

gulp.task('build' , gulpSequence('clean', ['build:scss', 'build:js'], 'build:html', 'images'));
gulp.task('build:remote' , gulpSequence('clean', ['build:scss', 'build:js'], 'build:html', 'html:remote', 'images'));