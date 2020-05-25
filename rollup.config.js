import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';
import serve from 'rollup-plugin-serve';
import json from '@rollup/plugin-json';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.ts',
		output: {
			name: 'Skedj',
			file: pkg.browser,
			format: 'umd',
			intro: 'const global = window;' // https://github.com/rollup/rollup-plugin-commonjs/issues/6#issuecomment-519537010
		},
		plugins: [
			resolve(),   // so Rollup can find `ms`
			commonjs(),  // so Rollup can convert `ms` to an ES module
			typescript(), // so Rollup can convert TypeScript to JavaScript
			serve('dist'), // run server from dist directory for testing
			json(),
			globals(),
			builtins()
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
		plugins: [
			typescript(), // so Rollup can convert TypeScript to JavaScript
			json(),
			builtins()
		],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
];
