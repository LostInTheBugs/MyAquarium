import { useMemo } from 'react';
import type { CoralProps } from './CoralTypes';
import { useTextureSafe, CORAL_SPRITES } from './textures';
import { Billboard } from './Billboard';

// Taille cible (hauteur) + comportement par type de corail.
// La largeur est dérivée du ratio réel du sprite.
// orientation: 'vertical' = billboard debout, 'horizontal' = posé à plat (vu de dessus)
const CONFIG: Record<string, { h: number; planes: number; pulse: number; orientation: 'vertical' | 'horizontal' }> = {
  'coral-brain': { h: 0.6, planes: 2, pulse: 0, orientation: 'vertical' },
  'coral-branch': { h: 0.95, planes: 3, pulse: 0, orientation: 'vertical' },
  'coral-colorful': { h: 0.7, planes: 3, pulse: 0.04, orientation: 'vertical' },
  anemone: { h: 0.8, planes: 3, pulse: 0.09, orientation: 'vertical' },
  starfish: { h: 0.5, planes: 1, pulse: 0, orientation: 'horizontal' },
  urchin: { h: 0.55, planes: 2, pulse: 0, orientation: 'vertical' },
  crab: { h: 0.42, planes: 2, pulse: 0, orientation: 'vertical' },
  shrimp: { h: 0.4, planes: 2, pulse: 0, orientation: 'vertical' },
};
const DEFAULT = { h: 0.7, planes: 2, pulse: 0, orientation: 'vertical' as const };

export function Coral({ modelType, position, scale, isSelected, onSelect }: CoralProps) {
  const cfg = CONFIG[modelType] ?? DEFAULT;
  const url = CORAL_SPRITES[modelType];
  const tex = useTextureSafe(url);

  // Ratio réel du sprite -> largeur sans déformation
  const dims = useMemo(() => {
    const h = cfg.h * scale;
    const img = tex?.image as HTMLImageElement | undefined;
    const ratio = img && img.width ? img.width / img.height : 0.9;
    return { w: h * ratio, h };
  }, [cfg, scale, tex]);

  if (!tex) return null;

  // Ancrage bas pour les éléments posés debout ; centre pour ceux à plat
  // (starfish, orientation horizontale).
  const anchored: [number, number, number] = cfg.orientation === 'horizontal'
    ? [position[0], position[1] + dims.h * 0.12, position[2]]
    : [position[0], position[1] + dims.h / 2, position[2]];

  return (
    <Billboard
      texture={tex}
      width={dims.w}
      height={dims.h}
      planes={cfg.planes}
      position={anchored}
      orientation={cfg.orientation}
      pulse={cfg.pulse}
      onSelect={onSelect}
      selected={isSelected}
    />
  );
}
