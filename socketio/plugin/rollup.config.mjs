import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { readFileSync } from "fs";
import typescript from '@rollup/plugin-typescript';
const pkg = JSON.parse(readFileSync('package.json', {encoding: 'utf8'}));
// import css from "rollup-plugin-import-css";
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';


export default [
	// browser-friendly UMD build
	{
		input: 'src/main.ts',
		output: {
			name: 'SAWDVoiceCommand',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			postcss({
				extensions: [ '.css' ],
			}),
			typescript(),

			resolve({
				browser: true
			}), // so Rollup can find `ms`

			commonjs(), // so Rollup can convert `ms` to an ES module
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/main.ts',
		external: ['ms'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		plugins: [
			postcss({
				extensions: [ '.css' ],
			}),
			typescript()
		]
	}
];
