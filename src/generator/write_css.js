const fse = require("fs-extra");
const path = require("path");
const { ensureDir } = require("../utils/fs");
const { FONT_NAME } = require("../constants");

async function writeCss({ tmpPath, outputStylesPath, importFontsPath }) {
  if (!outputStylesPath) return;

  await ensureDir(path.dirname(outputStylesPath));

  let css = await fse.readFile(
    path.resolve(tmpPath, `${FONT_NAME}.css`),
    "utf8"
  );

  while (css.indexOf(`url('${FONT_NAME}`) > -1) {
    css = css.replace(
      `url('${FONT_NAME}`,
      `url('${importFontsPath}${FONT_NAME}`
    );
  }
  while (css.indexOf(`url("${FONT_NAME}`) > -1) {
    css = css.replace(
      `url("${FONT_NAME}`,
      `url("${importFontsPath}${FONT_NAME}`
    );
  }

  await fse.writeFile(outputStylesPath, css, "utf8");
}

module.exports = {
  writeCss
};
