# 🐠 MyAquarium — Interactive 3D Aquarium

Immersive web application to create and customize a realistic 3D aquarium in the browser. Choose fresh or salt water, stock your tank with fish, plants and decorations, then interact in real time with the Three.js scene.

Current version: **2026.08.001** — [See releases](https://github.com/LostInTheBugs/MyAquarium/releases)

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
cp .env.example .env        # PORT=8000 by default
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
| `PORT` | `8000` | Internal listen port of the nginx container. Overridable in `.env` or `docker-compose.yml`. |

The project has no other server configuration. The reverse proxy (Traefik) handles HTTPS and external routing on ports 80/443.

## 🏗️ Architecture

```
src/
├── main.tsx                          # Entry point
├── App.tsx                           # Root component
├── store.tsx                         # State management (Context + Reducer)
├── types.ts                          # TypeScript types
├── index.css                         # Global styles (Tailwind CSS)
├── data/
│   ├── index.ts                      # Unified data access
│   ├── freshwater.ts                 # Freshwater elements
│   └── marine.ts                     # Saltwater elements
└── components/
    ├── ConfigScreen.tsx              # Initial configuration screen
    ├── AquariumScene.tsx             # Main 3D scene (Three.js)
    ├── CustomizationPanel.tsx        # Side customization panel
    ├── InfoPanel.tsx                 # Info panel and object control
    ├── GlassTank.tsx                 # 3D glass tank
    ├── SandFloor.tsx                 # Floor / substrate
    ├── Fish.tsx                      # Animated fish
    ├── Plant.tsx                     # Plants with swaying animation
    ├── Coral.tsx                     # Corals and marine life
    ├── Decoration.tsx                # Decorations (castle, wreck, etc.)
    ├── Equipment.tsx                 # Equipment (pump, filter, etc.)
    ├── BubbleSystem.tsx              # Bubble system
    └── ParticleSystem.tsx            # Suspended particles
```

## 🎮 Features

- **Configuration**: fresh / salt water choice, 3 sizes
- **Customization**: add fish, plants, corals, decorations
- **Air pump**: on/off, 3 intensity levels
- **Realistic animations**: swimming fish, swaying plants
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

In `src/components/Fish.tsx`, add the color for the new `modelType` in the `useMemo` of colors.

### 3. Categories

If you add a new category, update:
- `src/types.ts` → `ElementCategory`
- `src/data/index.ts` → `categoryLabels`, `categoryIcons`

## Development cost (LLM)

This project was built entirely through AI-assisted sessions (Hermes Agent, deepseek-v4-pro / deepseek-v4-flash). Usage so far (cumulative as of 2026-08-02):

| Metric | Value |
|---|---|
| Input tokens | 750 878 |
| Output tokens | 502 973 |
| **Total (input + output)** | **1 253 851** |
| Cache read (reused at reduced price) | 118 600 448 |
| API calls | 978 |
| **Estimated cost** | **≈ 0.86 USD** |

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
