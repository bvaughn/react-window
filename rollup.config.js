import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

const input = './src/index.js';

const external = id => !id.startsWith('.') && !id.startsWith('/');

const terserConfig = {
  mangle: {
    properties: {
      regex: /^_/
    }
  },
  output: { comments: true },
  toplevel: true,
};

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
      terser(terserConfig),
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
      terser(terserConfig),
    ],
  },
];
