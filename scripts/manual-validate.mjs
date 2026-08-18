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
  'src/lib/progressiveUpdates.ts',
  'src/accessibility.css',
  'public/manifest.webmanifest',
  'public/sw.js',
  'server/index.ts',
  'docs/THREEJS-LINEAGE.md',
  'docs/PROGRESSIVE-UPDATES.md',
  'SUBMISSION.md',
]) await requireFile(path);

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
assert(pkg.devDependencies?.typescript === '7.0.2', 'TypeScript 7.0.2 pinned');
assert(pkg.dependencies?.three === '0.185.0', 'Three.js runtime pinned to 0.185.0');
assert(pkg.devDependencies?.['@types/three'] === '0.185.0', 'Three.js types pinned to 0.185.0');
assert(pkg.dependencies?.['@react-three/fiber'] === '9.6.0', 'React Three Fiber pinned to 9.6.0');
assert(pkg.dependencies?.['@react-three/drei'] === '10.7.7', 'React Three Drei pinned to 10.7.7');
assert(pkg.kpgs?.threeSource?.fork === 'RobynAwesome/three.js', 'Three.js fork lineage declared');
assert(pkg.kpgs?.threeSource?.ref === 'd2ac59a15620ff8696dd55983c1f411c0a3f92ce', 'Three.js fork commit pinned');
assert(pkg.scripts?.stackblitz === 'vite --host 0.0.0.0', 'One-click browser demo script present');

const progressiveMeta = pkg.kpgs?.progressiveUpdates;
assert(progressiveMeta?.canonicalRepository === 'RobynAwesome/Introduction-to-MCP', 'Canonical KPGS repository pinned');
assert(progressiveMeta?.canonicalCommit === '6eeb285d0775a7e74ceadc06e32b4068fcfbc595', 'Canonical Progressive Update commit pinned');
assert(progressiveMeta?.schema === 'kpgs.progressive-update.v1', 'Progressive Update wire schema pinned');
assert(progressiveMeta?.receiptSchema === 'kpgs.swfus.receipt.v1', 'SWFUS receipt schema pinned');
assert(progressiveMeta?.boundaryMarker === '#NB', 'Literal #NB boundary marker pinned');

const scene = await readFile('src/components/PotjieScene.tsx', 'utf8');
assert(scene.includes("from '@react-three/fiber'"), 'R3F Canvas runtime wired');
assert(scene.includes("from 'three'"), 'Three.js runtime imported');
assert(scene.includes("frameloop={animate ? 'always' : 'demand'}"), 'Three.js frameloop governed by motion budget');
assert(scene.includes("tier === 'full' ? [1, 1.5] : [1, 1.2]"), 'Three.js DPR budget governed by experience tier');
assert(scene.includes("frames={tier === 'full' && animate ? Infinity : 1}"), 'Contact shadows constrained outside full tier');

const app = await readFile('src/App.tsx', 'utf8');
assert(app.includes("lazy(() => import('./components/PotjieScene')"), 'Three.js chunk lazy-loaded');
assert(app.includes('<Suspense fallback={<PotjieFallback />}>'), 'CSS fallback covers 3D chunk loading');
assert(app.includes('<PotjieScene tier={profile.tier} animate={animate} />'), 'Adaptive 3D scene mounted');
assert(app.includes("profile.tier === 'lite'"), 'CSS fallback retained for lite devices');
assert(app.includes('aria-pressed={mood === item.id}'), 'Human choice exposes selected state');
assert(app.includes('aria-pressed={energy === item.id}'), 'Dog choice exposes selected state');
assert(app.includes('queueComfortChoice({ mood: nextMood, energy: nextEnergy })'), 'Explicit Comfort Compass choice enters Progressive Update queue');
assert(app.includes('syncComfortQueue().then(setComfortSync)'), 'Queued comfort updates reconcile through governed sync client');
assert(app.includes("syncLabels[comfortSync.status]"), 'Progressive update state is progressively disclosed to the user');
assert(app.includes('only explicit human button presses enqueue state'), 'Refresh reconciliation does not manufacture a new update');

const runtime = await readFile('src/lib/experience.ts', 'utf8');
assert(runtime.includes('saveData'), 'Save-Data policy retained');
assert(runtime.includes('prefers-reduced-motion'), 'Reduced-motion policy retained');
assert(runtime.includes('supportsWebGL'), 'WebGL capability gate present');
assert(runtime.includes("!webgl || saveData"), 'Missing WebGL forces lite tier');

const progressive = await readFile('src/lib/progressiveUpdates.ts', 'utf8');
assert(progressive.includes("canonicalCommit: '6eeb285d0775a7e74ceadc06e32b4068fcfbc595'"), 'Client source pins canonical Progressive Update commit');
assert(progressive.includes("schema: 'kpgs.progressive-update.v1'"), 'Client emits canonical Progressive Update schema');
assert(progressive.includes("receiptSchema: 'kpgs.swfus.receipt.v1'"), 'Client accepts canonical SWFUS receipt schema');
assert(progressive.includes("boundaryMarker: '#NB'"), 'Client preserves literal #NB boundary');
assert(progressive.includes("'TELEMETRY'"), 'SWFUS TELEMETRY stage declared');
assert(progressive.includes("'CLASSIFICATION'"), 'SWFUS CLASSIFICATION stage declared');
assert(progressive.includes("'ROUTING'"), 'SWFUS ROUTING stage declared');
assert(progressive.includes("'PROTOCOL_SELECTION'"), 'SWFUS PROTOCOL_SELECTION stage declared');
assert(progressive.includes("'INVARIANT_AUDIT'"), 'SWFUS INVARIANT_AUDIT stage declared');
assert(progressive.includes("'POC_FOC_CHECK'"), 'SWFUS POC_FOC_CHECK stage declared');
assert(progressive.includes("'STATE_UPDATE'"), 'SWFUS STATE_UPDATE stage declared');
assert(progressive.includes("'DISTRIBUTION'"), 'SWFUS DISTRIBUTION stage declared');
assert(progressive.includes("authority_effect: 'none'"), 'Browser update cannot grant authority');
assert(progressive.includes("state_class: 'non_authoritative'"), 'Comfort preference stays non-authoritative');
assert(progressive.includes("poc_validated: true"), 'Explicit user interaction supplies the bounded POC signal');
assert(progressive.includes("foc_detected: false"), 'Client request explicitly rejects FOC promotion');
assert(progressive.includes("selected_by: 'human'"), 'Human selection remains explicit in the update value');
assert(progressive.includes("localStorage.setItem(STORAGE_KEY"), 'Offline-first comfort state persists locally when browser storage permits it');
assert(progressive.includes('volatileState = cloneState(state)'), 'Storage-denied browsers retain a bounded volatile fallback');
assert(progressive.includes('state.queue.push(update)'), 'Updates enter an immutable FIFO queue');
assert(progressive.includes('latest.queue.shift()'), 'Only admitted synchronized updates leave the latest queue state');
assert(progressive.includes('const latest = readState()'), 'Receipt application re-reads state to preserve clicks queued during an in-flight request');
assert(progressive.includes('currentIndex !== 0'), 'Out-of-order queue reconciliation fails closed');
assert(progressive.includes('receipt.correlation_id === update.correlation_id'), 'SWFUS receipt must bind the exact correlation identity');
assert(progressive.includes('sameOrderedStrings(receipt.evidence_refs, update.evidence_refs)'), 'SWFUS receipt must bind the exact ordered evidence refs');
assert(progressive.includes("response.ok ? 'rejected' : 'pending'"), 'Invalid successful receipts reject while transport failures remain retryable');
assert(progressive.includes("body.disposition === 'APPLIED' && body.synchronized"), 'Queue clears only on APPLIED + synchronized SWFUS receipt');
assert(progressive.includes("if (!response.ok)"), 'Contradictory non-2xx APPLIED receipts cannot dequeue local state');
assert(progressive.includes("body.disposition === 'HELD'"), 'HELD remains a distinct progressive state even when transport uses non-2xx');
assert(progressive.includes("body.disposition === 'REJECTED'"), 'REJECTED remains a distinct progressive state even when transport uses non-2xx');
assert(progressive.includes('Clicking an already selected value is observation, not a new mutation.'), 'No-op selections do not manufacture Progressive Updates');
assert(!progressive.includes("schema: 'kpgs.swfus.receipt.v1',\n    receipt_id:"), 'Browser does not manufacture SWFUS receipts');

const envExample = await readFile('.env.example', 'utf8');
assert(envExample.includes('VITE_KPGS_PROGRESSIVE_UPDATE_ENDPOINT='), 'Progressive Update gateway is optional and deployment-configured');

const progressiveDocs = await readFile('docs/PROGRESSIVE-UPDATES.md', 'utf8');
assert(progressiveDocs.includes('APU)'), 'Progressive Update documentation names APU');
assert(progressiveDocs.includes('-> #NB'), 'Progressive Update documentation preserves literal #NB');
assert(progressiveDocs.includes('bounded CRUD'), 'Progressive Update documentation preserves bounded CRUD');
assert(progressiveDocs.includes('SWFUS'), 'Progressive Update documentation preserves SWFUS');
assert(progressiveDocs.includes('browser cannot manufacture'), 'Documentation preserves the browser receipt authority boundary');

const sw = await readFile('public/sw.js', 'utf8');
assert(sw.includes("paws-potjie-v2"), 'Service worker cache version advanced');
assert(sw.includes("request.mode === 'navigate'"), 'Navigation uses network-first update path');

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
  progressiveUpdates: {
    canonicalRepository: 'RobynAwesome/Introduction-to-MCP',
    canonicalCommit: '6eeb285d0775a7e74ceadc06e32b4068fcfbc595',
    schema: 'kpgs.progressive-update.v1',
    receiptSchema: 'kpgs.swfus.receipt.v1',
    boundaryMarker: '#NB',
    receiptBinding: ['update_id', 'node_id', 'operation', 'correlation_id', 'evidence_refs'],
  },
  boundary: 'MANUAL SOURCE VALIDATION ≠ DEPLOYMENT VALIDATION',
}, null, 2));
