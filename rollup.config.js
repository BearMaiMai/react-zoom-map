import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.js", // 入口文件
  output: [
    {
      file: "lib/index.esm.js", // ES模块输出
      format: "es",
      sourcemap: true, // 生成SourceMap
    },
    {
      file: "lib/index.cjs.js", // CommonJS输出
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(), // 自动排除peerDependencies
    resolve({ extensions: [".js", ".jsx", ".ts", ".tsx"] }), // 解析node_modules模块
    typescript({
      tsconfig: "./tsconfig.json", // 指定 TS 配置文件
      declaration: true,
      declarationDir: "lib",
      jsx: "react", // 启用 JSX 支持
      noEmitOnError: true, // 确保 TS 错误时终止构建，避免生成无效 JS 文件
    }),
    postcss({
      sass:{
        api:'modern-compiler'
      },
      inject: true, // 关键：将 CSS 注入 JS 中
      modules: false, // 禁用 CSS Modules 以避免 hash 函数问题
      extract: false, // 禁止生成独立 CSS 文件
    }),
    commonjs(), // 转换CommonJS为ES模块
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**", // 排除node_modules
    }),
    terser(), // 代码压缩
  ],
  external: ["react", "react-dom", "ahooks", "react-zoom-pan-pinch"], // 保持外部依赖
};