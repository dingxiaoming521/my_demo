var gulp = require('gulp');
var sass = require('gulp-sass');
var changed = require('gulp-changed');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer'); //css浏览器前缀
var cleancss = require('gulp-clean-css'); //压缩css
var browserSync = require('browser-sync').create();
var debug = require('gulp-debug');
var reload = browserSync.reload;

// styles
gulp.task('styles', function() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 6-8', 'ie 9'],
      cascade: false
    }))
    .pipe(changed('dist/css/', {
      hasChanged: changed.compareContents
    }))
    .pipe(debug({
      title: "cross:"
    }))
    // .pipe(rename({
    //   suffix: '.min'
    // })){ compatibility: 'ie8' }
    .pipe(cleancss({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest('dist/css/'))
    .pipe(reload({
      stream: true
    }));
});

//复制images
gulp.task('images', function() {
  return gulp.src('src/images/**/*.{bpm,gif,jpg,jpeg,png,svg,ico}')
    .pipe(imagemin({
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
      svgoPlugins: [{
          removeViewBox: false
        }] //不要移除svg的viewbox属性
    }))
    .pipe(gulp.dest('dist/images'))
    .pipe(reload({
      stream: true
    }));
})

// HTML处理
gulp.task('html', function() {
  gulp.src('src/**/*.html')
    .pipe(changed('dist'))
    .pipe(gulp.dest('dist'))
});

// watch
gulp.task('watch', ['html', 'styles', 'images', 'js', 'fonts', 'plugins'], function() {
  browserSync.init({
    proxy: "localhost:9071",
    port: "3900",
  });
  gulp.watch('src/sass/**/*.scss', ['styles']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/images/**/*.{png,jpg,gif,ico}', ['images']);
  gulp.watch('**/*.html').on('change', reload);
});

// default task
gulp.task('default', ['watch']);