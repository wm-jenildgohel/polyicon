function toConstName(value) {
  let staticName = String(value).toUpperCase();
  while (staticName.indexOf("-") > -1) {
    staticName = staticName.replace("-", "_");
  }
  return staticName;
}

module.exports = {
  toConstName
};
