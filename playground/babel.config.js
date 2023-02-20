//module.exports = {
   // presets: [
//      ['@babel/preset-env', {targets: {node: 'current'}}],
//      '@babel/preset-typescript',
//    ],
//  };
module.exports = {
  env: {
    test: {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: "current",
            },
            modules: "commonjs",
          },
        ],
      ],
      plugins: [
        [
          "@babel/plugin-transform-modules-commonjs",
          {
            importInterop: "node",
          },
        ],
      ],
    },
  },
};
