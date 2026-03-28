import { defineConfig } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { nodeExternals } from "rollup-plugin-node-externals";
import typescript from "@rollup/plugin-typescript";
import json from '@rollup/plugin-json'; 
export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "cjs",
    entryFileNames: "[name].cjs",
    banner: "#!/usr/bin/env node\n",
  },
  plugins: [
    nodeExternals(),
    nodeResolve({
      extensions: [".ts", ".js"],
    }),
    // ✨ 重点 1：明确告诉插件包含哪些文件，并开启清理模式
    typescript({
      tsconfig: "./tsconfig.json",
      outDir: 'dist', 
      declarationDir: 'dist', 
      compilerOptions: {
        moduleResolution: "bundler",
      },
    }),
    // ✨ 重点 2：NodeResolve 必须在 TS 之后，且包含后缀名支持
    json(),
    commonjs(),
  ],
});
