const path = require("path");

function resolveFromCwd(inputPath) {
  if (!inputPath) return inputPath;
  if (path.isAbsolute(inputPath)) return inputPath;
  return path.resolve(process.cwd(), inputPath);
}

module.exports = {
  resolveFromCwd
};
