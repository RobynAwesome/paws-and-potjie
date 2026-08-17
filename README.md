# 🐾 Paws & Potjie

**A comfort kitchen for dogs and their humans.**

Paws & Potjie is a fictional South African comfort-food experience built for the DEV Frontend Challenge: Comfort Food Edition, with a dog-first interaction layer inspired by the Dog Days prompt.

## What changed

The original visual concept is now repository-native and governed as a **TypeScript 7 MERN Adaptive PWA**:

- React 19 + Vite 8 + TypeScript 7.0.2
- deterministic Human × Dog “Comfort Compass” pairing logic
- adaptive experience tiers for mobile, low-resource devices, Save-Data and reduced motion
- install manifest + service worker shell caching
- local KPGS scene contract + receipt event
- Express API + optional MongoDB/Mongoose persistence
- CI POC gate that validates source, build and PWA/KPGS requirements

## Run it

```bash
npm install
npm run dev
```

Web: `http://localhost:5173`  
API: `http://localhost:8787/api/health`

Build and validate:

```bash
npm run build
```

## Governance boundary

**INTERACTION ≠ PRODUCT CLAIM.** This is a fictional restaurant concept and the dog menu is illustrative, not veterinary or nutritional advice. Frontend polish does not convert a concept into evidence of a physical business.

See [`docs/BRAND-LINEAGE.md`](docs/BRAND-LINEAGE.md) for the six-repository interaction lineage and KPGS/Skills mapping.
