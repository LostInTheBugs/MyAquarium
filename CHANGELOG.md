# Changelog

All notable changes to MyAquarium are documented in this file.

## [2026.09.002] — 2026-09-15

### Added
- **Real swim animation**: 10 fish species play keyed frame-strip atlases (extracted from the project's LTX video clips) through per-fish texture-offset playback (~12 fps, individual phase, slowed while idling) — fins, tail and body visibly move; the vertex-shader undulation (body S-curve + tail beat) remains as a second layer
- Per-species heading map (`FISH_FACING`): each sprite's native orientation is declared, so fish always show their head towards their direction of travel
- Scene dressing: dark stand under the tank, room environment (floor + rear wall, 3D view only), LED light fixture with L-brackets, water surface tint with an animated surface normal map, air tubing at the tank edge

### Changed
- Glass is now a plain transparent `meshPhysicalMaterial` — the previous `transmission` glass rendered only opaque geometry in its internal pass, hiding every alpha-tested sprite from outside the tank
- Fish billboards flip from the exact trajectory derivative compared with the species' native sprite orientation
- Sprite chroma-key cleanup: `plant-red`, `plant-moss` and `coral-colorful` had failed keying (opaque magenta patches, up to 16.6% of the sprite) — alpha cleaned, texture versions bumped
- Showcase presets: the air pump and the skimmer now sit on the substrate instead of floating mid-water

### Fixed
- All tank life (fish, plants, corals, bubbles, particles) was invisible from outside the glass — the root cause of the earlier "empty tank" reports
- Fish swam tail-first: the flip logic assumed every sprite faces left, but sprites have mixed orientations
- Fish positions became `NaN` for element UUIDs starting with a letter (parsed from the UUID slice) — replaced by a stable per-fish random phase

## [2026.09.001] — 2026-09-14

### Added
- Photorealistic sprite rendering: the whole scenery (fish, plants, corals, rocks) is drawn from AI-generated RGBA sprites (ComfyUI / SDXL) presented as crossed billboards, with sprite widths derived from the actual image ratios
- Texture set in `public/textures/`: 8 substrate albedo + normal maps, 2 tank backdrops and 28 sprites (12 fish, 6 plants, 8 corals/invertebrates, 2 rocks)
- **Discover** section: species tiles per category with educational info cards (scientific name, size, behavior, diet, longevity, origin, IUCN status — Fishipedia-sourced) for 26 elements, illustrated with AI-generated animated WebP sprites
- **Showcase tanks**: one-click pre-decorated large aquariums for fresh and salt water (`src/data/presets.ts`)
- **2D face view** (orthographic camera) with an optional fullscreen wallpaper mode; the 3D camera position is preserved when switching between views
- Shared prop types (`PlantTypes.ts`, `CoralTypes.ts`) for the sprite components

### Changed
- Fish are camera-facing billboards, flipped left/right according to their swim direction — they stay visible from every camera angle
- Assets optimized: WebP sprites (quality 88, max 640 px) and JPEG normal maps — scene payload ≈ 9.5 MB (plus ≈ 13 MB of animated Discover sprites)
- Texture URLs are resolved against the Vite base path, so the app works at a domain root and under a sub-path alike
- `docker-compose.yml`: the Traefik hostname is configurable via `${DOMAIN:-your-domain.example.com}` — no hostname is hardcoded
- Repo housekeeping: `.gitignore` extended (`tools/`, `*.tsbuildinfo`, local test screenshots), stray non-app file removed

### Fixed
- Removed the depth fog that hid nearly the whole tank interior from front views (only the backdrop remained visible)
- Glass: reduced tint, thickness-based attenuation and controlled environment reflections for a clearer look
- Tank anchored on a dark ground plane with a soft contact shadow; animated caustics projected on the substrate

## 2026.08.001 (2026-08-01)

### Added
- Fichier `VERSION` à la racine contenant le numéro de version `2026.08.001`
- `.env.example` avec la variable `PORT=8000`
- Section déploiement Docker et configuration dans `README.md`
- Lien vers les releases GitHub dans `README.md`

### Changed
- Version dans `package.json` passée de `0.0.0` à `2026.08.001`
- Port d'écoute nginx par défaut de 80 → 8000, piloté par la variable d'environnement `PORT`
- `nginx.conf` : `listen` utilise `${PORT}` (template traité par l'entrypoint nginx officiel)
- `Dockerfile` : copie de `nginx.conf` comme template, `ENV PORT=8000`, `EXPOSE 8000`
- `docker-compose.yml` : `loadbalancer.server.port` mis à 8000, ajout de la variable `PORT` au service
- `README.md` : refonte complète avec description, installation, déploiement Docker, configuration, version et lien releases
