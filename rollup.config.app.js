import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

export default {
	input: '.tmp/serve/boot.js',
	treeshake: true,
	output: {
		name: 'main',
		sourcemap: true
	},
	plugins: [
		commonjs({
			include: 'node_modules/rxjs/**',
		}),
		nodeResolve({
			jsnext: true, main: true, module: true
		}),
		uglify()
	]
};