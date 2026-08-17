import { access, readFile } from 'node:fs/promises';

const failures = [];
const checks = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
  else checks.push(message);
}

async function requireFile(path) {
  try {
    await access(path);
    checks.push(`file:${path}`);
  } catch {
    failures.push(`missing:${path}`);
  }
}

for (const path of [
  'src/App.tsx',
  'src/components/PotjieScene.tsx',
  'src/lib/experience.ts',
  'src/lib/kpgs.ts',
  'public/manifest.webmanifest',
  'public/sw.js',
  'server/index.ts',
  'docs/THREEJS-LINEAGE.md',
]) await requireFile(path);

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
assert(pkg.devDependencies?.typescript === '7.0.2', 'TypeScript 7.0.2 pinned');
assert(pkg.dependencies?.three === '0.185.0', 'Three.js runtime pinned to 0.185.0');
assert(pkg.devDependencies?.['@types/three'] === '0.185.0', 'Three.js types pinned to 0.185.0');
assert(pkg.dependencies?.['@react-three/fiber'] === '9.6.0', 'React Three Fiber pinned to 9.6.0');
assert(pkg.dependencies?.['@react-three/drei'] === '10.7.7', 'React Three Drei pinned to 10.7.7');
assert(pkg.kpgs?.threeSource?.fork === 'RobynAwesome/three.js', 'Three.js fork lineage declared');
assert(pkg.kpgs?.threeSource?.ref === 'd2ac59a15620ff8696dd55983c1f411c0a3f92ce', 'Three.js fork commit pinned');

const scene = await readFile('src/components/PotjieScene.tsx', 'utf8');
assert(scene.includes("from '@react-three/fiber'"), 'R3F Canvas runtime wired');
assert(scene.includes("from 'three'"), 'Three.js runtime imported');
assert(scene.includes("frameloop={animate ? 'always' : 'demand'}"), 'Three.js frameloop governed by motion budget');
assert(scene.includes("tier === 'full' ? [1, 1.5] : [1, 1.2]"), 'Three.js DPR budget governed by experience tier');
assert(scene.includes("frames={tier === 'full' && animate ? Infinity : 1}"), 'Contact shadows constrained outside full tier');

const app = await readFile('src/App.tsx', 'utf8');
assert(app.includes('<PotjieScene tier={profile.tier} animate={animate} />'), 'Adaptive 3D scene mounted');
assert(app.includes("profile.tier === 'lite'"), 'CSS fallback retained for lite devices');

const runtime = await readFile('src/lib/experience.ts', 'utf8');
assert(runtime.includes('saveData'), 'Save-Data policy retained');
assert(runtime.includes('prefers-reduced-motion'), 'Reduced-motion policy retained');
assert(runtime.includes('supportsWebGL'), 'WebGL capability gate present');
assert(runtime.includes("!webgl || saveData"), 'Missing WebGL forces lite tier');

const manifest = JSON.parse(await readFile('public/manifest.webmanifest', 'utf8'));
assert(manifest.display === 'standalone', 'PWA standalone display retained');

try {
  await access('.github/workflows/ci.yml');
  failures.push('GitHub Actions workflow still present; manual validation mode requires it removed');
} catch {
  checks.push('GitHub Actions workflow absent');
}

if (failures.length) {
  console.error(JSON.stringify({ schema: 'kpgs.manual_validation_receipt.v1', status: 'FAIL', failures, checks }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  schema: 'kpgs.manual_validation_receipt.v1',
  status: 'PASS',
  checks,
  three: {
    fork: 'RobynAwesome/three.js',
    ref: 'd2ac59a15620ff8696dd55983c1f411c0a3f92ce',
    runtime: 'three@0.185.0',
    fiber: '@react-three/fiber@9.6.0',
    drei: '@react-three/drei@10.7.7',
  },
  boundary: 'MANUAL SOURCE VALIDATION ≠ DEPLOYMENT VALIDATION',
}, null, 2));
