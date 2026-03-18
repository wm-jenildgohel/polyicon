const path = require("path");
const fse = require("fs-extra");
const { TMP_DIR } = require("../constants");
const { resolveFromCwd } = require("../utils/paths");
const { runSvgToFont } = require("./run_svgtofont");
const { parseGlyphs } = require("./parse_svg");
const { writeTypes } = require("./write_types");
const { writeCss } = require("./write_css");
const { writeFonts } = require("./write_fonts");
const { writeHtml } = require("./write_html");
const { writePolyiconConfig } = require("./write_polyicon_config");

async function buildIcons(conf) {
  const svgPath = resolveFromCwd(conf.svg);
  const outputFontsPath = resolveFromCwd(conf.outputFonts);
  const outputTypesPath = resolveFromCwd(conf.outputTypes);
  const outputStylesPath = conf.outputStyles
    ? resolveFromCwd(conf.outputStyles)
    : null;
  const polyiconConfigPath = conf.polyiconConfig
    ? resolveFromCwd(conf.polyiconConfig)
    : null;
  const importFontsPath = conf.importFontsPath || "";
  const formats = conf.formats || ["eot", "svg", "ttf", "woff", "woff2"];
  const tmpPath = path.resolve(process.cwd(), TMP_DIR);
  const tmpSvgPath = path.resolve(process.cwd(), `${TMP_DIR}_svgs`);

  await fse.ensureDir(tmpSvgPath);
  const svgFiles = (await fse.readdir(svgPath)).filter((file) =>
    file.toLowerCase().endsWith(".svg")
  );
  if (!svgFiles.length) {
    throw new Error(`No SVG files found in ${svgPath}.`);
  }

  const seen = new Map();
  const sanitizeName = (name) => {
    let safe = name
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!safe) safe = "icon";
    if (/^\d/.test(safe)) safe = `icon-${safe}`;
    return safe;
  };

  for (const file of svgFiles) {
    const inputPath = path.resolve(svgPath, file);
    const baseName = path.basename(file, ".svg");
    const safeBase = sanitizeName(baseName);
    if (seen.has(safeBase)) {
      throw new Error(
        `Duplicate icon name after sanitizing: "${baseName}" conflicts with "${seen.get(
          safeBase
        )}". Rename one of the SVG files.`
      );
    }
    seen.set(safeBase, baseName);
    const outputPath = path.resolve(tmpSvgPath, `${safeBase}.svg`);
    const raw = await fse.readFile(inputPath, "utf8");
    const cleaned = raw
      .replace(/<defs[\s\S]*?<\/defs>/gi, "")
      .replace(/\sclip-path="[^"]*"/gi, "")
      .replace(/\sclip-path='[^']*'/gi, "")
      .replace(/\sfilter="[^"]*"/gi, "")
      .replace(/\sfilter='[^']*'/gi, "")
      .replace(/\smask="[^"]*"/gi, "")
      .replace(/\smask='[^']*'/gi, "")
      // Remove common background rects that create square glyphs.
      .replace(
        /<rect\b[^>]*fill=["'](?:#fff|#ffffff|white)["'][^>]*\/?>/gi,
        ""
      )
      .replace(/<\/rect>/gi, "");
    const pathTags =
      cleaned.match(/<path\b[^>]*\/?>/gi) ||
      cleaned.match(/<path\b[^>]*>[\s\S]*?<\/path>/gi);
    let outputSvg = cleaned;
    if (pathTags && pathTags.length) {
      const viewBoxMatch = cleaned.match(/viewBox="([^"]+)"/i);
      const viewBoxAttr = viewBoxMatch ? ` viewBox="${viewBoxMatch[1]}"` : "";
      outputSvg = `<svg xmlns="http://www.w3.org/2000/svg"${viewBoxAttr}>${pathTags.join(
        ""
      )}</svg>`;
    }
    await fse.writeFile(outputPath, outputSvg, "utf8");
  }

  await runSvgToFont({ svgPath: tmpSvgPath, tmpPath });
  const glyphs = await parseGlyphs(tmpPath);

  await writeTypes({ outputTypesPath, glyphs });
  await writePolyiconConfig({ outputPath: polyiconConfigPath, glyphs });
  await writeCss({
    tmpPath,
    outputStylesPath,
    importFontsPath
  });
  await writeFonts({ tmpPath, outputFontsPath, formats });
  await writeHtml({ tmpPath, outputFontsPath, glyphs });

  await fse.remove(tmpPath);
  await fse.remove(tmpSvgPath);
}

module.exports = {
  buildIcons
};
