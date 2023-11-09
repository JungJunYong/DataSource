import {nodeResolve} from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";


export default {
    input: 'DataSource.ts',
    output: {
        file: 'dist/bundle.js',
        format: 'iife'
    },
    plugins: [
        nodeResolve({ module: true, jsnext: true, main: true, browser: true }),
        commonjs({extensions: [".js", ".ts"]}),
        json(),
        typescript()
    ]
}