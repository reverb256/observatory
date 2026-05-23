#!/usr/bin/env node

/**
 * MD → HTML Converter for MapleSpike
 * Converts all Markdown files to HTML with unified CSS styling
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const UNIFIED_CSS = `body {
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 1.6;
  color: #1f2937;
  background: #ffffff;
}
h1 {
  border-bottom: 3px solid #3b82f6;
  padding-bottom: 0.5rem;
  margin-top: 2rem;
}
h2 {
  margin-top: 2rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.25rem;
}
h3 {
  margin-top: 1.5rem;
  color: #374151;
}
code {
  background: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 0.9em;
}
pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1rem 0;
}
pre code {
  background: transparent;
  padding: 0;
  color: inherit;
}
table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}
th, td {
  border: 1px solid #e5e7eb;
  padding: 0.5rem 0.75rem;
  text-align: left;
}
th {
  background: #f9fafb;
  font-weight: 600;
}
blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #6b7280;
}
hr {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 2rem 0;
}
ul {
  padding-left: 1.5rem;
}
li {
  margin: 0.25rem 0;
}
.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-size: 0.8em;
  font-weight: 600;
}
.badge-success { background: #d1fae5; color: #065f46; }
.badge-warning { background: #fef3c7; color: #92400e; }
.badge-danger { background: #fee2e2; color: #991b1b; }
.badge-info { background: #dbeafe; color: #1e40af; }
.meta {
  background: #fef3c7;
  border: 1px solid #fbbf24;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin: 1rem 0;
  font-size: 0.9em;
}`;

function extractMetadata(mdContent) {
  const lines = mdContent.split('\n');
  let meta = {};
  let inMeta = false;
  let mdLines = [];

  for (const line of lines) {
    if (line.trim() === '---') {
      if (!inMeta) {
        inMeta = true;
        continue;
      } else {
        break;
      }
    }
    if (inMeta) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        meta[match[1]] = match[2];
      }
    } else {
      mdLines.push(line);
    }
  }

  return { meta, markdown: mdLines.join('\n') };
}

function renderMetaBlock(meta) {
  const entries = Object.entries(meta);
  if (entries.length === 0) return '';

  const content = entries
    .map(([k, v]) => `<strong>${k}:</strong> ${v}`)
    .join(' | ');

  return `<div class="meta">${content}</div>\n\n`;
}

function convertMdToHtml(mdPath, outputPath) {
  const mdContent = readFileSync(mdPath, 'utf-8');
  const { meta, markdown } = extractMetadata(mdContent);

  const title = meta.title || meta.subject || mdPath.split('/').pop().replace('.md', '');
  const htmlContent = marked(markdown);

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    ${UNIFIED_CSS}
  </style>
</head>
<body>
  ${renderMetaBlock(meta)}
  ${htmlContent}
</body>
</html>`;

  writeFileSync(outputPath, fullHtml, 'utf-8');
  console.log(`✅ ${relative('.', mdPath)} → ${relative('.', outputPath)}`);
}

function findMarkdownFiles(rootDir, exclude = ['node_modules', '.git', 'dist']) {
  const mdFiles = [];

  function scan(dir) {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);

      try {
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          if (!exclude.includes(entry)) {
            scan(fullPath);
          }
        } else if (entry.endsWith('.md') && !entry.endsWith('.html')) {
          mdFiles.push(fullPath);
        }
      } catch (error) {
        // Skip problematic entries (broken symlinks, etc.)
        continue;
      }
    }
  }

  scan(rootDir);
  return mdFiles;
}

function main() {
  const args = process.argv.slice(2);
  const rootDir = args[0] || '.';
  const mdFiles = findMarkdownFiles(rootDir);

  console.log(`Found ${mdFiles.length} Markdown files\n`);

  let converted = 0;
  let skipped = 0;

  for (const mdPath of mdFiles) {
    const htmlPath = mdPath.replace(/\.md$/, '.html');

    if (existsSync(htmlPath)) {
      console.log(`⏭  ${relative('.', htmlPath)} exists, skipping`);
      skipped++;
      continue;
    }

    try {
      convertMdToHtml(mdPath, htmlPath);
      converted++;
    } catch (error) {
      console.error(`❌ Error converting ${mdPath}:`, error.message);
    }
  }

  console.log(`\nDone: ${converted} converted, ${skipped} skipped`);
}

main();