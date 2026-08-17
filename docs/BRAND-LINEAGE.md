# Brand & Interaction Lineage

Paws & Potjie is its own product identity; it borrows **interaction governance**, not logos or page cloning.

## Repository-native precedents

1. **RobynAwesome/Kopano-Labs-Website** — TypeScript 7, React 19, Vite 8, adaptive experience tiers, KPGS scene contracts, reduced-motion/save-data handling, and local receipts.
2. **RobynAwesome/Bookit-5s-Arena** — offline-sync validation, Mongo/Mongoose persistence patterns, React motion stack, and explicit runtime validation scripts.
3. **RobynAwesome/Project-Jennifer** — dual TypeScript 6/7 migration discipline and governance validation as a first-class build concern.
4. **RobynAwesome/cars4mars-landingpage** — mobile-first React presentation, Framer Motion, clear proof boundaries, and challenge-facing landing-page hierarchy.
5. **RobynAwesome/crisis-connect** — Adaptive PWA / field-resilience precedent: the experience must degrade safely rather than simply disappear when connectivity does.
6. **RobynAwesome/amaphu-app** — product identity separated from governance scaffolding; project-specific UI remains legible while KPGS stays underneath the surface.

## Applied here

- **One hero moment, supporting motion only.** Motion explains hierarchy and feedback; it is disabled or reduced for save-data, low-resource, and reduced-motion users.
- **Mobile is canonical, not a compressed desktop afterthought.** Navigation, pairing logic, cards, and disclosures remain complete at narrow widths.
- **Interaction creates a receipt.** KPGS runtime metadata is applied as root data attributes and emits a local `kpgs:receipt` event without pretending that interaction equals validation.
- **FOC stripping.** The public site is a fictional kitchen concept. No visual or interaction is treated as proof of a real restaurant, dog nutrition product, or veterinary claim.
- **PWA resilience.** The shell caches after first production load and exposes offline state rather than failing silently.
- **MERN remains additive.** The frontend works without the API; Express/Mongo persist pairing receipts when infrastructure is available.

## Skills applied

From `RobynAwesome/Skills`:
- `design-first-ui-prompting` — one system, explicit hierarchy, restrained palette, stable typography and spacing.
- `animation-systems` — motion for hierarchy/feedback/continuity, transform + opacity primitives, reduced-motion support, and mobile-aware restraint.
- Web-design collection — reusable scroll/motion/atmosphere patterns used selectively rather than as decoration.
