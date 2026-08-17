# 🐾 Paws & Potjie

**A comfort kitchen for dogs and their humans.**

Paws & Potjie is a fictional South African comfort-food experience built for the DEV Frontend Challenge: Comfort Food Edition, with a dog-first interaction layer inspired by the Dog Days prompt.

## Current POC

The repository is a **TypeScript 7 MERN Adaptive PWA** with a governed Three.js scene layer:

- React 19 + Vite 8 + TypeScript 7.0.2
- Three.js 0.185.0 + React Three Fiber/Drei
- deterministic Human × Dog “Comfort Compass” pairing logic
- adaptive `lite / balanced / full` runtime tiers
- CSS fallback on lite devices; 3D scene on balanced/full devices
- Save-Data and reduced-motion governance
- install manifest + service worker shell caching
- local KPGS scene contract + receipt event
- Express API + optional MongoDB/Mongoose persistence

## Three.js fork lineage

The runtime version is aligned to the inspected `RobynAwesome/three.js` fork at commit `d2ac59a15620ff8696dd55983c1f411c0a3f92ce`, whose package version is `0.185.0`.

See [`docs/THREEJS-LINEAGE.md`](docs/THREEJS-LINEAGE.md).

## Run it

```bash
npm install
npm run dev
```

Web: `http://localhost:5173`  
API: `http://localhost:8787/api/health`

## Manual validation — GitHub Actions intentionally not required

```bash
npm run validate:manual
npm run build
```

`validate:manual` is dependency-free and checks the TS7 pin, PWA source, KPGS runtime, Three.js fork lineage, adaptive fallback contract, and MERN source. `npm run build` then performs the actual TypeScript checks, Vite build, and POC gate on a machine with dependencies installed.

## Governance boundary

**INTERACTION ≠ PRODUCT CLAIM.** This is a fictional restaurant concept and the dog menu is illustrative, not veterinary or nutritional advice. Three.js immersion does not convert the concept into evidence of a physical business.

See [`docs/BRAND-LINEAGE.md`](docs/BRAND-LINEAGE.md) for the broader repository interaction lineage.
