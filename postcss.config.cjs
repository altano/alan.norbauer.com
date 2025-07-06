const autoprefixer = require("autoprefixer");
const customMedia = require("postcss-custom-media");
const postcssGlobalData = require("@csstools/postcss-global-data");
const mixins = require("postcss-mixins");

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    postcssGlobalData({
      files: ["./src/styles/global/custom-media-queries.css"],
    }),
    mixins({
      mixinsFiles: ["./src/styles/global/mixins.css"],
    }),
    autoprefixer,
    customMedia,
  ],
};

module.exports = config;
