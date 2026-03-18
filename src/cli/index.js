const { initCommand } = require("./commands/init");
const { generateCommand } = require("./commands/generate");

function getFlagValue(args, longName, shortName) {
  const longIndex = args.indexOf(longName);
  if (longIndex !== -1 && args[longIndex + 1]) return args[longIndex + 1];
  const shortIndex = shortName ? args.indexOf(shortName) : -1;
  if (shortIndex !== -1 && args[shortIndex + 1]) return args[shortIndex + 1];
  return null;
}

function hasFlag(args, flag) {
  return args.includes(flag);
}

function printHelp() {
  console.log("polyicon <command>");
  console.log("");
  console.log("Commands:");
  console.log("  init           Create .polyiconrc");
  console.log("  generate       Generate fonts and types");
  console.log("");
  console.log("Options:");
  console.log("  -c, --config   Path to config (default: ./.polyiconrc)");
  console.log("  -f, --force    Overwrite config on init");
}

async function run(argv) {
  const args = argv.slice(2);
  const command = args[0];
  const configPath = getFlagValue(args, "--config", "-c") || ".polyiconrc";
  const force = hasFlag(args, "--force") || hasFlag(args, "-f");

  try {
    if (command === "init") {
      await initCommand({ configPath, force });
      console.log(`Created ${configPath}`);
      console.log(
        "Place SVGs in ./src/assets/svg and run `polyicon generate`."
      );
      return;
    }

    if (command === "generate") {
      await generateCommand({ configPath });
      return;
    }

    printHelp();
    process.exit(command ? 1 : 0);
  } catch (err) {
    console.error(err && err.message ? err.message : err);
    process.exit(1);
  }
}

module.exports = {
  run
};
