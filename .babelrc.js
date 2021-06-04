const presets = [
  [
    "@babel/env",
    // {
    //   "modules": false, // >= babel 7
    //   "useBuiltIns": "usage" // false / entry / usage
    // }
  ],
  "@babel/preset-react",
  // '@babel/preset-typescript'
];
const plugins = [
  "@babel/plugin-external-helpers",
  "@babel/plugin-transform-runtime",
  "@babel/plugin-proposal-object-rest-spread",
  "@babel/plugin-proposal-class-properties",
  "@babel/plugin-proposal-numeric-separator",
  // ["@babel/plugin-transform-runtime", { useESModules: false }],
  // ['@babel/plugin-transform-modules-umd']
];

module.exports = { presets, plugins };
