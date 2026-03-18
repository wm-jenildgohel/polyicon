# Polyicon

SVG to icon font generator with HTML preview — Fontello-style output for React and web projects.

Converts a folder of SVGs into `woff2`, `woff`, `ttf`, `eot`, `svg` font files plus a CSS file, a TypeScript/JS types file, and an interactive HTML preview page.

## Install

```bash
# project dev dependency
npm i -D polyicon

# or global
npm i -g polyicon

# or one-off
npx polyicon init
```

## Quick Start

```bash
polyicon init      # creates .polyiconrc with defaults
polyicon generate  # builds fonts, CSS, types, and preview
```

Place your SVGs in the folder specified by `svg` in `.polyiconrc`, then run `generate`. Output folders are created automatically.

## Config (`.polyiconrc`)

```json
{
  "svg": "./src/assets/svg",
  "outputFonts": "./src/assets/fontello/font",
  "outputStyles": "./src/assets/fontello/css/polyicon.css",
  "outputTypes": "./src/types/IconTypes.js",
  "polyiconConfig": "./src/assets/fontello/config.json",
  "importFontsPath": "../font/",
  "formats": ["eot", "svg", "ttf", "woff", "woff2"]
}
```

| Field | Required | Description |
|---|---|---|
| `svg` | ✓ | Folder containing your `.svg` files |
| `outputFonts` | ✓ | Where font files are written |
| `outputStyles` | | CSS file output path |
| `outputTypes` | ✓ | JS or TS types file output path |
| `polyiconConfig` | | Fontello-compatible `config.json` output path |
| `importFontsPath` | | Font URL prefix in the generated CSS (e.g. `../font/`) |
| `formats` | | Font formats to generate (default: all five) |

SVG filenames become CSS class names. Spaces and special characters are auto-sanitised to hyphens. Use clean, single-colour SVGs — icon fonts are monochrome.

## Output

```
src/assets/fontello/
  polyicon-preview.html   ← interactive icon browser
  css/
    polyicon.css
  font/
    polyicon.eot
    polyicon.svg
    polyicon.ttf
    polyicon.woff
    polyicon.woff2
  config.json
src/types/
  IconTypes.js
```

Open `polyicon-preview.html` in a browser to browse all generated icons, search by name, and click any card to copy its class name to the clipboard.

## Usage in React

Import the generated CSS once (e.g. in your root component or entry file):

```jsx
import "./assets/fontello/css/polyicon.css";
```

Use icons by class name:

```jsx
<i className="polyicon polyicon-home" />
```

Or with the generated types for autocomplete:

```jsx
import IconTypes from "./types/IconTypes";

<i className={`polyicon polyicon-${IconTypes.HOME}`} />
```

## Programmatic API

```js
const { buildIcons } = require("polyicon");

await buildIcons({
  svg: "./src/assets/svg",
  outputFonts: "./dist/fonts",
  outputStyles: "./dist/polyicon.css",
  outputTypes: "./src/types/IconTypes.js",
  importFontsPath: "./fonts/",
  formats: ["woff2", "woff", "ttf"]
});
```

## CLI

```
polyicon init       Create .polyiconrc
polyicon generate   Generate fonts, CSS, types, and preview

Options:
  -c, --config   Path to config (default: .polyiconrc)
  -f, --force    Overwrite config on init
```
