var gulp = require('gulp');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
// var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var imagemin = require('gulp-imagemin');
gulp.task('less', function() {
  gulp.src('./dev/css/*.less')
  .pipe(less())
  .pipe(minifyCss())	
  .pipe(gulp.dest('./dist/css'))
});
gulp.task('css', function() {
  gulp.src('./dev/css/*.css')
  .pipe(minifyCss())	
  .pipe(gulp.dest('./dist/css'))
});
gulp.task('js',function(){
  gulp.src('./dev/js/*.js')
  .pipe(babel({
    presets: ['@babel/env']
  }))
  // .pipe(uglify()) //先不压缩   不利于调试
  .pipe(gulp.dest('dist/js'))
});
gulp.task('img',function(){
  gulp.src('./dev/img/*.*')
  .pipe(imagemin())
  .pipe(gulp.dest('./dist/img'))
});
gulp.task('default',function(){
  gulp.watch('./dev/css/**/*.less',['less']);
  gulp.watch('./dev/css/**/*.css',['css']);
  gulp.watch('./dev/js/**/*.js',['js']);
  gulp.watch('./dev/img/**/*.*',['img']);
})