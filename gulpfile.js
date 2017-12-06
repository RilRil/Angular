const gulp = require('gulp');
const concat = require('gulp-concat');
const exec = require('child_process').exec;
const bs = require('browser-sync').create();
const clean = require('gulp-clean');
const ts = require('gulp-typescript');

const config = {
	dir: {
		tmp: './.tmp/',
		serve: './.tmp/serve',
		client: './client/',
		npm: './node_modules/'
	},
	tsconfig: './tsconfig.json',
	vendors: './build/vendors.json'
}


let reload = (done) => {
	bs.reload();
	done();
};
let tsProject = ts.createProject(config.tsconfig);


gulp.task('transpile:ts', function () {
	var tsResult = gulp.src(config.dir.client + '/**/*.ts')
		.pipe(tsProject());

	return tsResult.js.pipe(gulp.dest(config.dir.serve));
});

gulp.task('bundle:vendors', function () {
	let vendors = require(config.vendors).vendors;
	return gulp.src(vendors)
		.pipe(concat('vendors.js'))
		.pipe(gulp.dest(config.dir.serve));
});

gulp.task('bundles', ['bundle:vendors']);


gulp.task('copy', ['copy:html', 'copy:js']);

gulp.task('copy:html', function () {
	return gulp.src(config.dir.client + '/**/*.html')
		.pipe(gulp.dest(config.dir.serve));
})
gulp.task('copy:js', function () {
	return gulp.src(config.dir.client + '/*.js')
		.pipe(gulp.dest(config.dir.serve));
});

gulp.task('clean', function () {
	return gulp.src(config.dir.tmp, { read: false })
		.pipe(clean());
});

gulp.task('ts-watch', ['transpile:ts'], reload);
gulp.task('html-watch', ['copy:html'], reload);
gulp.task('js-watch', ['copy:js'], reload);
gulp.task('watch', function () {
	gulp.watch(config.dir.client + '/**/*.ts', ['ts-watch']);
	gulp.watch(config.dir.client + '/**/*.html', ['html-watch']);
	gulp.watch(config.dir.client + '/**/*.js', ['js-watch']);
});


gulp.task('default', ['copy', 'bundles', 'transpile:ts', 'watch'], function(done) {	
	bs.init({
		server: {
			baseDir: config.dir.serve,
			routes: {
				'/node_modules': 'node_modules'
			}
		}
	});
});