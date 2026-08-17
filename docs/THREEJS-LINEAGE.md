# Three.js Runtime Lineage

Paws & Potjie uses Three.js as an **adaptive scene layer**, not as decorative WebGL for every device.

## Governed source

- Fork: `RobynAwesome/three.js`
- Fork branch inspected: `dev`
- Pinned source commit: `d2ac59a15620ff8696dd55983c1f411c0a3f92ce`
- Fork package version at that commit: `0.185.0`
- Runtime dependency: `three@0.185.0`

The app deliberately installs the matching npm runtime instead of cloning the full fork into the application dependency graph. The fork is very large; pinning the inspected commit as lineage while consuming the matching package version keeps installs and deployment builds bounded.

## Runtime contract

- `lite`: no WebGL scene; existing CSS potjie illustration remains the canonical fallback.
- `balanced`: Three.js scene enabled at DPR 1–1.2 with restrained geometry.
- `full`: Three.js scene enabled at DPR 1–1.5 with higher geometry and shadows.
- Save-Data or reduced-motion users do not receive continuous scene motion.
- Pointer response is lerped through `THREE.MathUtils.damp`, avoiding layout/reflow animation.
- No remote 3D assets, HDR files, or model downloads are required for the hero scene.

## Why this is KPGS-compatible

The 3D surface follows the same rule as the rest of the product: **interaction has to communicate something**. The potjie responds softly to pointer position, the scene tier reflects device/runtime constraints, and the CSS fallback carries the same meaning when WebGL is inappropriate.

Boundary: `THREE.JS IMMERSION ≠ PRODUCT VALIDATION`.
