// 支持typescript
import typescript from "@rollup/plugin-typescript";
// 用于打包生成*.d.ts文件 前提: allowJs: true [ https://github.com/Swatinem/rollup-plugin-dts ]
// 官方插件存在问题无法生成 https://github.com/rollup/plugins/issues/394
import dts from "rollup-plugin-dts";
// babel插件用于处理es6代码的转换，使转换出来的代码可以用于不支持es6的环境使用
import babel from "@rollup/plugin-babel";
// resolve将我们编写的源码与依赖的第三方库进行合并
import resolve from "@rollup/plugin-node-resolve";
// 解决rollup.js无法识别CommonJS模块
import commonjs from "@rollup/plugin-commonjs";
// 支持引入JSON [ https://github.com/rollup/plugins/tree/master/packages/json ]
import json from "@rollup/plugin-json";
// 全局替换变量比如process.env
import replace from "@rollup/plugin-replace";
// 可以处理组件中import图片的方式，将图片转换成base64格式，但会增加打包体积，适用于小图标
import image from "@rollup/plugin-image";
// 压缩打包代码
import { terser } from "rollup-plugin-terser";

// node
import glob from "glob";
import path from "path";
import fs from "fs";

// 引入package
import { version, name, description, author, typings, module, browser, main } from "./package.json";

// helper
// 入口生成
const getEntries = function (pathPattern = "./src/components/**/*.*(jsx|js|ts|tsx)", excludes = ["interfaces"]) {
  const collections = {};

  const files = glob.sync(pathPattern);

  for (let item of files) {
    const { ext, name } = path.parse(item);

    if (excludes.includes(name)) {
      continue;
    }

    const relativePath = path.relative("./src/components", item);
    collections[relativePath.replace(ext, "")] = path.resolve(__dirname, item);
  }

  return collections;
};

// 环境区分
const isProd = process.env.NODE_ENV === "production";

// 代码注入
const intro = `console.log("${name}:${version}")`;

// [TODO] umd 库名称
const umdName = "ReactWindowTable";

// 不打包外部模块
const external = ["react", "react-dom"],
  // 外部模块名定义
  globals = {
    react: "React",
    "react-dom": "ReactDOM",
  };

// 包描述
const banner = `/* name:${name}\nversion:${version}\nauthor:${author}\ndescription:${description}\n${fs.readFileSync(
  path.join(process.cwd(), "LICENSE")
)} */`;

// 基础插件
const basePlugins = [
  // [TODO]
  // 原本该插件可以直接通过读取tsconfig.json编译typescript，但多入口打包的时候存在问题
  // 所以在.babelrc.js中任然要在presets中增加@babel/preset-typescript
  typescript(),
  commonjs(),
  image(),
  json(),
  // 告诉 Rollup 如何查找外部模块并安装它
  resolve(),
  // babel处理不包含node_modules文件的所有js
  babel({
    exclude: "node_modules/**",
    babelHelpers: "runtime", // https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
    // plugins: ["@babel/plugin-external-helpers"],
    extensions: [".js", ".ts", "tsx"],
  }),
  replace({
    // exclude: 'node_modules/**',
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
  }),
];

// 开发环境需要使用的插件
const devPlugins = [];
// 生产环境需要使用的插件
const prodPlugins = [terser()];

let plugins = [...basePlugins].concat(isProd ? prodPlugins : devPlugins);

// let destFilePath = `index${isProd ? "min" : ""}.js`;

/* 
  需要将tsconfig.json中的 outDir declaration declarationDir 注释掉, 
  https://stackoverflow.com/questions/63441311/rollup-esm-and-umd-builds-with-typescript-plugin-and-declarations-not-possible
  https://github.com/rollup/plugins/issues/243
  反正后2者暂时官方组件无效, 通过dts实现
 */
const configs = [
  // umd
  {
    input: "./src/components/index.ts",
    output: {
      file: browser,
      format: "umd",
      name: umdName,
      banner,
      intro,
      globals,
      sourceMap: !isProd,
      exports: "named",
    },
    external,
    plugins,
  },
  // esm
  {
    input: getEntries(),
    output: {
      dir: path.parse(module).dir,
      format: "esm",
    },
    external,
    plugins,
  },
  // cjs
  {
    input: getEntries(),
    output: {
      dir: path.parse(main).dir,
      format: "cjs",
    },
    external,
    plugins,
  },
  // d.ts
  {
    input: "src/components/index.ts",
    output: [
      {
        file: `${typings}`,
        format: "esm",
      },
    ],
    plugins: [dts()],
  },
];

export default configs;
