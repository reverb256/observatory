# Editorial Docs Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace VitePress docs with portal-native HTML pages using Pretext for editorial text layout, integrated into CI/CD.

**Architecture:** A Node.js build script (`scripts/build-docs.js`) converts markdown from `packages/docs/` into standalone HTML pages using the portal's template (same `styles.css`, `nav.js`, footer). Pretext (`@chenglou/pretext`) handles text measurement and layout in the browser — code blocks become obstacles that body text flows around, inline badges wrap correctly, and accordion sections expand with pre-calculated heights. Nginx serves the generated pages at `/docs/`.

**Tech Stack:** Node.js build script, `marked` (markdown→HTML), `@chenglou/pretext` (text layout), existing portal CSS (`styles.css`), existing nav (`nav.js`).

---

## Reference

**Existing portal pages to match:** `docs.html` (section-bracket headers, code blocks, tables, FAQ).
**CSS variables:** All in `styles.css` — `--base00` through `--base23`, `--accent` (`#C23030`), `--accent-cyan` (`#0891B2`), `--accent-gold` (`#D4A017`).
**Doc source:** 25 markdown files in `packages/docs/{guide,api,mcp,modules}/`.
**Output:** Flat HTML files in `packages/portal/docs/`.

---

### Task 1: Scaffold Build Script

**Files:**
- Create: `scripts/build-docs.js`
- Modify: `packages/portal/package.json`

**Step 1: Install build dependencies**

```bash
cd /data/projects/own/maplespike
pnpm add -D -w marked @chenglou/pretext
```

**Step 2: Create directory structure**

```bash
mkdir -p scripts
mkdir -p packages/portal/docs
```

**Step 3: Create the build script**

Create `scripts/build-docs.js`:

```js
#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DOCS_SRC = join(ROOT, 'packages', 'docs');
const DOCS_OUT = join(ROOT, 'packages', 'portal', 'docs');
const PORTAL_DIR = join(ROOT, 'packages', 'portal');

// Sidebar structure — mirrors the VitePress config
const SECTIONS = {
  guide: {
    title: 'Guide',
    items: [
      'what-is-maplespike',
      'getting-started',
      'quickstart',
      'authentication',
      'sdk',
      'billing',
      'architecture',
    ],
  },
  api: {
    title: 'API Reference',
    items: ['endpoints', 'health', 'gov-search', 'ai-ask', 'usage', 'mock'],
  },
  mcp: {
    title: 'MCP Server',
    items: ['tools', 'setup', 'sse'],
  },
  modules: {
    title: 'Modules',
    items: ['overview', 'committees', 'immigration', 'health', 'lode', 'corporate', 'transport'],
  },
};

function titleFromSlug(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function buildSidebar(activeSection, activeSlug) {
  let html = '<nav class="docs-sidebar">\n';
  for (const [sectionKey, section] of Object.entries(SECTIONS)) {
    const isActive = sectionKey === activeSection;
    html += `  <div class="docs-sidebar-section${isActive ? ' active' : ''}">\n`;
    html += `    <h4 class="docs-sidebar-heading">${section.title}</h4>\n`;
    html += `    <ul>\n`;
    for (const slug of section.items) {
      const href = `/docs/${sectionKey}/${slug}.html`;
      const current = sectionKey === activeSection && slug === activeSlug;
      html += `      <li><a href="${href}"${current ? ' class="current"' : ''}>${titleFromSlug(slug)}</a></li>\n`;
    }
    html += `    </ul>\n`;
    html += `  </div>\n`;
  }
  html += '</nav>\n';
  return html;
}

function wrapInTemplate(sectionKey, slug, bodyHtml) {
  const title = titleFromSlug(slug);
  const section = SECTIONS[sectionKey];
  const sidebar = buildSidebar(sectionKey, slug);

  return `<!DOCTYPE html>
<html lang="en-CA" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — MapleSpike Docs</title>
  <meta name="description" content="MapleSpike ${section.title}: ${title}">
  <link rel="stylesheet" href="../styles.css">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23C23030'/><text x='16' y='22' text-anchor='middle' fill='white' font-size='16' font-weight='800' font-family='sans-serif'>C</text></svg>">
  <meta name="theme-color" content="#C23030">
  <script src="/config.js"></script>
</head>
<body>
  <nav>
    <div class="nav-inner">
      <a href="/" class="logo">
        <span class="logo-icon">C</span>
        <span>MapleSpike</span>
      </a>
      <ul class="nav-links">
        <li><a href="/explorer.html"><span class="nav-bracket">[</span>DATA<span class="nav-bracket">]</span></a></li>
        <li><a href="/explorer.html"><span class="nav-bracket">[</span>EXPLORER<span class="nav-bracket">]</span></a></li>
        <li><a href="/pricing.html"><span class="nav-bracket">[</span>PRICING<span class="nav-bracket">]</span></a></li>
        <li class="nav-separator"></li>
        <li class="nav-docs-item"><a href="/docs/guide/what-is-maplespike.html" class="active"><span class="nav-bracket">[</span>DOCS<span class="nav-bracket">]</span></a></li>
        <li class="nav-separator"></li>
        <li><a href="/changelog.html"><span class="nav-bracket">[</span>CHANGELOG<span class="nav-bracket">]</span></a></li>
        <li><a href="/workspace.html"><span class="nav-bracket">[</span>WORKSPACE<span class="nav-bracket">]</span></a></li>
        <li><a href="/workspace.html" class="btn btn-sm btn-primary">Get API Key</a></li>
        <li><button class="theme-toggle" aria-label="Toggle theme"></button></li>
      </ul>
      <button class="nav-mobile-toggle" aria-label="Toggle navigation">☰</button>
    </div>
  </nav>

  <div class="docs-layout">
    ${sidebar}
    <main class="docs-content pretext-canvas" data-section="${sectionKey}" data-slug="${slug}">
      ${bodyHtml}
    </main>
  </div>

  <footer>
    <div class="footer-inner">
      <div class="brand">
        <a href="/" class="logo" style="font-size:1.1rem;font-weight:700;color:var(--accent);">
          <span class="logo-icon" style="display:inline-flex;width:28px;height:28px;font-size:0.85rem;">C</span>
          MapleSpike
        </a>
        <p>Canadian public data infrastructure.</p>
      </div>
      <div>
        <h4>Product</h4>
        <ul>
          <li><a href="/explorer.html">Data Explorer</a></li>
          <li><a href="/workspace.html">API Keys</a></li>
          <li><a href="/dashboard.html">Dashboard</a></li>
        </ul>
      </div>
      <div>
        <h4>Docs</h4>
        <ul>
          <li><a href="/docs/guide/quickstart.html">Quickstart</a></li>
          <li><a href="/docs/api/endpoints.html">API Reference</a></li>
          <li><a href="/docs/mcp/tools.html">MCP Tools</a></li>
        </ul>
      </div>
      <div>
        <h4>Legal</h4>
        <ul>
          <li>Terms of Service</li>
          <li>OGL-C Attribution</li>
          <li><a href="https://github.com/reverb256">GitHub</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 MapleSpike.</span>
      <span>Data: <a href="https://open.canada.ca/en/open-government-licence-canada">Open Government Licence &ndash; Canada</a>.</span>
    </div>
  </footer>

  <script src="/script.js"></script>
  <script src="/nav.js"></script>
  <script type="module" src="/docs-pretext.js"></script>
</body>
</html>`;
}

console.log('Building editorial docs from markdown...');

// Process all markdown files
for (const [sectionKey, section] of Object.entries(SECTIONS)) {
  for (const slug of section.items) {
    const mdPath = join(DOCS_SRC, sectionKey, `${slug}.md`);
    const md = readFileSync(mdPath, 'utf-8');
    const bodyHtml = marked(md);
    const fullHtml = wrapInTemplate(sectionKey, slug, bodyHtml);

    const outDir = join(DOCS_OUT, sectionKey);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, `${slug}.html`), fullHtml);
    console.log(`  Built: ${sectionKey}/${slug}.html`);
  }
}

// Redirect index
writeFileSync(
  join(DOCS_OUT, 'index.html'),
  `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/docs/guide/what-is-maplespike.html"></head><body><p>Redirecting...</p></body></html>`
);
console.log('  Built: index.html (redirect)');
console.log('Docs build complete.');
```

**Step 4: Run the build script to verify it generates HTML**

```bash
cd /data/projects/own/maplespike
node scripts/build-docs.js
```

Expected: 25 HTML files created in `packages/portal/docs/`, no errors.

**Step 5: Commit**

```bash
git add scripts/build-docs.js package.json pnpm-lock.yaml
git commit -m "feat(docs): scaffold markdown-to-HTML build script for editorial docs"
```

---

### Task 2: Docs Layout CSS

**Files:**
- Modify: `packages/portal/styles.css` (append at end)

**Step 1: Add docs layout styles**

Append to `styles.css`:

```css
/* ═══ Docs Layout ═══ */
.docs-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 0;
  max-width: 1200px;
  margin: 0 auto;
  padding: calc(var(--nav-height, 64px) + 32px) 24px 64px;
  min-height: 60vh;
}

.docs-sidebar {
  position: sticky;
  top: calc(var(--nav-height, 64px) + 32px);
  height: fit-content;
  border-right: 1px solid var(--border);
  padding-right: 24px;
  font-size: 0.85rem;
}

.docs-sidebar-section { margin-bottom: 24px; }

.docs-sidebar-heading {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin: 0 0 8px 0;
}

.docs-sidebar-section.active .docs-sidebar-heading { color: var(--accent); }

.docs-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.docs-sidebar li { margin-bottom: 4px; }

.docs-sidebar a {
  color: var(--text-secondary);
  text-decoration: none;
  display: block;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.15s;
}

.docs-sidebar a:hover {
  color: var(--text-primary);
  background: var(--bg-card);
}

.docs-sidebar a.current {
  color: var(--accent);
  background: var(--accent-dim);
  font-weight: 600;
}

.docs-content {
  padding-left: 40px;
  max-width: 100%;
  overflow-x: auto;
}

.docs-content h1 {
  font-size: 1.8rem;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.docs-content h2 {
  font-size: 1.35rem;
  margin-top: 48px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.docs-content h3 {
  font-size: 1.1rem;
  margin-top: 32px;
  color: var(--text-secondary);
}

.docs-content p {
  line-height: 1.75;
  color: var(--text-secondary);
  margin: 12px 0;
}

.docs-content code {
  font-family: var(--font-mono);
  font-size: 0.85em;
  background: var(--bg-card);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--accent-gold);
}

.docs-content pre {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px 20px;
  overflow-x: auto;
  margin: 16px 0;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.6;
}

.docs-content pre code {
  background: none;
  padding: 0;
  color: var(--text-primary);
}

.docs-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 0.85rem;
}

.docs-content th,
.docs-content td {
  padding: 8px 12px;
  border: 1px solid var(--border);
  text-align: left;
}

.docs-content th {
  background: var(--bg-card);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.docs-content blockquote {
  border-left: 3px solid var(--accent);
  padding: 8px 16px;
  margin: 16px 0;
  color: var(--text-secondary);
  background: var(--accent-dim);
  border-radius: 0 4px 4px 0;
}

.docs-content a {
  color: var(--accent-cyan);
  text-decoration: none;
}

.docs-content a:hover { text-decoration: underline; }

.docs-content ul, .docs-content ol {
  padding-left: 24px;
  color: var(--text-secondary);
  line-height: 1.75;
}

/* Nav separator */
.nav-separator {
  width: 1px;
  height: 20px;
  background: var(--border);
  margin: 0 4px;
  align-self: center;
  list-style: none;
}

/* Mobile */
@media (max-width: 768px) {
  .docs-layout {
    grid-template-columns: 1fr;
    padding-top: calc(var(--nav-height, 64px) + 16px);
  }
  .docs-sidebar {
    position: static;
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding-right: 0;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }
  .docs-content { padding-left: 0; }
}
```

**Step 2: Verify layout**

Run a local server:
```bash
cd /data/projects/own/maplespike/packages/portal && python3 -m http.server 8888
```

Open `http://localhost:8888/docs/guide/quickstart.html`. Verify: sidebar on left, content on right, dark theme, bracket nav.

**Step 3: Commit**

```bash
git add packages/portal/styles.css
git commit -m "feat(docs): add editorial docs layout CSS — sidebar, content, nav separators"
```

---

### Task 3: Nav Restructure

**Files:**
- Modify: All `packages/portal/*.html` files

**Step 1: Update nav in all portal HTML files**

The nav HTML pattern that every portal page should use:

```html
<ul class="nav-links">
  <li><a href="/explorer.html"><span class="nav-bracket">[</span>DATA<span class="nav-bracket">]</span></a></li>
  <li><a href="/explorer.html"><span class="nav-bracket">[</span>EXPLORER<span class="nav-bracket">]</span></a></li>
  <li><a href="/pricing.html"><span class="nav-bracket">[</span>PRICING<span class="nav-bracket">]</span></a></li>
  <li class="nav-separator"></li>
  <li><a href="/docs/guide/what-is-maplespike.html"><span class="nav-bracket">[</span>DOCS<span class="nav-bracket">]</span></a></li>
  <li class="nav-separator"></li>
  <li><a href="/changelog.html"><span class="nav-bracket">[</span>CHANGELOG<span class="nav-bracket">]</span></a></li>
  <li><a href="/workspace.html"><span class="nav-bracket">[</span>WORKSPACE<span class="nav-bracket">]</span></a></li>
  <li><a href="/workspace.html" class="btn btn-sm btn-primary">Get API Key</a></li>
  <li><button class="theme-toggle" aria-label="Toggle theme"></button></li>
</ul>
```

For each HTML file in `packages/portal/`, replace the old `<ul class="nav-links">` block with the above. Update the `active` class on the link matching the current page (e.g. `class="active"` on the DOCS link for docs pages, on DATA for explorer page, etc.).

**Step 2: Verify all pages show consistent nav**

Open several portal pages in browser, confirm nav grouping is consistent with separators.

**Step 3: Commit**

```bash
git add packages/portal/*.html
git commit -m "feat(portal): restructure nav with grouped layout and docs link"
```

---

### Task 4: Pretext Integration

**Files:**
- Create: `packages/portal/docs-pretext.js`

**Step 1: Create the Pretext initialization module**

Create `packages/portal/docs-pretext.js`:

```js
import { prepare, layout, walkLineRanges } from '@chenglou/pretext';

const FONT = '14px "JetBrainsMono Nerd Font", "Fira Code", "Cascadia Code", monospace';
const BODY_FONT = '16px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const LINE_HEIGHT = 1.75;

function initCodeIslands() {
  const blocks = document.querySelectorAll('.docs-content pre');
  blocks.forEach((block) => {
    block.classList.add('pretext-island');
  });
}

function initAccordions() {
  const details = document.querySelectorAll('.docs-content details');
  details.forEach((el) => {
    const summary = el.querySelector('summary');
    const content = el.querySelector('.accordion-body') || el.querySelector('div');
    if (!content) return;

    const text = content.textContent;
    const prepared = prepare(text, BODY_FONT);
    const measured = layout(prepared, el.offsetWidth, LINE_HEIGHT);
    el.style.setProperty('--accordion-height', `${measured.height}px`);
    el.classList.add('pretext-accordion');
  });
}

function initRichInline() {
  // Mark paragraphs with inline code/badges for Pretext line measurement
  const paragraphs = document.querySelectorAll('.docs-content p');
  paragraphs.forEach((p) => {
    if (p.querySelector('code, .badge, .doc-inline-code')) {
      p.classList.add('pretext-rich');
    }
  });
}

function init() {
  initCodeIslands();
  initRichInline();
  initAccordions();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

**Step 2: Copy Pretext to portal static assets**

The build script (`scripts/build-docs.js`) needs to copy the Pretext ESM bundle to the portal dir. Add after the `SECTIONS` definition:

```js
// Copy Pretext bundle to portal static assets
const pretextSrc = join(ROOT, 'node_modules', '@chenglou', 'pretext', 'dist', 'index.js');
try {
  copyFileSync(pretextSrc, join(PORTAL_DIR, 'pretext.js'));
  console.log('  Copied: pretext.js');
} catch (e) {
  console.warn('  Warning: could not copy pretext.js:', e.message);
}
```

And add the import at the top:
```js
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs';
```

**Step 3: Verify Pretext loads on a doc page**

Open a generated doc page in browser. Check console for import errors. Verify `pretext-island` class is added to code blocks.

**Step 4: Commit**

```bash
git add packages/portal/docs-pretext.js scripts/build-docs.js
git commit -m "feat(docs): integrate Pretext for editorial text layout"
```

---

### Task 5: Nginx Config Update

**Files:**
- Modify: `k8s/dev/portal-config.yaml`
- Modify: `k8s/prod/portal-config.yaml` (if exists)

**Step 1: Update nginx config to serve generated docs**

Find the docs-dist location block and replace it:

The nginx config is embedded in the portal Dockerfile or served via ConfigMap. Check which approach is used:

```bash
grep -r "docs-dist\|/docs/" /data/projects/own/maplespike/Dockerfile.portal 2>/dev/null
grep -r "docs-dist\|/docs/" /data/projects/own/maplespike/packages/portal/nginx.conf 2>/dev/null
```

If nginx config is in the Dockerfile, update the docs location to:
```nginx
# Docs — generated from packages/docs/ via scripts/build-docs.js
location ^~ /docs/ {
    alias /usr/share/nginx/html/docs/;
    index index.html;
    try_files $uri $uri/ $uri.html /docs/index.html;
}
```

**Step 2: Commit**

```bash
git add Dockerfile.portal  # or nginx.conf, or k8s configs
git commit -m "fix(portal): serve generated docs from /docs/ instead of docs-dist/"
```

---

### Task 6: CI/CD Integration

**Files:**
- Modify: `.github/workflows/ci.yml`

**Step 1: Add docs build step to CI**

Add after the `pnpm -r build` step in `ci.yml`:

```yaml
      # ── Build editorial docs from markdown ──────────────────
      - name: Build docs
        run: node scripts/build-docs.js
```

**Step 2: Verify CI passes**

Push and check the workflow run. The docs build should succeed and the existing tests should still pass.

**Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add docs build step to CI pipeline"
```

---

### Task 7: Remove VitePress

**Files:**
- Delete: `packages/docs/.vitepress/`
- Delete: `packages/portal/docs-dist/`
- Modify: `packages/docs/package.json` (remove vitepress dep)
- Modify: `pnpm-workspace.yaml` (if docs package config references vitepress)

**Step 1: Remove VitePress config and dist**

```bash
rm -rf packages/docs/.vitepress
rm -rf packages/portal/docs-dist
```

**Step 2: Remove vitepress from docs package.json**

Edit `packages/docs/package.json` to remove the `vitepress` devDependency and any vitepress scripts.

**Step 3: Run `pnpm install` to update lockfile**

```bash
pnpm install
```

**Step 4: Run the docs build and verify everything still works**

```bash
node scripts/build-docs.js
```

**Step 5: Commit**

```bash
git add -A
git commit -m "chore(docs): remove VitePress, keep markdown source for editorial build"
```

---

### Task 8: Final Verification

**Step 1: Run full build + docs build locally**

```bash
cd /data/projects/own/maplespike
pnpm -r build
node scripts/build-docs.js
```

**Step 2: Serve portal locally and verify all 25 doc pages**

```bash
cd packages/portal && python3 -m http.server 8888
```

Check:
- `/docs/guide/what-is-maplespike.html` — renders with sidebar, content, correct nav
- `/docs/api/endpoints.html` — tables render correctly
- `/docs/mcp/tools.html` — long page scrolls well
- `/docs/modules/overview.html` — all sections visible
- `/docs/index.html` — redirects to guide
- Nav on docs pages links back to portal pages correctly
- Nav on portal pages links to docs correctly
- Mobile responsive (sidebar collapses)
- Pretext loads without console errors

**Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix(docs): verification fixes for editorial docs build"
```
