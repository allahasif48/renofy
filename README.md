# Renofy Immersive

A separate proof-of-concept homepage for Renofy built around one continuous 3D house journey.

## Experience

Scroll path:

1. Exterior
2. Front entrance / foyer
3. Living room
4. Kitchen
5. Bathroom
6. Basement
7. Final renovation CTA

The house uses one visual system throughout: warm off-white walls, oak floors, matte-black frames, stone surfaces and restrained gold/brass details. The camera moves through one continuous 3D scene rather than switching between unrelated photos.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints in the terminal.

## Production build

```bash
npm run build
```

The static production files will be in `dist/`.

## GitHub Pages

`vite.config.js` currently uses `base: './'`, which works for a repository deployment. You can publish the `dist` folder using your preferred GitHub Pages workflow.

## Before launch

Replace the placeholder phone number in `src/App.jsx`:

```jsx
<a href="tel:+10000000000">Call Renofy</a>
```

The email is currently set to `hello@renofy.ca`.

## Next upgrade path

This foundation is already 3D. Later improvements can be added without rebuilding the site architecture:

- GLB/GLTF architectural model replacing primitive geometry
- realistic PBR materials
- animated front door
- before/after hotspots
- real Renofy project photos in room overlays
- room-specific ambient audio
- quality tiers for desktop/mobile GPUs
- smooth scroll damping / GSAP camera choreography
