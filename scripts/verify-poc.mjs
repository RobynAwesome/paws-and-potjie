import { readFile, access } from 'node:fs/promises';

const required = [
  'dist/index.html',
  'public/manifest.webmanifest',
  'public/sw.js',
  'src/lib/kpgs.ts',
  'src/components/PotjieScene.tsx',
  'server/index.ts',
  'docs/THREEJS-LINEAGE.md',
];
for (const path of required) await access(path);

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
if (pkg.devDependencies?.typescript !== '7.0.2') {
  throw new Error('POC gate failed: TypeScript 7.0.2 is not pinned.');
}
if (pkg.dependencies?.three !== '0.185.0') {
  throw new Error('POC gate failed: Three.js runtime does not match the governed fork version.');
}
if (pkg.kpgs?.threeSource?.fork !== 'RobynAwesome/three.js') {
  throw new Error('POC gate failed: Three.js fork lineage is missing.');
}

const manifest = JSON.parse(await readFile('public/manifest.webmanifest', 'utf8'));
if (manifest.display !== 'standalone') throw new Error('POC gate failed: PWA manifest is not standalone.');

console.log('POC PASS: TS7 + governed Three.js + adaptive PWA + KPGS contract + MERN API source present.');
