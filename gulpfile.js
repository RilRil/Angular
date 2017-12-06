const gulp = require('gulp');
const concat = require('gulp-concat');
const exec = require('child_process').exec;
const bs = require('browser-sync').create();
const del = require('del');
const ts = require('gulp-typescript');
const debug = require('gulp-debug');

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


function bundleVendors() {
	let vendors = require(config.vendors).vendors;
	return gulp.src(vendors)
		.pipe(concat('vendors.js'))
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

function clean() {
	return del([config.dir.tmp]);
}

function watch() {
	gulp.watch(config.dir.client + '/**/*.ts', gulp.series(transpileTS, reload));
	gulp.watch(config.dir.client + '/**/*.html', gulp.series(copyHTML, reload));
	gulp.watch(config.dir.client + '/**/*.js', gulp.series(copyJS, reload));
}

function serve() {
	bs.init({
		server: {
			baseDir: config.dir.serve,
			routes: {
				'/node_modules': 'node_modules'
			}
		}
	});
}

var parallel = gulp.parallel(copyHTML, copyJS, bundleVendors, transpileTS);
var build = gulp.series(clean, parallel, serve);

gulp.task('default', gulp.parallel(build, watch));