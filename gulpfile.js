let proFolder = require('path').basename(__dirname);
let srcFolder = 'src';

let path = {
    build: {
        html: proFolder + '/',
        css: proFolder + '/css/',
        js: proFolder + '/js/',
        img: proFolder + '/img/',
        fonts: proFolder + '/fonts/'
    },
    src: {
        html: srcFolder + '/html/index.html',
        css: srcFolder + '/scss/style.scss',
        js: srcFolder + '/js/app.js',
        img: srcFolder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
        fonts: srcFolder + '/fonts/*.ttf'
    },
    watch: {
        html: srcFolder + '/html/**/*.html',
        css: srcFolder + '/scss/**/*.scss',
        js: srcFolder + '/js/**/*.js',
        img: srcFolder + '/img/**/*.{jpg,png,svg,gif,ico,webp}'
    },
    clean: './' + proFolder + '/'
}

let {src, dest, watch} = require('gulp'),
    {series, parallel} = require('gulp'),
    fileinclude = require('gulp-file-include'),
    htmlmin = require('gulp-htmlmin'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    groupMedia = require('gulp-group-css-media-queries'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    del = require('del');

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(dest(path.build.html));
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(dest(path.build.js));
}

function css() {
    return src(path.src.css)
        .pipe(scss({outputStyle: 'expanded'}))
        .pipe(groupMedia())
        .pipe(autoprefixer({
            overrideBrowserslist:['last 5 versions'],
            cascade: 'false'
        }))
        .pipe(dest(path.build.css))
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(rename({extname: '.min.css'}))
        .pipe(dest(path.build.css));
}

function clean() {
    return del(path.clean);
}

function watchFiles() {
    watch([path.watch.html], html);
    watch([path.watch.js], js);
    watch([path.watch.css], css);
}

exports.default = series(clean, parallel(
    html,
    js,
    css
), watchFiles);