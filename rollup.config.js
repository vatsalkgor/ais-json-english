import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
// minify
import { terser } from "rollup-plugin-terser"
import pkg from './package.json'

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		external: ['serialport'],
		output: [
      { name: pkg.name, file: pkg.browser, format: 'cjs' },
      { file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
    ],
		plugins: [
      json(),
			resolve(),
			commonjs(),
			terser()
		]
	}
]