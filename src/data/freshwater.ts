import type { AquariumElement } from '../types';

export const freshwaterElements: AquariumElement[] = [
  // --- Substrate ---
  { id: 'sand-light', name: 'Sable clair', category: 'substrate', waterType: 'freshwater', minTankSize: 'small', maxCount: 1, description: 'Sable fin de couleur claire, idéal pour un look naturel.', icon: '🟫', modelType: 'substrate' },
  { id: 'sand-dark', name: 'Sable foncé', category: 'substrate', waterType: 'freshwater', minTankSize: 'small', maxCount: 1, description: 'Sable foncé qui fait ressortir les couleurs des poissons.', icon: '🟤', modelType: 'substrate' },
  { id: 'gravel', name: 'Gravier', category: 'substrate', waterType: 'freshwater', minTankSize: 'small', maxCount: 1, description: 'Gravier classique pour aquarium.', icon: '🪨', modelType: 'substrate' },
  { id: 'pebbles', name: 'Galets', category: 'substrate', waterType: 'freshwater', minTankSize: 'small', maxCount: 1, description: 'Galets lisses de rivière.', icon: '🪨', modelType: 'substrate' },
  { id: 'plant-substrate', name: 'Substrat plantes', category: 'substrate', waterType: 'freshwater', minTankSize: 'small', maxCount: 1, description: 'Substrat nutritif spécial pour plantes.', icon: '🌱', modelType: 'substrate' },

  // --- Decorations ---
  { id: 'castle', name: 'Château', category: 'decorations', waterType: 'freshwater', minTankSize: 'medium', maxCount: 1, description: 'Château décoratif en résine.', icon: '🏰', modelType: 'castle' },
  { id: 'shipwreck', name: 'Épave', category: 'decorations', waterType: 'freshwater', minTankSize: 'medium', maxCount: 1, description: 'Épave de bateau mystérieuse.', icon: '🚢', modelType: 'shipwreck' },
  { id: 'chest', name: 'Coffre', category: 'decorations', waterType: 'freshwater', minTankSize: 'small', maxCount: 3, description: 'Coffre au trésor décoratif.', icon: '📦', modelType: 'chest' },
  { id: 'amphora', name: 'Amphore', category: 'decorations', waterType: 'freshwater', minTankSize: 'small', maxCount: 3, description: 'Amphore antique en terre cuite.', icon: '🏺', modelType: 'amphora' },
  { id: 'root', name: 'Racine', category: 'decorations', waterType: 'freshwater', minTankSize: 'medium', maxCount: 2, description: 'Racine naturelle de mangrove.', icon: '🪵', modelType: 'root' },
  { id: 'statue', name: 'Statue', category: 'decorations', waterType: 'freshwater', minTankSize: 'medium', maxCount: 2, description: 'Statue décorative de style grec.', icon: '🗿', modelType: 'statue' },
  { id: 'tunnel', name: 'Tunnel', category: 'decorations', waterType: 'freshwater', minTankSize: 'medium', maxCount: 2, description: 'Tunnel décoratif pour poissons.', icon: '🕳️', modelType: 'tunnel' },

  // --- Plants ---
  { id: 'vallisneria', name: 'Vallisneria', category: 'plants', waterType: 'freshwater', minTankSize: 'small', maxCount: 10, description: 'Plante à longues feuilles en ruban.', icon: '🌿', modelType: 'plant-tall' },
  { id: 'anubias', name: 'Anubias', category: 'plants', waterType: 'freshwater', minTankSize: 'small', maxCount: 8, description: 'Plante robuste à larges feuilles.', icon: '🍃', modelType: 'plant-broad' },
  { id: 'java-fern', name: 'Fougère de Java', category: 'plants', waterType: 'freshwater', minTankSize: 'small', maxCount: 8, description: 'Fougère aquatique facile.', icon: '🌱', modelType: 'plant-fern' },
  { id: 'moss', name: 'Mousse', category: 'plants', waterType: 'freshwater', minTankSize: 'small', maxCount: 6, description: 'Tapis de mousse aquatique verte.', icon: '🟢', modelType: 'plant-moss' },
  { id: 'red-plant', name: 'Plante rouge', category: 'plants', waterType: 'freshwater', minTankSize: 'medium', maxCount: 6, description: 'Plante aquatique aux teintes rouges.', icon: '🍁', modelType: 'plant-red' },
  { id: 'grass', name: 'Herbe aquatique', category: 'plants', waterType: 'freshwater', minTankSize: 'small', maxCount: 12, description: 'Herbe courte formant un tapis.', icon: '🟩', modelType: 'plant-grass' },

  // --- Freshwater Fish ---
  { id: 'neon-tetra', name: 'Néon', category: 'fish', waterType: 'freshwater', minTankSize: 'small', maxCount: 15, description: 'Petit poisson bleu et rouge vif.', icon: '🐟', modelType: 'fish-neon' },
  { id: 'guppy', name: 'Guppy', category: 'fish', waterType: 'freshwater', minTankSize: 'small', maxCount: 10, description: 'Poisson coloré facile à élever.', icon: '🐟', modelType: 'fish-guppy' },
  { id: 'angelfish', name: 'Scalaire', category: 'fish', waterType: 'freshwater', minTankSize: 'medium', maxCount: 4, description: 'Poisson élégant aux longues nageoires.', icon: '🐠', modelType: 'fish-angelfish' },
  { id: 'betta', name: 'Combattant', category: 'fish', waterType: 'freshwater', minTankSize: 'small', maxCount: 1, description: 'Poisson majestueux aux nageoires fluides.', icon: '🐠', modelType: 'fish-betta' },
  { id: 'molly', name: 'Molly', category: 'fish', waterType: 'freshwater', minTankSize: 'small', maxCount: 8, description: 'Poisson vif et sociable.', icon: '🐟', modelType: 'fish-molly' },
  { id: 'corydoras', name: 'Corydoras', category: 'fish', waterType: 'freshwater', minTankSize: 'small', maxCount: 6, description: 'Petit poisson de fond très utile.', icon: '🐟', modelType: 'fish-cory' },
  { id: 'goldfish', name: 'Poisson rouge', category: 'fish', waterType: 'freshwater', minTankSize: 'medium', maxCount: 3, description: 'Le classique poisson rouge.', icon: '🐠', modelType: 'fish-gold' },

  // --- Equipment ---
  { id: 'air-pump', name: 'Pompe à air', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 1, description: 'Pompe à air avec diffuseur.', icon: '💨', modelType: 'air-pump' },
  { id: 'filter', name: 'Filtre', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 1, description: 'Filtre intérieur pour eau claire.', icon: '⚙️', modelType: 'filter' },
  { id: 'heater', name: 'Chauffage', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 1, description: 'Thermoplongeur réglable.', icon: '🌡️', modelType: 'heater' },
  { id: 'thermometer', name: 'Thermomètre', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 2, description: 'Thermomètre adhésif.', icon: '🌡️', modelType: 'thermometer' },
  { id: 'led-light', name: 'Éclairage LED', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 1, description: 'Rampe LED pour aquarium.', icon: '💡', modelType: 'led-light' },
];
