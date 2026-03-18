const fse = require("fs-extra");
const path = require("path");
const { ensureDir } = require("../utils/fs");
const { FONT_NAME, CLASS_PREFIX } = require("../constants");

async function writeHtml({ tmpPath, outputFontsPath, glyphs }) {
  const outputDir = path.dirname(outputFontsPath);
  const fontsSubDir = path.basename(outputFontsPath);

  let css = await fse.readFile(
    path.resolve(tmpPath, `${FONT_NAME}.css`),
    "utf8"
  );

  css = css.replace(
    /url\((['"]?)([^'")\s]+\.(eot|woff2?|ttf|svg)[^'")\s]*)\1\)/gi,
    (_, quote, href) => {
      const q = quote || "'";
      const file = href.split("?")[0];
      const query = href.includes("?") ? "?" + href.split("?")[1] : "";
      return `url(${q}${fontsSubDir}/${path.basename(file)}${query}${q})`;
    }
  );

  const items = glyphs
    .map((g) => {
      const name = g["glyph-name"];
      const className = `${CLASS_PREFIX}-${name}`;
      const code = g.unicode.codePointAt(0).toString(16).padStart(4, "0");
      return `        <div class="icon-card" data-class="${CLASS_PREFIX} ${className}" data-name="${className}">
          <div class="icon-preview">
            <i class="${CLASS_PREFIX} ${className}"></i>
          </div>
          <div class="icon-info">
            <span class="icon-name" title="${className}">${name}</span>
            <span class="icon-code">U+${code.toUpperCase()}</span>
          </div>
          <button class="copy-btn" title="Copy class name">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
          <div class="copied-badge">Copied!</div>
        </div>`;
    })
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${FONT_NAME} — Icon Preview</title>
  <style>
${css}

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f0f2f5;
      color: #1a1a1a;
      min-height: 100vh;
    }

    /* ── Header ── */
    .header {
      background: #fff;
      border-bottom: 1px solid #e5e7eb;
      padding: 28px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .header-left h1 {
      font-size: 20px;
      font-weight: 700;
      color: #111;
      letter-spacing: -0.3px;
    }
    .header-left p {
      font-size: 13px;
      color: #6b7280;
      margin-top: 2px;
    }
    .search-wrap {
      position: relative;
      flex: 0 0 260px;
    }
    .search-wrap svg {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      pointer-events: none;
    }
    #search {
      width: 100%;
      padding: 8px 12px 8px 34px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 13px;
      outline: none;
      background: #f9fafb;
      transition: border-color 0.15s, background 0.15s;
    }
    #search:focus { border-color: #6366f1; background: #fff; }

    /* ── Grid ── */
    .grid-wrap { padding: 32px 40px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 12px;
    }
    .empty-msg {
      display: none;
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 0;
      color: #9ca3af;
      font-size: 14px;
    }

    /* ── Icon card ── */
    .icon-card {
      position: relative;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 20px 12px 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;
      overflow: hidden;
    }
    .icon-card:hover {
      border-color: #6366f1;
      box-shadow: 0 4px 16px rgba(99,102,241,0.12);
      transform: translateY(-1px);
    }
    .icon-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
    }
    .icon-preview i { font-size: 30px; color: #374151; transition: color 0.15s; }
    .icon-card:hover .icon-preview i { color: #6366f1; }
    .icon-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      width: 100%;
    }
    .icon-name {
      font-size: 11px;
      color: #374151;
      font-weight: 500;
      text-align: center;
      word-break: break-all;
      line-height: 1.4;
      max-width: 100%;
    }
    .icon-code {
      font-size: 10px;
      color: #9ca3af;
      font-family: "SF Mono", "Fira Code", monospace;
    }

    /* ── Copy button ── */
    .copy-btn {
      position: absolute;
      top: 7px;
      right: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: transparent;
      border: none;
      border-radius: 5px;
      color: #9ca3af;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.15s, background 0.15s, color 0.15s;
    }
    .icon-card:hover .copy-btn { opacity: 1; }
    .copy-btn:hover { background: #f3f4f6; color: #6366f1; }

    /* ── Copied badge ── */
    .copied-badge {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(99,102,241,0.92);
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      border-radius: 10px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s;
    }
    .icon-card.copied .copied-badge { opacity: 1; }

    /* ── Footer ── */
    .footer {
      text-align: center;
      padding: 24px;
      color: #9ca3af;
      font-size: 11px;
      border-top: 1px solid #e5e7eb;
      background: #fff;
    }
  </style>
</head>
<body>

  <header class="header">
    <div class="header-left">
      <h1>${FONT_NAME}</h1>
      <p id="count">${glyphs.length} icon${glyphs.length !== 1 ? "s" : ""}</p>
    </div>
    <div class="search-wrap">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input id="search" type="text" placeholder="Search icons…" autocomplete="off" />
    </div>
  </header>

  <main class="grid-wrap">
    <div class="grid" id="grid">
${items}
      <div class="empty-msg" id="empty">No icons match your search.</div>
    </div>
  </main>

  <footer class="footer">Generated by polyicon &nbsp;·&nbsp; ${glyphs.length} icons total</footer>

  <script>
    const cards = Array.from(document.querySelectorAll('.icon-card'));
    const search = document.getElementById('search');
    const empty = document.getElementById('empty');
    const count = document.getElementById('count');
    const total = ${glyphs.length};

    // Copy on card click or copy-btn click
    function copyClass(card, e) {
      e.stopPropagation();
      const cls = card.dataset.name;
      navigator.clipboard.writeText(cls).then(() => {
        card.classList.add('copied');
        setTimeout(() => card.classList.remove('copied'), 1200);
      });
    }

    cards.forEach(card => {
      card.addEventListener('click', e => copyClass(card, e));
      card.querySelector('.copy-btn').addEventListener('click', e => copyClass(card, e));
    });

    // Search filter
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach(card => {
        const match = !q || card.dataset.name.toLowerCase().includes(q);
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      empty.style.display = visible === 0 ? 'block' : 'none';
      count.textContent = q
        ? visible + ' of ' + total + ' icon' + (total !== 1 ? 's' : '')
        : total + ' icon' + (total !== 1 ? 's' : '');
    });
  </script>

</body>
</html>`;

  await ensureDir(outputDir);
  await fse.writeFile(
    path.resolve(outputDir, `${FONT_NAME}-preview.html`),
    html,
    "utf8"
  );
}

module.exports = { writeHtml };
