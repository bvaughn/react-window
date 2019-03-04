import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import postprocess from 'rollup-plugin-postprocess';
import { readFileSync } from 'fs';

import pkg from './package.json';

// This file controls protected/private property mangling so that minified builds have consistent property names.
const mangle = JSON.parse(readFileSync('./mangle.json', 'utf8'));
const postprocessConfig = Object.entries(mangle);

const input = './src/index.js';

const external = id => !id.startsWith('.') && !id.startsWith('/');

export default [
  {
    input,
    output: {
      file: pkg.main,
      format: 'cjs',
    },
    external,
    plugins: [
      babel({
        runtimeHelpers: true,
        plugins: ['@babel/transform-runtime'],
      }),
      nodeResolve(),
      commonjs(),
      postprocess(postprocessConfig),
    ],
  },

  {
    input,
    output: {
      file: pkg.module,
      format: 'esm',
    },
    external,
    plugins: [
      babel({
        runtimeHelpers: true,
        plugins: [['@babel/transform-runtime', { useESModules: true }]],
      }),
      nodeResolve(),
      commonjs(),
      postprocess(postprocessConfig),
    ],
  },
];
