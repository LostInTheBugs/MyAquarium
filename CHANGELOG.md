# Changelog

All notable changes to MyAquarium are documented in this file.

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
