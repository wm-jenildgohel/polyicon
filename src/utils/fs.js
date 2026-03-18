const fse = require("fs-extra");

async function ensureDir(dirPath) {
  if (!dirPath || dirPath === ".") return;
  await fse.ensureDir(dirPath);
}

async function ensureFile(filePath) {
  await fse.ensureFile(filePath);
}

async function writeJson(filePath, data) {
  await fse.ensureFile(filePath);
  await fse.writeJSON(filePath, data);
}

module.exports = {
  ensureDir,
  ensureFile,
  writeJson
};
