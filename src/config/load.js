const fs = require("fs");

function loadConfig(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    const message = err && err.message ? err.message : "Invalid JSON";
    throw new Error(`Invalid JSON in ${filePath}: ${message}`);
  }
}

module.exports = {
  loadConfig
};
