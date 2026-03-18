const { ensureFile, writeJson } = require("../utils/fs");
const { FONT_NAME, CLASS_PREFIX } = require("../constants");

async function writePolyiconConfig({ outputPath, glyphs }) {
  if (!outputPath) return;

  const config = {
    name: FONT_NAME,
    css_prefix_text: `${CLASS_PREFIX}-`,
    css_use_suffix: false,
    hinting: true,
    units_per_em: 1000,
    ascent: 850,
    glyphs: glyphs.map((glyph) => {
      return {
        css: glyph["glyph-name"],
        code: glyph.unicode.codePointAt(0)
      };
    })
  };

  await ensureFile(outputPath);
  await writeJson(outputPath, config);
}

module.exports = {
  writePolyiconConfig
};
