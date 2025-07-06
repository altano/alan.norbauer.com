const autoprefixer = require("autoprefixer");
const customMedia = require("postcss-custom-media");
const postcssGlobalData = require("@csstools/postcss-global-data");

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    postcssGlobalData({
      files: ["./src/styles/global/custom-media-queries.css"],
    }),
    autoprefixer,
    customMedia,
  ],
};

module.exports = config;
