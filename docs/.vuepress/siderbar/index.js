const mongodbSiderbar = require("./mongodb");
const puppeteerSiderbar = require("./puppeteer");

module.exports = {
  "/mongodb/": mongodbSiderbar,
  "/puppeteer/": puppeteerSiderbar
};
