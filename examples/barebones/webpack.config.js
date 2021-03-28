const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  target: "webworker",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "worker.mjs",
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "module",
    },
    clean: true,
  },
  experiments: {
    outputModule: true,
  },
};
