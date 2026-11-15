// Writes each package's README.md (its page on npm) from its docs page in site/packages: the
// page's opening, up to its first ## heading, with links made absolute, and a link to the rest.
// `node scripts/readmes.mjs --check` fails if any README is out of date (a test runs it).
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';

const SITE = 'https://webframe.tw050x.net';
const root = new URL('../', import.meta.url);
const check = process.argv.includes('--check');
const stale = [];

for (const group of readdirSync(new URL('packages/', root))) {
  for (const name of readdirSync(new URL(`packages/${group}/`, root))) {
    const page = new URL(`site/packages/${name}.md`, root);
    if (!existsSync(page)) throw new Error(`No docs page for ${name}: site/packages/${name}.md`);
    const opening = readFileSync(page, 'utf8').split(/^## /m)[0].trim()
      .replace(/\]\(\.\.\/([^)]+)\)/g, `](${SITE}/$1)`)
      .replace(/\]\(\.\/([^)]+)\)/g, `](${SITE}/packages/$1)`);
    const readme = `${opening}\n\nThe full documentation is at [webframe.tw050x.net/packages/${name}](${SITE}/packages/${name}).\n\n` +
      `Part of [webframe](${SITE}), MIT licensed.\n`;
    const file = new URL(`packages/${group}/${name}/README.md`, root);
    const current = existsSync(file) ? readFileSync(file, 'utf8') : '';
    if (current === readme) continue;
    if (check) stale.push(name);
    else writeFileSync(file, readme);
  }
}

if (stale.length > 0) {
  console.error(`READMEs out of date (run npm run readmes): ${stale.join(', ')}`);
  process.exit(1);
}
