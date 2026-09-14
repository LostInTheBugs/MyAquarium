import { useMemo } from 'react';
import type { PlantProps } from './PlantTypes';
import { useTextureSafe, PLANT_SPRITES } from './textures';
import { Billboard } from './Billboard';

// Tailles cibles (hauteur en unités monde) et balancement par type de plante.
// La largeur est dérivée du ratio réel du sprite (pas de déformation).
const CONFIG: Record<string, { h: number; planes: number; sway: number; seed: number }> = {
  'plant-tall': { h: 1.15, planes: 3, sway: 0.12, seed: 0.35 },
  'plant-broad': { h: 0.75, planes: 2, sway: 0.05, seed: 0.3 },
  'plant-fern': { h: 0.8, planes: 3, sway: 0.1, seed: 0.25 },
  'plant-moss': { h: 0.45, planes: 3, sway: 0.03, seed: 0.2 },
  'plant-red': { h: 0.9, planes: 3, sway: 0.09, seed: 0.4 },
  'plant-grass': { h: 0.55, planes: 3, sway: 0.06, seed: 0.15 },
};
const DEFAULT = { h: 0.8, planes: 3, sway: 0.08, seed: 0.3 };

export function Plant({ modelType, position, scale, isSelected, onSelect }: PlantProps) {
  const cfg = CONFIG[modelType] ?? DEFAULT;
  const url = PLANT_SPRITES[modelType] ?? PLANT_SPRITES['plant-tall'];
  const tex = useTextureSafe(url);

  // Ratio réel du sprite -> largeur du billboard sans déformation
  const dims = useMemo(() => {
    const h = cfg.h * scale;
    const img = tex?.image as HTMLImageElement | undefined;
    const ratio = img && img.width ? img.width / img.height : 0.6;
    return { w: h * ratio, h };
  }, [cfg, scale, tex]);

  if (!tex) return null; // texture pas encore chargée (ou absente)

  // Ancrage bas : la base du sprite repose sur le sol (le sprite est recadré
  // serré sur la plante, sa base touche le bas de l'image).
  const anchored: [number, number, number] = [position[0], position[1] + dims.h / 2, position[2]];

  return (
    <Billboard
      texture={tex}
      width={dims.w}
      height={dims.h}
      planes={cfg.planes}
      position={anchored}
      sway={cfg.sway}
      seed={cfg.seed}
      onSelect={onSelect}
      selected={isSelected}
    />
  );
}
