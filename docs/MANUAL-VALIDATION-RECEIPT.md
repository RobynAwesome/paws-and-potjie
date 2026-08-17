# Manual Validation Receipt — 2026-08-17

Schema: `kpgs.manual_validation_receipt.v1`

## Result

**SOURCE CONTRACT: PASS**

GitHub Actions is not part of this repository's validation path.

## Verified source state

- TypeScript: `7.0.2`
- Vite: `8.1.5`
- Three.js runtime: `0.185.0`
- Three.js types: `0.185.0`
- React Three Fiber: `9.6.0`
- React Three Drei: `10.7.7`
- Governed fork: `RobynAwesome/three.js`
- Inspected fork ref: `d2ac59a15620ff8696dd55983c1f411c0a3f92ce`

The Three.js fork reports package version `0.185.0` at the inspected ref. Runtime dependencies use the matching npm release instead of cloning the multi-gigabyte fork into the application build.

## Manual checks executed

1. New `PotjieScene.tsx` TSX source passed a local compiler syntax/type-shape check using the available host TypeScript compiler with dependency shims.
2. `scripts/manual-validate.mjs` executed successfully against the authored source contract.
3. PWA standalone manifest, service worker source, KPGS runtime source, MERN API source, Three.js scene source and fork lineage are present.
4. Adaptive 3D retains a CSS fallback for `lite`, bounded DPR for `balanced/full`, reduced-motion/Save-Data behavior, and demand rendering when continuous animation is disabled.
5. `.github/workflows/ci.yml` is absent.
6. The pinned package versions were checked against the public npm package listings before final pinning.

## Build command for a dependency-installed machine

```bash
npm install
npm run build
```

Boundary: `MANUAL SOURCE VALIDATION ≠ DEPLOYMENT VALIDATION`.
