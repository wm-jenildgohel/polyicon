const fse = require("fs-extra");
const { XMLParser } = require("fast-xml-parser");
const path = require("path");
const { FONT_NAME } = require("../constants");

async function parseGlyphs(tmpPath) {
  const svgPath = path.resolve(tmpPath, `${FONT_NAME}.svg`);
  const svg = await fse.readFile(svgPath, "utf8");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    processEntities: true,
    htmlEntities: true
  });
  const json = parser.parse(svg);
  const defs = json && json.svg && json.svg.defs ? json.svg.defs : null;
  let font = defs && defs.font ? defs.font : null;
  if (Array.isArray(font)) font = font[0];
  let glyphs = font && font.glyph ? font.glyph : null;
  if (!glyphs) {
    throw new Error(`No glyphs found in ${svgPath}.`);
  }
  if (!(glyphs instanceof Array)) glyphs = [glyphs];

  const normalizeUnicode = (value) => {
    if (typeof value !== "string") return value;
    if (value.startsWith("&#x") && value.endsWith(";")) {
      const code = parseInt(value.slice(3, -1), 16);
      if (!Number.isNaN(code)) return String.fromCharCode(code);
    }
    if (value.startsWith("&#") && value.endsWith(";")) {
      const code = parseInt(value.slice(2, -1), 10);
      if (!Number.isNaN(code)) return String.fromCharCode(code);
    }
    return value;
  };

  glyphs = glyphs.map((g) => {
    if (!g) return g;
    const unicode = normalizeUnicode(g.unicode);
    return { ...g, unicode };
  });

  const invalid = glyphs.filter(
    (g) => !g || !g["glyph-name"] || !g.unicode
  );
  if (invalid.length) {
    throw new Error(
      `Invalid glyphs in ${svgPath}. Expected glyph-name and unicode attributes.`
    );
  }
  return glyphs;
}

module.exports = {
  parseGlyphs
};
