import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, format: 'cjs'},
    { file: pkg.module, format: 'es'}
  ],
  external: ['co-body'], 
  plugins: [
    typescript({ useTsconfigDeclarationDir: true }),
    commonjs(),
  ]
};
