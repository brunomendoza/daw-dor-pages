const { src, dest, series, parallel, watch, on } = require('gulp');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const inject = require('gulp-inject');

sass.compiler = require('sass');

function cssSass() {
    return src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./src/css/'));
}

function cssMinify() {
    return src('./src/css/**/*.css')
        .pipe(csso())
        .pipe(rename((path) => {
            console.log(path);
            return {
                dirname: path.dirname + '/css',
                basename: path.basename + "-min",
                extname: '.css'
            };
        }))
        .pipe(dest('./dist/'));
}

function jsMinify() {
    return src('./src/js/**/*.js')
        .pipe(uglify())
        .pipe(rename((path) => {
            return {
                dirname: path.dirname + '/js',
                basename: path.basename + '-min',
                extname: '.js'
            };
        }))
        .pipe(dest('./dist'));
}

function htmlMinify() {
    return src('./src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('./dist'));
}

function index() {
    var target = src('./src/index.html');
    var sources = src(['./src/js/**/*.js', './src/css/**/*.css'], { read: false });

    return target.pipe(inject(sources))
        .pipe(dest('./src'));
}


exports.sass = function() {
    watch('./src/scss/**/*.scss', cssSass);
}

exports.default = parallel(cssMinify, jsMinify, htmlMinify);