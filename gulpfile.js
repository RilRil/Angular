const gulp = require('gulp');
const concat = require('gulp-concat');
const exec = require('child_process').exec;
const bs = require('browser-sync').create();
const del = require('del');
const ts = require('gulp-typescript');
const debug = require('gulp-debug');
const rollup = require('gulp-better-rollup');
const less = require('gulp-less');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const config = {
	dir: {
		tmp: './.tmp/',
		serve: './.tmp/serve',
		client: './client',
		npm: './node_modules'
	},
	tsconfig: './tsconfig.json',
	vendors: './build/vendors.json'
}

let reload = (done) => {
	bs.reload();
	done();
};
let tsProject = ts.createProject(config.tsconfig);



function transpileTS() {
	var tsResult = gulp.src(config.dir.client + '/**/*.ts', { since: gulp.lastRun(transpileTS) })
		.pipe(debug({ title: 'Transpiling' }))
		.pipe(tsProject(ts.reporter.longReporter()));

	return tsResult.js.pipe(gulp.dest(config.dir.serve));
}


function bundleVendorsJS() {
	let vendors = require(config.vendors).js;
	return gulp.src(vendors)
		.pipe(concat('vendors.js'))
		.pipe(gulp.dest(config.dir.serve));
}

function bundleVendorsCSS() {
	let vendors = require(config.vendors).css;
	return gulp.src(vendors)
		.pipe(concat('vendors.css'))
		.pipe(gulp.dest(config.dir.serve));
}
function copyAssets() {
	return gulp.src(config.dir.client + '/assets/**/*', { since: gulp.lastRun(copyAssets) })
		.pipe(debug({ title: 'Copying Assets' }))
		.pipe(gulp.dest(config.dir.serve + '/assets/'));
}
function copyWebmanifest() {
	return gulp.src(config.dir.client + '/manifest.json', { since: gulp.lastRun(copyWebmanifest) })
		.pipe(debug({ title: 'Copying Webmanifest' }))
		.pipe(gulp.dest(config.dir.serve));
}
function copyHTML() {
	return gulp.src(config.dir.client + '/**/*.html', { since: gulp.lastRun(copyHTML) })
		.pipe(debug({ title: 'Copying HTML' }))
		.pipe(gulp.dest(config.dir.serve));
}
function copyJS() {
	return gulp.src(config.dir.client + '/*.js', { since: gulp.lastRun(copyJS) })
		.pipe(gulp.dest(config.dir.serve));
}

function transpileLESS() {
	return gulp.src(config.dir.client + '/**/*.less')
		.pipe(sourcemaps.init())
		.pipe(less({
			paths: [path.join(__dirname, 'styles')]
		}))
		.pipe(concat('styles.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.dir.serve))
		.pipe(bs.stream());
}

function clean() {
	return del([config.dir.tmp]);
}

function watch() {
	gulp.watch(config.dir.client + '/**/*.ts', gulp.series(transpileTS, reload));
	gulp.watch(config.dir.client + '/**/*.html', gulp.series(copyHTML, reload));
	gulp.watch(config.dir.client + '/**/*.js', gulp.series(copyJS, reload));
	gulp.watch(config.dir.client + '/**/*.less', transpileLESS);
}

function serve() {
	bs.init({
		server: {
			baseDir: config.dir.serve,
			routes: {
				'/node_modules': 'node_modules',
				'/.tmp/serve/assets': 'assets'
			}
		}
	});
}

//-- TODO
function bundle() {
	return gulp.src('.tmp/serve/boot.js')
		.pipe(debug({ title: 'rollup' }))
		.pipe(rollup({
			format: 'es'
		}))
		.pipe(gulp.dest('.tmp/'))
}
exports.bundle = bundle;
//--

var parallel = gulp.parallel(
	copyAssets,
	copyWebmanifest,
	copyHTML,
	copyJS,
	bundleVendorsJS,
	bundleVendorsCSS,
	transpileLESS,
	transpileTS
);
var build = gulp.series(clean, parallel, serve);

gulp.task('default', gulp.parallel(build, watch));