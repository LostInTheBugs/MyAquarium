import { useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * Préfixe toutes les URLs d'assets avec le base path de Vite ("" en dev,
 * "/aquarium/" en production sous le sous-chemin) — les chemins absolus
 * /textures/... casseraient sous un sous-chemin.
 */
const asset = (p: string): string => import.meta.env.BASE_URL + p.replace(/^\//, '');

/**
 * Charge une texture sans casser la scène si le fichier est absent.
 * Retourne null tant que la texture n'est pas prête (ou en cas d'erreur).
 */
export function useTextureSafe(url: string | null | undefined): THREE.Texture | null {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!url) {
      setTex(null);
      return;
    }
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (t) => {
        if (cancelled) {
          t.dispose();
          return;
        }
        t.colorSpace = THREE.SRGBColorSpace;
        setTex(t);
      },
      undefined,
      () => {
        if (!cancelled) setTex(null);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [url]);
  return tex;
}

/** Chemins des textures de substrat, indexées par elementId. */
export const SUBSTRATE_TEXTURES: Record<string, { albedo: string; normal: string }> = {
  'sand-light': { albedo: asset('/textures/substrate/sand-light.jpg?v=2'), normal: asset('/textures/substrate/sand-light_normal.jpg?v=2') },
  'sand-dark': { albedo: asset('/textures/substrate/sand-dark.jpg?v=2'), normal: asset('/textures/substrate/sand-dark_normal.jpg?v=2') },
  gravel: { albedo: asset('/textures/substrate/gravel.jpg?v=2'), normal: asset('/textures/substrate/gravel_normal.jpg?v=2') },
  pebbles: { albedo: asset('/textures/substrate/pebbles.jpg?v=2'), normal: asset('/textures/substrate/pebbles_normal.jpg?v=2') },
  'plant-substrate': { albedo: asset('/textures/substrate/plant-substrate.jpg?v=2'), normal: asset('/textures/substrate/plant-substrate_normal.jpg?v=2') },
  'marine-sand': { albedo: asset('/textures/substrate/marine-sand.jpg?v=2'), normal: asset('/textures/substrate/marine-sand_normal.jpg?v=2') },
  aragonite: { albedo: asset('/textures/substrate/aragonite.jpg?v=2'), normal: asset('/textures/substrate/aragonite_normal.jpg?v=2') },
  'crushed-coral': { albedo: asset('/textures/substrate/crushed-coral.jpg?v=2'), normal: asset('/textures/substrate/crushed-coral_normal.jpg?v=2') },
};

/** Chemins des fonds d'aquarium par waterType. */
export const BACKGROUND_TEXTURES: Record<string, string> = {
  freshwater: asset('/textures/background/freshwater.jpg?v=2'),
  marine: asset('/textures/background/marine.jpg?v=2'),
};

/** Chemins des sprites plantes (modelType -> sprite). */
export const PLANT_SPRITES: Record<string, string> = {
  'plant-tall': asset('/textures/sprites/plant-tall.webp?v=2'),
  'plant-broad': asset('/textures/sprites/plant-broad.webp?v=2'),
  'plant-fern': asset('/textures/sprites/plant-fern.webp?v=2'),
  'plant-moss': asset('/textures/sprites/plant-moss.webp?v=3'),
  'plant-red': asset('/textures/sprites/plant-red.webp?v=3'),
  'plant-grass': asset('/textures/sprites/plant-grass.webp?v=2'),
};

/** Chemins des sprites coraux / invertébrés (modelType -> sprite). */
export const CORAL_SPRITES: Record<string, string> = {
  'coral-brain': asset('/textures/sprites/coral-brain.webp?v=2'),
  'coral-branch': asset('/textures/sprites/coral-branch.webp?v=2'),
  'coral-colorful': asset('/textures/sprites/coral-colorful.webp?v=3'),
  anemone: asset('/textures/sprites/anemone.webp?v=2'),
  starfish: asset('/textures/sprites/starfish.webp?v=2'),
  urchin: asset('/textures/sprites/urchin.webp?v=2'),
  crab: asset('/textures/sprites/crab.webp?v=2'),
  shrimp: asset('/textures/sprites/shrimp.webp?v=2'),
};

/** Sprites de roches pour le sol. */
export const ROCK_SPRITES = [asset('/textures/sprites/rock-1.webp?v=2'), asset('/textures/sprites/rock-2.webp?v=2')];

/**
 * Sprites de poissons (modelType -> sprite profil).
 * Orientation de la tête DANS l'image : FISH_FACING ci-dessous (mixte selon
 * l'espèce — les sprites ont été générés à des orientations différentes).
 */
export const FISH_SPRITES: Record<string, string> = {
  'fish-neon': asset('/textures/sprites/fish-neon.webp?v=2'),
  'fish-guppy': asset('/textures/sprites/fish-guppy.webp?v=2'),
  'fish-angelfish': asset('/textures/sprites/fish-angelfish.webp?v=2'),
  'fish-betta': asset('/textures/sprites/fish-betta.webp?v=2'),
  'fish-molly': asset('/textures/sprites/fish-molly.webp?v=2'),
  'fish-cory': asset('/textures/sprites/fish-cory.webp?v=2'),
  'fish-gold': asset('/textures/sprites/fish-gold.webp?v=2'),
  'fish-clown': asset('/textures/sprites/fish-clown.webp?v=2'),
  'fish-tang': asset('/textures/sprites/fish-tang.webp?v=2'),
  'fish-butterfly': asset('/textures/sprites/fish-butterfly.webp?v=2'),
  'fish-goby': asset('/textures/sprites/fish-goby.webp?v=2'),
  'fish-damsel': asset('/textures/sprites/fish-damsel.webp?v=2'),
};

/**
 * Orientation native de chaque sprite : côté où se trouve la TÊTE dans
 * l'image (vérifié espèce par espèce). Sert au retournement horizontal
 * quand le poisson nage dans l'autre sens à l'écran.
 */
export const FISH_FACING: Record<string, 'left' | 'right'> = {
  'fish-neon': 'left',
  'fish-clown': 'left',
  'fish-angelfish': 'left',
  'fish-butterfly': 'left',
  'fish-guppy': 'left',
  'fish-tang': 'right',
  'fish-gold': 'right',
  'fish-molly': 'right',
  'fish-cory': 'right',
  'fish-goby': 'right',
  'fish-damsel': 'right',
  'fish-betta': 'right',
};

/**
 * Atlas de nage pour le bac 3D : bandes horizontales de frames keyées (RGBA)
 * dérivées des clips LTX (voir tools/lab/key_anim.py). Purement visuel :
 * `frames` = nombre de frames dans l'atlas ; la hauteur d'une frame = hauteur
 * de l'atlas, la largeur = largeur / frames. Espèces absentes d'ici = pas
 * d'animation (sprite statique + ondulation shader seulement).
 */
export const FISH_ATLAS: Record<string, { url: string; frames: number }> = {
  'fish-neon': { url: asset('/textures/sprites/anim-atlas/fish-neon.webp?v=1'), frames: 12 },
  'fish-angelfish': { url: asset('/textures/sprites/anim-atlas/fish-angelfish.webp?v=1'), frames: 33 },
  'fish-betta': { url: asset('/textures/sprites/anim-atlas/fish-betta.webp?v=1'), frames: 33 },
  'fish-molly': { url: asset('/textures/sprites/anim-atlas/fish-molly.webp?v=1'), frames: 33 },
  'fish-cory': { url: asset('/textures/sprites/anim-atlas/fish-cory.webp?v=1'), frames: 33 },
  'fish-gold': { url: asset('/textures/sprites/anim-atlas/fish-gold.webp?v=1'), frames: 33 },
  'fish-tang': { url: asset('/textures/sprites/anim-atlas/fish-tang.webp?v=1'), frames: 33 },
  'fish-butterfly': { url: asset('/textures/sprites/anim-atlas/fish-butterfly.webp?v=1'), frames: 33 },
  'fish-goby': { url: asset('/textures/sprites/anim-atlas/fish-goby.webp?v=1'), frames: 33 },
  'fish-damsel': { url: asset('/textures/sprites/anim-atlas/fish-damsel.webp?v=1'), frames: 33 },
};

/**
 * Animations WebP générées par IA (LTX-Video via ComfyUI) pour les fiches
 * Découverte : modelType -> /textures/sprites/anim/<modelType>.webp
 * Générées le 2026-08-10 (26 sprites : 12 poissons, 6 plantes, 8 coraux/invertébrés).
 */
export const ANIM_SPRITES: Record<string, string> = {
  'fish-neon': asset('/textures/sprites/anim/fish-neon.webp?v=1'),
  'fish-guppy': asset('/textures/sprites/anim/fish-guppy.webp?v=1'),
  'fish-angelfish': asset('/textures/sprites/anim/fish-angelfish.webp?v=1'),
  'fish-betta': asset('/textures/sprites/anim/fish-betta.webp?v=1'),
  'fish-molly': asset('/textures/sprites/anim/fish-molly.webp?v=1'),
  'fish-cory': asset('/textures/sprites/anim/fish-cory.webp?v=1'),
  'fish-gold': asset('/textures/sprites/anim/fish-gold.webp?v=1'),
  'fish-clown': asset('/textures/sprites/anim/fish-clown.webp?v=1'),
  'fish-tang': asset('/textures/sprites/anim/fish-tang.webp?v=1'),
  'fish-butterfly': asset('/textures/sprites/anim/fish-butterfly.webp?v=1'),
  'fish-goby': asset('/textures/sprites/anim/fish-goby.webp?v=1'),
  'fish-damsel': asset('/textures/sprites/anim/fish-damsel.webp?v=1'),
  'plant-tall': asset('/textures/sprites/anim/plant-tall.webp?v=1'),
  'plant-broad': asset('/textures/sprites/anim/plant-broad.webp?v=1'),
  'plant-fern': asset('/textures/sprites/anim/plant-fern.webp?v=1'),
  'plant-moss': asset('/textures/sprites/anim/plant-moss.webp?v=1'),
  'plant-red': asset('/textures/sprites/anim/plant-red.webp?v=1'),
  'plant-grass': asset('/textures/sprites/anim/plant-grass.webp?v=1'),
  'coral-brain': asset('/textures/sprites/anim/coral-brain.webp?v=1'),
  'coral-branch': asset('/textures/sprites/anim/coral-branch.webp?v=1'),
  'coral-colorful': asset('/textures/sprites/anim/coral-colorful.webp?v=1'),
  anemone: asset('/textures/sprites/anim/anemone.webp?v=1'),
  starfish: asset('/textures/sprites/anim/starfish.webp?v=1'),
  urchin: asset('/textures/sprites/anim/urchin.webp?v=1'),
  crab: asset('/textures/sprites/anim/crab.webp?v=1'),
  shrimp: asset('/textures/sprites/anim/shrimp.webp?v=1'),
};
