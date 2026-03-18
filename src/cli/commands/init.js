const fs = require("fs");
const path = require("path");
const { DEFAULT_CONFIG } = require("../../config/defaults");
const { resolveFromCwd } = require("../../utils/paths");
const { ensureDir } = require("../../utils/fs");

async function initCommand({ configPath, force }) {
  const targetPath = resolveFromCwd(configPath);
  if (fs.existsSync(targetPath) && !force) {
    throw new Error(
      `Config already exists at ${configPath}. Use --force to overwrite.`
    );
  }

  await ensureDir(path.dirname(targetPath));
  fs.writeFileSync(targetPath, JSON.stringify(DEFAULT_CONFIG, null, 2) + "\n");

}

module.exports = {
  initCommand
};
