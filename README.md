# 🐠 MyAquarium — Interactive 3D Aquarium

Immersive web application to create and customize a realistic 3D aquarium in the browser. Choose fresh or salt water, stock your tank with fish, plants and decorations, then interact in real time with the Three.js scene.

Current version: **2026.09.002** — [See releases](https://github.com/LostInTheBugs/MyAquarium/releases)

## 🚀 Installation

```bash
git clone git@github.com:LostInTheBugs/MyAquarium.git
cd MyAquarium
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (Vite dev server).

## 🐳 Docker deployment

```bash
cp .env.example .env        # set DOMAIN and PORT (defaults shown in .env.example)
docker compose up -d
```

The image uses `nginx:alpine` to serve the static build. The internal nginx listen port is driven by the `PORT` environment variable (default **8000**). The included `docker-compose.yml` integrates with Traefik as a reverse proxy.

Manual build without compose:

```bash
docker build -t myaquarium .
docker run -d -p 8000:8000 -e PORT=8000 myaquarium
```

## ⚙️ Configuration

| Variable | Default | Description |
|---|---|---|
| `DOMAIN` | `your-domain.example.com` | Hostname announced by the Traefik reverse proxy for this app (`${DOMAIN}` in `docker-compose.yml`). |
| `PORT` | `8000` | Internal listen port of the nginx container. Overridable in `.env` or `docker-compose.yml`. |

The project has no other server configuration. The reverse proxy (Traefik) handles HTTPS and external routing on ports 80/443.

## 🏗️ Architecture

```
src/
├── main.tsx                          # Entry point
├── App.tsx                           # Root component — screens, view modes, fullscreen
├── store.tsx                         # State management (Context + Reducer)
├── types.ts                          # TypeScript types
├── index.css                         # Global styles (Tailwind CSS) + keyframes
├── data/
│   ├── index.ts                      # Unified data access
│   ├── freshwater.ts                 # Freshwater elements (+ info cards)
│   ├── marine.ts                     # Saltwater elements (+ info cards)
│   └── presets.ts                    # Showcase tanks (pre-decorated)
├── hooks/
│   └── useAudioSystem.ts             # Procedural ambience audio
└── components/
    ├── ConfigScreen.tsx              # Home screen — water type, size, showcases
    ├── DiscoverScreen.tsx            # Discover pages — tiles + info modals
    ├── AquariumScene.tsx             # Main 3D scene (Three.js) + 2D/3D camera rig
    ├── TankStand.tsx                 # Dark stand under the tank
    ├── RoomEnvironment.tsx           # Room floor + rear wall (3D view only)
    ├── CustomizationPanel.tsx        # Side customization panel
    ├── InfoPanel.tsx                 # Info panel and object control
    ├── GlassTank.tsx                 # 3D glass tank
    ├── SandFloor.tsx                 # Floor / substrate
    ├── Billboard.tsx                 # Crossed textured planes (sprites)
    ├── textures.ts                   # Texture/sprite URL maps + safe loader
    ├── Fish.tsx                      # Camera-facing sprite fish with animated swim frames
    ├── Plant.tsx / PlantTypes.ts     # Plants (sprites) + shared prop types
    ├── Coral.tsx / CoralTypes.ts     # Corals & invertebrates (sprites) + shared prop types
    ├── Decoration.tsx                # Decorations (castle, wreck, etc.)
    ├── Equipment.tsx                 # Equipment (pump, filter, etc.)
    ├── BubbleSystem.tsx              # Bubble system
    └── ParticleSystem.tsx            # Suspended particles
```

Textures and sprites live in `public/textures/` (substrate/ , background/ , sprites/ , sprites/anim/ , sprites/anim-atlas/).

## 🎮 Features

- **Configuration**: fresh / salt water choice, 3 sizes
- **Customization**: add fish, plants, corals, decorations
- **Photorealistic rendering**: AI-generated textures and sprites for fish, plants, corals, substrates and backdrops
- **Discover section**: educational species cards (scientific name, size, diet, longevity, IUCN status…) with animated illustrations
- **Showcase tanks**: pre-decorated fresh / salt water aquariums in one click
- **2D view**: face view of the tank, with an optional fullscreen wallpaper mode
- **Air pump**: on/off, 3 intensity levels
- **Realistic animations**: swimming fish, swaying plants, projected caustics
- **3D interaction**: rotation, zoom, object selection and movement
- **Local save**: persistence in localStorage
- **3 graphics levels**: low, medium, high quality

## ➕ Adding new elements

### 1. Add a fish

In `src/data/freshwater.ts` or `src/data/marine.ts`:

```typescript
{
  id: 'my-new-fish',
  name: 'My Fish',
  category: 'fish',
  waterType: 'freshwater',  // or 'marine' or 'both'
  minTankSize: 'small',     // 'small' | 'medium' | 'large'
  maxCount: 8,
  description: 'Short description.',
  icon: '🐟',
  modelType: 'fish-custom',  // identifier for the 3D render
}
```

### 2. Add the 3D render

In `src/components/AquariumScene.tsx`, add a case to the switch:

```tsx
case 'fish':
  return <Fish modelType={element.modelType} ... />;
```

Then map the new `modelType` to its sprite in `src/components/textures.ts` (`FISH_SPRITES`) — fish are drawn as camera-facing billboards.

### 3. Categories

If you add a new category, update:
- `src/types.ts` → `ElementCategory`
- `src/data/index.ts` → `categoryLabels`, `categoryIcons`

## Development cost (LLM)

This project was built entirely through AI-assisted sessions (Hermes Agent, deepseek-v4-pro / deepseek-v4-flash). Usage so far (cumulative as of 2026-09-15):

| Metric | Value |
|---|---|
| Input tokens | 2 219 985 |
| Output tokens | 984 084 |
| **Total (input + output)** | **3 204 069** |
| Cache read (reused at reduced price) | 260 366 080 |
| API calls | 1 545 |
| **Estimated cost** | **≈ 1.66 USD** |

Full breakdown: [TOKENS.md](TOKENS.md).

## 🔄 Replacing models with GLTF/GLB files

The current 3D models are procedural. To use GLTF/GLB files:

1. Place the files in `public/models/`
2. Replace the corresponding component with `useGLTF` from `@react-three/drei`:

```tsx
import { useGLTF } from '@react-three/drei';

function CustomModel({ position, scale }: { position: [number, number, number], scale: number }) {
  const { scene } = useGLTF('/models/my-model.glb');
  return <primitive object={scene} position={position} scale={scale} />;
}
```

## ⚙️ Changing the compatibility rules

In `src/store.tsx`, function `canAddElement()`:
- Minimum size: `sizeOrder.indexOf(config.size) < sizeOrder.indexOf(element.minTankSize)`
- Maximum count: `existingCount >= element.maxCount`
- Fish capacity: `totalFish >= maxFishCount(config.size)`
- Water compatibility: `element.waterType !== config.waterType`

Modify these conditions to adjust the rules.

## 🛠️ Technologies

- **React 19** + **TypeScript 6**
- **Three.js** + **React Three Fiber** + **Drei** (3D rendering)
- **Tailwind CSS 4** (styles)
- **Vite 8** (build / dev server)

## 📦 Production build

```bash
npm run build
npm run preview
```
