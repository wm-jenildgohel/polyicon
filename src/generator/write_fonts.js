const fse = require("fs-extra");
const path = require("path");
const { ensureDir } = require("../utils/fs");
const { FONT_NAME } = require("../constants");

async function writeFonts({ tmpPath, outputFontsPath, formats }) {
  await ensureDir(outputFontsPath);

  const copyIf = async (ext) => {
    await fse.copy(
      path.resolve(tmpPath, `${FONT_NAME}.${ext}`),
      path.resolve(outputFontsPath, `${FONT_NAME}.${ext}`)
    );
  };

  if (formats.includes("svg")) await copyIf("svg");
  if (formats.includes("ttf")) await copyIf("ttf");
  if (formats.includes("woff")) await copyIf("woff");
  if (formats.includes("woff2")) await copyIf("woff2");
  if (formats.includes("eot")) await copyIf("eot");
}

module.exports = {
  writeFonts
};
