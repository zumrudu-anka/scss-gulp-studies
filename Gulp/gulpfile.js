const { task , src, series, parallel, dest, watch } = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const cssMin = require('gulp-clean-css');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

task('begin', callback =>{
    console.log("Gulp is Starting Now");
    callback();
});

task('img',  callback => {
    src('./src/images/**/*.jpg')
    .pipe(imagemin())
    .pipe(dest('./dist/images'))
    .pipe(browserSync.stream());
    callback();
});

task('html',  callback => {
    src('./src/**/*.html')
    .pipe(dest('./dist/'))
    .pipe(browserSync.stream());
    callback();
});

// task('js', async ()=>{
//     src('./src/scripts/**/*.js')
//     .pipe(uglify().on('error', console.error))
//     .pipe(dest('./dist/scripts/'));
// });

task('css',  callback =>{
    src('./src/styles/**/*.css')
    .pipe(cssMin())
    .pipe(dest('./dist/styles/'))
    .pipe(browserSync.stream());
    callback();
});

task('js',  callback =>{
    src('./src/scripts/**/*.js')
    .pipe(concat('concated.js'))
    .pipe(uglify())
    .pipe(dest('./dist/scripts/'))
    .pipe(browserSync.stream());
    callback();
});

task('sass',  (callback) => {
    src('./src/styles/scss/**/*.scss')
    .pipe(sass())
    .pipe(cssMin())
    .pipe(dest('./dist/styles/'))
    .pipe(browserSync.stream());
    callback();
});

const myTasks = ['begin', 'img', 'html', 'js', 'css', 'sass'];

task('serve',series(myTasks, () => {
    browserSync.init({
        server : './dist/'
    });
    // parallel(
    //     [watch('./src/styles/**/*', parallel(['css', 'sass'])),
    //     watch('./src/scripts/**/*.js', series(['js'])),
    //     watch('./src/images/*', series(['img'])),
    //     watch('./src/**/*.html', series(['html']))],
    //     ()=>{
    //         console.log("sdf");
    //     }
    // );
    watch('./src/styles/**/*', parallel(['css', 'sass']));
    watch('./src/scripts/**/*.js', series(['js']));
    watch('./src/images/*', series(['img']));
    watch('./src/**/*.html', series(['html']));
}));

// const myTasks = ['begin', 'img', 'html', 'js', 'css', 'sass'];

// task('default', series(myTasks, async ()=>{
//     console.log("Gulp processes completed now");
// }));

task('default', series(['serve'], () => {
    console.log("Gulp processes completed now");
}));