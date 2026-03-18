const { WEBSITE, FONT_NAME, CLASS_PREFIX } = require("../constants");

async function runSvgToFont({ svgPath, tmpPath }) {
  const mod = await import("svgtofont");
  const svgtofont = mod.default;
  await svgtofont({
    src: svgPath,
    dist: tmpPath,
    fontName: FONT_NAME,
    css: true,
    classNamePrefix: CLASS_PREFIX,
    website: WEBSITE,
    svgicons2svgfont: {
      fontHeight: 1000,
      normalize: true
    }
  });
}

module.exports = {
  runSvgToFont
};
