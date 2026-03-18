const fs = require("fs");
const { loadConfig } = require("../../config/load");
const { buildIcons } = require("../../generator");
const { resolveFromCwd } = require("../../utils/paths");

async function generateCommand({ configPath }) {
  const absConfig = resolveFromCwd(configPath);
  if (!fs.existsSync(absConfig)) {
    throw new Error(`Missing config: ${configPath}. Run \`polyicon init\`.`);
  }
  const conf = loadConfig(absConfig);
  if (!conf.svg) {
    throw new Error("Missing `svg` path in config. Set it to your SVG folder.");
  }
  const absSvg = resolveFromCwd(conf.svg);
  if (!fs.existsSync(absSvg)) {
    throw new Error(
      `SVG path not found: ${conf.svg}. Update \`svg\` in ${configPath}.`
    );
  }
  await buildIcons(conf);
  console.log(`Done. Generated ${conf.outputFonts} and preview HTML.`);
}

module.exports = {
  generateCommand
};
