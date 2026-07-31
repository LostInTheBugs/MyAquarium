import type { AquariumElement } from '../types';

export const marineElements: AquariumElement[] = [
  // --- Substrate ---
  { id: 'marine-sand', name: 'Sable marin', category: 'substrate', waterType: 'marine', minTankSize: 'small', maxCount: 1, description: 'Sable corallien blanc naturel.', icon: '🏖️', modelType: 'substrate' },
  { id: 'aragonite', name: 'Aragonite', category: 'substrate', waterType: 'marine', minTankSize: 'small', maxCount: 1, description: "Sable d'aragonite pour récifal.", icon: '🟫', modelType: 'substrate' },
  { id: 'crushed-coral', name: 'Corail broyé', category: 'substrate', waterType: 'marine', minTankSize: 'small', maxCount: 1, description: 'Substrat de corail broyé.', icon: '🪸', modelType: 'substrate' },

  // --- Decorations ---
  { id: 'shipwreck-marine', name: 'Épave marine', category: 'decorations', waterType: 'marine', minTankSize: 'medium', maxCount: 1, description: 'Épave couverte de vie marine.', icon: '🚢', modelType: 'shipwreck' },
  { id: 'chest-marine', name: 'Coffre', category: 'decorations', waterType: 'marine', minTankSize: 'small', maxCount: 3, description: 'Coffre au trésor sous-marin.', icon: '📦', modelType: 'chest' },
  { id: 'amphora-marine', name: 'Amphore', category: 'decorations', waterType: 'marine', minTankSize: 'small', maxCount: 3, description: 'Amphore ancienne.', icon: '🏺', modelType: 'amphora' },
  { id: 'statue-marine', name: 'Statue', category: 'decorations', waterType: 'marine', minTankSize: 'medium', maxCount: 2, description: 'Statue de style antique.', icon: '🗿', modelType: 'statue' },
  { id: 'tunnel-marine', name: 'Tunnel', category: 'decorations', waterType: 'marine', minTankSize: 'medium', maxCount: 2, description: 'Tunnel rocheux pour poissons.', icon: '🕳️', modelType: 'tunnel' },

  // --- Corals & Marine Life ---
  { id: 'brain-coral', name: 'Corail cerveau', category: 'corals', waterType: 'marine', minTankSize: 'medium', maxCount: 3, description: 'Corail massif cérébriforme.', icon: '🧠', modelType: 'coral-brain' },
  { id: 'branch-coral', name: 'Corail branchu', category: 'corals', waterType: 'marine', minTankSize: 'medium', maxCount: 5, description: 'Corail aux branches ramifiées.', icon: '🪸', modelType: 'coral-branch' },
  { id: 'colorful-coral', name: 'Corail coloré', category: 'corals', waterType: 'marine', minTankSize: 'medium', maxCount: 4, description: 'Corail aux couleurs éclatantes.', icon: '🪸', modelType: 'coral-colorful' },
  { id: 'anemone', name: 'Anémone', category: 'corals', waterType: 'marine', minTankSize: 'medium', maxCount: 3, description: 'Anémone aux tentacules ondulants.', icon: '🪸', modelType: 'anemone' },
  { id: 'starfish', name: 'Étoile de mer', category: 'corals', waterType: 'marine', minTankSize: 'small', maxCount: 5, description: 'Étoile de mer colorée.', icon: '⭐', modelType: 'starfish' },
  { id: 'urchin', name: 'Oursin', category: 'corals', waterType: 'marine', minTankSize: 'small', maxCount: 4, description: 'Oursin aux longs piquants.', icon: '🦔', modelType: 'urchin' },
  { id: 'crab', name: 'Crabe', category: 'corals', waterType: 'marine', minTankSize: 'small', maxCount: 3, description: 'Petit crabe des récifs.', icon: '🦀', modelType: 'crab' },
  { id: 'shrimp', name: 'Crevette', category: 'corals', waterType: 'marine', minTankSize: 'small', maxCount: 6, description: 'Crevette nettoyeuse colorée.', icon: '🦐', modelType: 'shrimp' },

  // --- Marine Fish ---
  { id: 'clownfish', name: 'Poisson-clown', category: 'fish', waterType: 'marine', minTankSize: 'small', maxCount: 4, description: 'Poisson orange et blanc célèbre.', icon: '🐠', modelType: 'fish-clown' },
  { id: 'blue-tang', name: 'Chirurgien bleu', category: 'fish', waterType: 'marine', minTankSize: 'medium', maxCount: 3, description: 'Poisson bleu vif, nageur actif.', icon: '🐠', modelType: 'fish-tang' },
  { id: 'butterflyfish', name: 'Poisson-papillon', category: 'fish', waterType: 'marine', minTankSize: 'medium', maxCount: 3, description: 'Poisson aux motifs colorés.', icon: '🐠', modelType: 'fish-butterfly' },
  { id: 'goby', name: 'Gobie', category: 'fish', waterType: 'marine', minTankSize: 'small', maxCount: 5, description: 'Petit poisson de fond coloré.', icon: '🐟', modelType: 'fish-goby' },
  { id: 'damselfish', name: 'Poisson-demoiselle', category: 'fish', waterType: 'marine', minTankSize: 'small', maxCount: 8, description: 'Petit poisson bleu électrique.', icon: '🐟', modelType: 'fish-damsel' },

  // --- Equipment ---
  { id: 'air-pump-marine', name: 'Pompe à air', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 1, description: 'Pompe à air avec diffuseur.', icon: '💨', modelType: 'air-pump' },
  { id: 'filter-marine', name: 'Filtre', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 1, description: 'Filtre pour aquarium marin.', icon: '⚙️', modelType: 'filter' },
  { id: 'heater-marine', name: 'Chauffage', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 1, description: 'Thermoplongeur pour eau de mer.', icon: '🌡️', modelType: 'heater' },
  { id: 'thermometer-marine', name: 'Thermomètre', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 2, description: 'Thermomètre adhésif.', icon: '🌡️', modelType: 'thermometer' },
  { id: 'led-light-marine', name: 'Éclairage LED', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 1, description: 'Rampe LED haute puissance.', icon: '💡', modelType: 'led-light' },
  { id: 'skimmer', name: 'Écumeur', category: 'equipment', waterType: 'marine', minTankSize: 'medium', maxCount: 1, description: 'Écumeur de protéines.', icon: '🫧', modelType: 'skimmer' },
];
