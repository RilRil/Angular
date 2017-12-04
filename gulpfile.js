const gulp = require('gulp');
const serve = require('gulp-serve');
const concat = require('gulp-concat');
const exec = require('child_process').exec;


const config = {
	dir: {
		tmp: './.tmp/',
		serve: './.tmp/serve',
		client: './client/',
		npm: './node_modules/'
	},
	vendors: './build/vendors.json'
}

gulp.task('scripts:vendors', function () {
	let vendors = require(config.vendors).vendors;
	return gulp.src(vendors)
		.pipe(concat('vendors.js'))
		.pipe(gulp.dest(config.dir.serve));
});

gulp.task('scripts', ['scripts:vendors']);

gulp.task('html', function () {
	return gulp.src('client/**/*.html')
		.pipe(gulp.dest(config.dir.serve));
})

gulp.task('serve', serve([config.dir.serve, config.dir.client]));

gulp.task('alias', function (cb) {
	exec('ln -s node_modules/ .tmp/serve', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
})

gulp.task('default', ['alias', 'html', 'scripts', 'serve']);