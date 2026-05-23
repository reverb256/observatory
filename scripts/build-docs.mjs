#!/usr/bin/env node
// build-docs.js — Convert packages/docs/*.md to portal-native HTML
// Output: packages/portal/docs/{section}/{slug}.html

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const DOCS_SRC = join(ROOT, 'packages/docs');
const DOCS_OUT = join(ROOT, 'packages/portal/docs');

// ── Sidebar definition ──────────────────────────────────────
const SECTIONS = [
  {
    key: 'guide',
    label: 'Guide',
    navLink: '/docs/guide/what-is-maplespike.html',
    navLabel: 'GUIDE',
    pages: [
      { slug: 'what-is-maplespike', title: 'What is MapleSpike?' },
      { slug: 'getting-started', title: 'Getting Started' },
      { slug: 'quickstart', title: 'Quickstart' },
      { slug: 'authentication', title: 'Authentication' },
      { slug: 'sdk', title: 'SDK Usage' },
      { slug: 'billing', title: 'Billing & Limits' },
      { slug: 'architecture', title: 'Architecture' },
    ],
  },
  {
    key: 'api',
    label: 'API Reference',
    navLink: '/docs/api/endpoints.html',
    navLabel: 'API',
    pages: [
      { slug: 'endpoints', title: 'All Endpoints' },
      { slug: 'health', title: 'Health' },
      { slug: 'gov-search', title: 'Gov Search' },
      { slug: 'ai-ask', title: 'AI Ask' },
      { slug: 'usage', title: 'Usage & Limits' },
      { slug: 'mock', title: 'Mock Mode' },
    ],
  },
  {
    key: 'mcp',
    label: 'MCP Server',
    navLink: '/docs/mcp/tools.html',
    navLabel: 'MCP',
    pages: [
      { slug: 'tools', title: 'All Tools' },
      { slug: 'setup', title: 'Setup Guide' },
      { slug: 'sse', title: 'SSE Transport' },
    ],
  },
  {
    key: 'modules',
    label: 'Modules',
    navLink: '/docs/modules/overview.html',
    navLabel: 'MODULES',
    pages: [
      { slug: 'overview', title: 'Overview' },
      { slug: 'committees', title: 'Committee Evidence' },
      { slug: 'immigration', title: 'Immigration & Borders' },
      { slug: 'health', title: 'Health Data' },
      { slug: 'lode', title: 'LODE Geospatial' },
      { slug: 'corporate', title: 'Corporate & Lobbying' },
      { slug: 'transport', title: 'Transport & Infrastructure' },
    ],
  },
];

// ── Build sidebar HTML ──────────────────────────────────────
function buildSidebar(currentSection, currentSlug) {
  let html = '<nav class="docs-sidebar">\n';
  for (const section of SECTIONS) {
    const isSectionActive = section.key === currentSection;
    html += `  <div class="docs-sidebar-section${isSectionActive ? ' active' : ''}">\n`;
    html += `    <h4 class="docs-sidebar-heading">${section.label}</h4>\n`;
    html += `    <ul>\n`;
    for (const page of section.pages) {
      const href = `/docs/${section.key}/${page.slug}.html`;
      const isCurrent = section.key === currentSection && page.slug === currentSlug;
      html += `      <li${isCurrent ? ' class="active"' : ''}><a href="${href}"${isCurrent ? ' class="active"' : ''}>${page.title}</a></li>\n`;
    }
    html += `    </ul>\n`;
    html += `  </div>\n`;
  }
  html += '</nav>';
  return html;
}

// ── Build top nav HTML ──────────────────────────────────────
function buildNav() {
  const groups = [
    [
      { href: '/explorer.html', label: 'DATA' },
      { href: '/explorer.html', label: 'EXPLORER' },
      { href: '/pricing.html', label: 'PRICING' },
    ],
    [
      { href: '/docs/', label: 'DOCS', active: true },
    ],
    [
      { href: '/changelog.html', label: 'CHANGELOG' },
      { href: '/workspace.html', label: 'WORKSPACE' },
    ],
  ];

  let html = `<nav>
  <div class="nav-inner">
    <a href="/index.html" class="logo">
      <span class="logo-icon">C</span>
      <span>MapleSpike</span>
    </a>
    <ul class="nav-links">`;

  for (const group of groups) {
    if (group !== groups[0]) {
      html += `
      <li class="nav-separator" aria-hidden="true"></li>`;
    }
    for (const link of group) {
      const isActive = link.active;
      html += `
      <li><a href="${link.href}"${isActive ? ' class="active"' : ''}><span class="nav-bracket">[</span>${link.label}<span class="nav-bracket">]</span></a></li>`;
    }
  }

  html += `
      <li><a href="/workspace.html" class="btn btn-sm btn-primary">Get API Key</a></li>
      <li><button class="theme-toggle" aria-label="Toggle theme"></button></li>
    </ul>
    <button class="nav-mobile-toggle" aria-label="Toggle navigation">&#9776;</button>
  </div>
</nav>`;
  return html;
}

// ── Full page template ──────────────────────────────────────
function buildPage(title, description, sectionKey, slug, bodyHtml) {
  const nav = buildNav();
  const sidebar = buildSidebar(sectionKey, slug);

  return `<!DOCTYPE html>
<html lang="en-CA" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MapleSpike — ${title}</title>
  <meta name="description" content="${description}">

  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/responsive-fixes.css">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23C23030'/><text x='16' y='22' text-anchor='middle' fill='white' font-size='16' font-weight='800' font-family='sans-serif'>C</text></svg>">

  <link rel="preconnect" href="https://www.google.com" crossorigin>
  <link rel="manifest" href="/manifest.json">
  <meta name="msapplication-config" content="/browserconfig.xml">
  <link rel="canonical" href="https://maplespike.ca/docs/${sectionKey}/${slug}.html">
  <meta name="theme-color" content="#C23030">
  <script>window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }</script>
  <script defer data-domain="__MAPLESPIKE_ANALYTICS_DOMAIN__" src="https://plausible.io/js/script.js"></script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "MapleSpike",
    "url": "https://maplespike.ca",
    "description": "Canadian government data pipeline with verified citations",
    "applicationCategory": "Data API",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CAD"
    }
  }
  </script>
  <script src="/config.js"></script>
  <style>
    .docs-layout {
      display: flex;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      gap: 3rem;
    }
    .docs-sidebar {
      width: 240px;
      flex-shrink: 0;
      position: sticky;
      top: 5rem;
      max-height: calc(100vh - 6rem);
      overflow-y: auto;
      padding-right: 1rem;
    }
    .docs-sidebar-section { margin-bottom: 1.5rem; }
    .docs-sidebar-heading {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
      padding-bottom: 0.25rem;
      border-bottom: 1px solid var(--border);
    }
    .docs-sidebar ul { list-style: none; padding: 0; margin: 0; }
    .docs-sidebar li { margin-bottom: 0.15rem; }
    .docs-sidebar a {
      display: block;
      padding: 0.3rem 0.5rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: var(--radius);
      transition: all var(--transition);
    }
    .docs-sidebar a:hover { color: var(--text-primary); background: var(--bg-card); }
    .docs-sidebar a.active,
    .docs-sidebar li.active a {
      color: var(--accent);
      background: var(--bg-card);
      font-weight: 600;
    }
    .docs-content {
      flex: 1;
      min-width: 0;
      line-height: 1.75;
    }
    .docs-content h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .docs-content h2 {
      font-size: 1.4rem;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
      padding-bottom: 0.25rem;
      border-bottom: 1px solid var(--border);
    }
    .docs-content h3 {
      font-size: 1.15rem;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .docs-content p { margin-bottom: 1rem; color: var(--text-secondary); }
    .docs-content a { color: var(--accent-cyan, #0891B2); }
    .docs-content code {
      background: var(--bg-card);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-size: 0.88em;
      font-family: var(--font-mono);
    }
    .docs-content pre {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1rem;
      overflow-x: auto;
      margin-bottom: 1rem;
      font-size: 0.85rem;
      line-height: 1.6;
    }
    .docs-content pre code {
      background: none;
      padding: 0;
    }
    .docs-content ul, .docs-content ol { margin-bottom: 1rem; padding-left: 1.5rem; }
    .docs-content li { margin-bottom: 0.3rem; color: var(--text-secondary); }
    .docs-content blockquote {
      border-left: 3px solid var(--accent);
      padding: 0.75rem 1rem;
      margin: 1rem 0;
      background: var(--bg-card);
      border-radius: 0 var(--radius) var(--radius) 0;
      color: var(--text-secondary);
    }
    .docs-content blockquote p { margin-bottom: 0; }
    .docs-content table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }
    .docs-content th, .docs-content td {
      padding: 0.6rem 0.8rem;
      border: 1px solid var(--border);
      text-align: left;
      font-size: 0.88rem;
    }
    .docs-content th {
      background: var(--bg-card);
      color: var(--text-primary);
      font-weight: 600;
    }
    .docs-content td { color: var(--text-secondary); }
    @media (max-width: 900px) {
      .docs-layout { flex-direction: column; gap: 1.5rem; }
      .docs-sidebar {
        width: 100%;
        position: static;
        max-height: none;
        border-bottom: 1px solid var(--border);
        padding-bottom: 1rem;
      }
    }
  </style>
</head>
<body>

${nav}

<div class="docs-layout">
${sidebar}
<main class="docs-content">
${bodyHtml}
</main>
</div>

<footer>
  <div class="footer-inner">
    <div class="brand">
      <a href="/index.html" class="logo" style="font-size:1.1rem;font-weight:700;color:var(--accent);">
        <span class="logo-icon" style="display:inline-flex;width:28px;height:28px;font-size:0.85rem;">C</span>
        MapleSpike
      </a>
      <p>Canadian public data infrastructure — for journalists, researchers, and AI agents that cite.</p>
    </div>
    <div>
      <h4>Product</h4>
      <ul>
        <li><a href="/explorer.html">Data Explorer</a></li>
        <li><a href="/workspace.html">API Keys</a></li>
        <li><a href="/dashboard.html">Dashboard</a></li>
        <li><a href="/explorer.html">Data Explorer</a></li>
      </ul>
    </div>
    <div>
      <h4>AI Tools</h4>
      <ul>
        <li><a href="/agents.html">MCP Setup</a></li>
        <li><a href="/docs/guide/what-is-maplespike.html">Documentation</a></li>
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

// ── Extract description from markdown content ───────────────
function extractDescription(md) {
  // First non-heading paragraph
  const lines = md.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('```') && !trimmed.startsWith('|') && !trimmed.startsWith('>')) {
      // Strip markdown formatting for a clean description
      return trimmed.replace(/\*\*/g, '').replace(/`/g, '').slice(0, 160);
    }
  }
  return 'MapleSpike documentation';
}

// ── Main build ──────────────────────────────────────────────
function main() {
  let built = 0;

  for (const section of SECTIONS) {
    const sectionDir = join(DOCS_SRC, section.key);
    const outDir = join(DOCS_OUT, section.key);

    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }

    for (const page of section.pages) {
      const mdPath = join(sectionDir, `${page.slug}.md`);
      const htmlPath = join(outDir, `${page.slug}.html`);

      if (!existsSync(mdPath)) {
        console.warn(`  SKIP: ${mdPath} not found`);
        continue;
      }

      const md = readFileSync(mdPath, 'utf-8');
      const bodyHtml = marked(md);
      const description = extractDescription(md);

      const html = buildPage(page.title, description, section.key, page.slug, bodyHtml);
      writeFileSync(htmlPath, html);
      built++;
      console.log(`  OK: docs/${section.key}/${page.slug}.html`);
    }
  }

  // ── docs/index.html redirect ──
  const indexPath = join(DOCS_OUT, 'index.html');
  const indexHtml = `<!DOCTYPE html>
<html lang="en-CA">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=/docs/guide/what-is-maplespike.html">
  <title>MapleSpike — Documentation</title>
  <link rel="canonical" href="https://maplespike.ca/docs/guide/what-is-maplespike.html">
</head>
<body>
  <p>Redirecting to <a href="/docs/guide/what-is-maplespike.html">MapleSpike Documentation</a>.</p>
</body>
</html>`;
  writeFileSync(indexPath, indexHtml);
  console.log(`  OK: docs/index.html (redirect)`);

  console.log(`\nDone: ${built} pages built + 1 redirect index.`);
}

main();
