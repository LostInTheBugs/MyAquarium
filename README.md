# 🐠 MyAquarium — Aquarium 3D Interactif

Application web immersive de création et personnalisation d'un aquarium 3D réaliste dans le navigateur. Choisissez eau douce ou eau de mer, peuplez votre bac de poissons, plantes et décorations, puis interagissez en temps réel avec la scène Three.js.

Version courante : **2026.08.001** — [Voir les releases](https://github.com/LostInTheBugs/MyAquarium/releases)

## 🚀 Installation

```bash
git clone git@github.com:LostInTheBugs/MyAquarium.git
cd MyAquarium
npm install
npm run dev
```

L'application sera accessible sur `http://localhost:5173` (dev server Vite).

## 🐳 Déploiement Docker

```bash
cp .env.example .env        # PORT=8000 par défaut
docker compose up -d
```

L'image utilise `nginx:alpine` pour servir le build statique. Le port d'écoute interne de nginx est piloté par la variable d'environnement `PORT` (défaut **8000**). Le `docker-compose.yml` inclus s'intègre avec Traefik comme reverse proxy.

Build manuel sans compose :

```bash
docker build -t myaquarium .
docker run -d -p 8000:8000 -e PORT=8000 myaquarium
```

## ⚙️ Configuration

| Variable | Défaut | Description |
|---|---|---|
| `PORT` | `8000` | Port d'écoute interne du conteneur nginx. Surchargeable dans `.env` ou `docker-compose.yml`. |

Le projet ne comporte pas d'autre configuration serveur. Le reverse proxy (Traefik) gère le HTTPS et le routage externe sur les ports 80/443.

## 🏗️ Architecture

```
src/
├── main.tsx                          # Point d'entrée
├── App.tsx                           # Composant racine
├── store.tsx                         # State management (Context + Reducer)
├── types.ts                          # Types TypeScript
├── index.css                         # Styles globaux (Tailwind CSS)
├── data/
│   ├── index.ts                      # Accès unifié aux données
│   ├── freshwater.ts                 # Éléments eau douce
│   └── marine.ts                     # Éléments eau de mer
└── components/
    ├── ConfigScreen.tsx              # Écran de configuration initiale
    ├── AquariumScene.tsx             # Scène 3D principale (Three.js)
    ├── CustomizationPanel.tsx        # Panneau latéral de personnalisation
    ├── InfoPanel.tsx                 # Panneau d'informations et contrôle objet
    ├── GlassTank.tsx                 # Cuve en verre 3D
    ├── SandFloor.tsx                 # Sol / substrat
    ├── Fish.tsx                      # Poissons animés
    ├── Plant.tsx                     # Plantes avec animation de balancement
    ├── Coral.tsx                     # Coraux et vie marine
    ├── Decoration.tsx                # Décorations (château, épave, etc.)
    ├── Equipment.tsx                 # Équipements (pompe, filtre, etc.)
    ├── BubbleSystem.tsx              # Système de bulles
    └── ParticleSystem.tsx            # Particules en suspension
```

## 🎮 Fonctionnalités

- **Configuration** : Choix eau douce / eau de mer, 3 tailles
- **Personnalisation** : Ajout de poissons, plantes, coraux, décorations
- **Pompe à air** : Activation/désactivation, 3 niveaux d'intensité
- **Animations réalistes** : Poissons qui nagent, plantes qui ondulent
- **Interaction 3D** : Rotation, zoom, sélection et déplacement d'objets
- **Sauvegarde locale** : Persistance dans localStorage
- **3 niveaux graphiques** : Basse, moyenne, haute qualité

## ➕ Ajouter de nouveaux éléments

### 1. Ajouter un poisson

Dans `src/data/freshwater.ts` ou `src/data/marine.ts` :

```typescript
{
  id: 'mon-nouveau-poisson',
  name: 'Mon Poisson',
  category: 'fish',
  waterType: 'freshwater',  // ou 'marine' ou 'both'
  minTankSize: 'small',     // 'small' | 'medium' | 'large'
  maxCount: 8,
  description: 'Description courte.',
  icon: '🐟',
  modelType: 'fish-custom',  // identifiant pour le rendu 3D
}
```

### 2. Ajouter le rendu 3D

Dans `src/components/AquariumScene.tsx`, ajouter un cas dans le switch :

```tsx
case 'fish':
  return <Fish modelType={element.modelType} ... />;
```

Dans `src/components/Fish.tsx`, ajouter la couleur pour le nouveau `modelType` dans le `useMemo` des couleurs.

### 3. Catégories

Si vous ajoutez une nouvelle catégorie, mettez à jour :
- `src/types.ts` → `ElementCategory`
- `src/data/index.ts` → `categoryLabels`, `categoryIcons`

## 🔄 Remplacer les modèles par des fichiers GLTF/GLB

Les modèles 3D actuels sont procéduraux. Pour utiliser des fichiers GLTF/GLB :

1. Placer les fichiers dans `public/models/`
2. Remplacer le composant correspondant par `useGLTF` de `@react-three/drei` :

```tsx
import { useGLTF } from '@react-three/drei';

function CustomModel({ position, scale }: { position: [number, number, number], scale: number }) {
  const { scene } = useGLTF('/models/mon-modele.glb');
  return <primitive object={scene} position={position} scale={scale} />;
}
```

## ⚙️ Modifier les règles de compatibilité

Dans `src/store.tsx`, fonction `canAddElement()` :
- Taille minimum : `sizeOrder.indexOf(config.size) < sizeOrder.indexOf(element.minTankSize)`
- Nombre maximum : `existingCount >= element.maxCount`
- Capacité poissons : `totalFish >= maxFishCount(config.size)`
- Compatibilité eau : `element.waterType !== config.waterType`

Modifier ces conditions pour ajuster les règles.

## 🛠️ Technologies

- **React 19** + **TypeScript 6**
- **Three.js** + **React Three Fiber** + **Drei** (rendu 3D)
- **Tailwind CSS 4** (styles)
- **Vite 8** (build / dev server)

## 📦 Build production

```bash
npm run build
npm run preview
```
