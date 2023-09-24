const gulp = require('gulp');
const concat = require('gulp-concat');
const gulpSass = require('gulp-sass');
const nodeSass = require('sass');
const minify = require('gulp-minify');
//const sourcemaps = require('gulp-sourcemaps');
const svgSprite = require('gulp-svg-sprite');
const sass = gulpSass(nodeSass);
const cleanCSS = require('gulp-clean-css');

const distDir = './public'

const minifyJsOptions = {
    noSource: true,
    ext: {
        min: '.min.js'
    },
    exclude: ['tasks'],
    ignoreFiles: ['.combo.js', '-min.js']
}

gulp.task('package_scripts', function () {
    return gulp
        .src([
            // 'node_modules/jquery/dist/jquery.slim.min.js',
            'assets/js/App.js',
        ])
        .pipe(concat('vendor.js'))
        //.pipe(sourcemaps.init({loadMaps: true}))
        //.pipe(sourcemaps.write(''))
        .pipe(minify(minifyJsOptions))
        .pipe(gulp.dest(distDir + '/'));
});

gulp.task('package_styles', function () {
    return gulp
        .src([
            'assets/scss/App.scss',
        ])
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('vendor.min.css'))
        //.pipe(sourcemaps.init({loadMaps: true}))
        //.pipe(sourcemaps.write(''))
        .pipe(cleanCSS())
        .pipe(gulp.dest(distDir + '/'));
});

gulp.task('assets', () => {
    gulp.src('**/*.svg', {cwd: 'assets/img/icons'})
        .pipe(svgSprite({
            mode: {
                symbol: { // symbol mode to build the SVG
                    render: {
                        css: false, // CSS output option for icon sizing
                        scss: false // SCSS output option for icon sizing
                    },
                    dest: 'img', // destination folder
                    sprite: 'icons.svg', //generated sprite name
                    example: true // Build a sample page, please!
                }
            }
        }))
        .pipe(gulp.dest(distDir));

    gulp
        .src('assets/img/*')
        .pipe(gulp.dest(distDir + '/img'));

    gulp
        .src('assets/img/*/*')
        .pipe(gulp.dest(distDir + '/img'));

    return gulp
        .src('assets/img/*/*/*')
        .pipe(gulp.dest(distDir + '/img'));
});

gulp.task('watch', function () {
    gulp.watch('assets/scss/**/**.scss', gulp.series('package_styles'))
    gulp.watch('assets/js/**/**.js', gulp.series('package_scripts'))
    gulp.watch('assets/img/**/**', gulp.series('assets'))
});

gulp.task('default', gulp.series(['package_scripts', 'package_styles', 'assets']));