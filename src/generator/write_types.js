const fse = require("fs-extra");
const path = require("path");
const { toConstName } = require("../utils/strings");
const { ensureFile } = require("../utils/fs");

async function writeTypes({ outputTypesPath, glyphs }) {
  const isTypescript = outputTypesPath.endsWith(".ts");
  let types = "";

  glyphs.forEach((glyph, index) => {
    const line = isTypescript
      ? `\t${toConstName(glyph["glyph-name"])} = '${glyph["glyph-name"]}',`
      : `\t${toConstName(glyph["glyph-name"])}: '${glyph["glyph-name"]}',`;
    types += line;
    if (index < glyphs.length - 1) types += "\n";
  });

  const content = isTypescript
    ? `enum IconTypes { ${types} } export default IconTypes; `
    : `const IconTypes = { ${types} }; export default IconTypes; `;

  await ensureFile(outputTypesPath);
  await fse.writeFile(outputTypesPath, content, "utf8");
}

module.exports = {
  writeTypes
};
