import { readFile, access } from 'node:fs/promises';

const required = ['dist/index.html', 'public/manifest.webmanifest', 'public/sw.js', 'src/lib/kpgs.ts', 'server/index.ts'];
for (const path of required) await access(path);

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
if (!String(pkg.devDependencies?.typescript ?? '').startsWith('7.')) {
  throw new Error('POC gate failed: TypeScript 7 is not pinned.');
}

const manifest = JSON.parse(await readFile('public/manifest.webmanifest', 'utf8'));
if (manifest.display !== 'standalone') throw new Error('POC gate failed: PWA manifest is not standalone.');

console.log('POC PASS: TS7 + adaptive PWA + KPGS contract + MERN API source present.');
