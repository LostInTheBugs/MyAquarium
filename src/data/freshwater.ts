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

  // --- Plants (fiches Fishipedia) ---
  {
    id: 'vallisneria', name: 'Vallisneria', category: 'plants', waterType: 'freshwater', minTankSize: 'small', maxCount: 10,
    description: 'Plante à longues feuilles en ruban pouvant atteindre 2 mètres, originaire des eaux douces tropicales et tempérées. Sa croissance rapide et sa multiplication par stolons en font une plante de fond idéale pour créer un rideau végétal. Elle supporte une large gamme de températures (18-28 °C) et de pH (5-9).',
    icon: '🌿', modelType: 'plant-tall', rarity: 'common',
    info: { scientificName: 'Vallisneria spiralis', size: '50-200 cm', behavior: 'Croissance rapide', diet: 'Multiplication : stolons', origin: 'Eaux douces tropicales et tempérées', status: 'LC' },
  },
  {
    id: 'anubias', name: 'Anubias', category: 'plants', waterType: 'freshwater', minTankSize: 'small', maxCount: 8,
    description: 'Plante épiphyte d\'Afrique de l\'Ouest (Cameroun, Gabon, Nigéria) aux grandes feuilles rondes et coriaces. Sa croissance lente et sa multiplication par rhizome en font une plante très robuste, idéale pour les débutants : elle se fixe sur les roches et racines plutôt que dans le sol. Une des plantes d\'aquarium les plus populaires.',
    icon: '🍃', modelType: 'plant-broad', rarity: 'common',
    info: { scientificName: 'Anubias barteri', size: '20-45 cm', behavior: 'Croissance lente', diet: 'Épiphyte (se fixe sur roches et racines)', origin: 'Afrique de l\'Ouest', status: 'LC' },
  },
  {
    id: 'java-fern', name: 'Fougère de Java', category: 'plants', waterType: 'freshwater', minTankSize: 'small', maxCount: 8,
    description: 'Fougère aquatique épiphyte aux feuilles allongées, très prisée en aquariophilie. Elle se fixe aux roches et racines par son rhizome et tolère une large gamme de conditions (22-28 °C, pH 5-8). Sa croissance moyenne et sa facilité d\'entretien en font un classique des aquariums communautaires.',
    icon: '🌱', modelType: 'plant-fern', rarity: 'common',
    info: { scientificName: 'Microsorum pteropus', size: '20-60 cm', behavior: 'Croissance moyenne', diet: 'Épiphyte (rhizome)', origin: 'Asie du Sud-Est', status: '—' },
  },
  {
    id: 'moss', name: 'Mousse', category: 'plants', waterType: 'freshwater', minTankSize: 'small', maxCount: 6,
    description: 'La mousse de Java forme d\'épais tapis verts sur les roches, racines et décors. Très résistante et facile à cultiver, elle offre un abri précieux aux alevins et aux crevettes. Elle pousse lentement et se fixe naturellement sur toutes les surfaces, sans besoin de sol nutritif.',
    icon: '🟢', modelType: 'plant-moss', rarity: 'common',
    info: { scientificName: 'Taxiphyllum barbieri (Vesicularia dubyana)', size: '2-10 cm (tapis)', behavior: 'Croissance lente', diet: 'Se fixe sur toutes surfaces', origin: 'Asie du Sud-Est', status: '—' },
  },
  {
    id: 'red-plant', name: 'Plante rouge', category: 'plants', waterType: 'freshwater', minTankSize: 'medium', maxCount: 6,
    description: 'Plante à tige d\'Amérique du Sud aux feuilles rouge vif, très décorative au milieu du bac. Sa croissance rapide et sa multiplication par boutures permettent de créer rapidement un massif coloré. Elle donne le meilleur d\'elle-même sous un éclairage soutenu.',
    icon: '🍁', modelType: 'plant-red', rarity: 'uncommon',
    info: { scientificName: 'Alternanthera reineckii', size: '20-30 cm', behavior: 'Croissance rapide', diet: 'Multiplication : boutures', origin: 'Amérique du Sud', status: 'NE' },
  },
  {
    id: 'grass', name: 'Herbe aquatique', category: 'plants', waterType: 'freshwater', minTankSize: 'small', maxCount: 12,
    description: 'Herbe fine formant un tapis végétal ras, l\'équivalent d\'une pelouse sous-marine. Sa multiplication rapide par stolons crée un premier plan dense et naturel, très apprécié des corydoras et crevettes qui y fouillent. Un apport de CO₂ accélère sa croissance.',
    icon: '🟩', modelType: 'plant-grass', rarity: 'common',
    info: { scientificName: 'Eleocharis acicularis', size: '5-15 cm', behavior: 'Croissance rapide (avec CO₂)', diet: 'Multiplication : stolons', origin: 'Cosmopolite', status: '—' },
  },

  // --- Freshwater Fish (fiches Fishipedia) ---
  {
    id: 'neon-tetra', name: 'Néon', category: 'fish', waterType: 'freshwater', minTankSize: 'small', maxCount: 15,
    description: 'Petit poisson tropical d\'Amérique du Sud célèbre pour sa bande bleue fluorescente. Il vit en groupe de plusieurs dizaines d\'individus dans des eaux claires et fraîches d\'altitude du bassin amazonien, chassant micro-crustacés et larves entre les racines et les plantes. Élevé depuis les années 1930, c\'est l\'un des poissons d\'aquarium les plus connus au monde.',
    icon: '🐟', modelType: 'fish-neon', rarity: 'common',
    info: { scientificName: 'Paracheirodon innesi', size: '3-4 cm', behavior: 'banc', diet: 'carnivore (micro-crustacés, larves)', longevity: '5 ans', origin: 'Bassin amazonien (Río Putumayo)', status: 'LC' },
  },
  {
    id: 'guppy', name: 'Guppy', category: 'fish', waterType: 'freshwater', minTankSize: 'small', maxCount: 10,
    description: 'L\'un des poissons les plus répandus en aquariophilie, particulièrement recommandé aux débutants. Robuste et ovovivipare, il se reproduit très facilement — les femelles, plus grandes que les mâles, donnent naissance à des alevins déjà formés. Omnivore, il vit près de la surface dans les eaux calmes et peu profondes.',
    icon: '🐟', modelType: 'fish-guppy', rarity: 'common',
    info: { scientificName: 'Poecilia reticulata', size: '3-6 cm (♀ > ♂)', behavior: 'petit groupe', diet: 'omnivore', longevity: '2-3 ans', origin: 'Amérique du Sud (Guyanes, Trinidad)', status: 'LC' },
  },
  {
    id: 'angelfish', name: 'Scalaire', category: 'fish', waterType: 'freshwater', minTankSize: 'medium', maxCount: 4,
    description: 'Cichlidé sud-américain à la silhouette triangulaire distinctive et aux longues nageoires rayées verticalement. Dans la nature, il réside en bancs de plusieurs dizaines d\'individus dans les zones de végétation dense et les bois morts. Avec le discus et le ramirezi, c\'est l\'un des cichlidés les plus connus de l\'aquariophilie.',
    icon: '🐠', modelType: 'fish-angelfish', rarity: 'uncommon',
    info: { scientificName: 'Pterophyllum scalare', size: '15-20 cm', behavior: 'banc', diet: 'omnivore', longevity: '9 ans', origin: 'Amérique du Sud (Amazone)', status: 'LC' },
  },
  {
    id: 'betta', name: 'Combattant', category: 'fish', waterType: 'freshwater', minTankSize: 'small', maxCount: 1,
    description: 'Poisson majestueux d\'Asie du Sud-Est aux nageoires fluides et aux couleurs spectaculaires. Il vit dans les eaux peu profondes des rizières et ruisseaux, et respire l\'air en surface grâce à son labyrinthe. Les mâles construisent un nid de bulles pour la reproduction. C\'est le poisson le plus populaire après le poisson rouge, mais ses populations sauvages sont menacées (VU).',
    icon: '🐠', modelType: 'fish-betta', rarity: 'uncommon',
    info: { scientificName: 'Betta splendens', size: '4-5 cm', behavior: 'solitaire (mâles territoriaux)', diet: 'carnivore', longevity: '5 ans', origin: 'Asie du Sud-Est (Thaïlande, Cambodge)', status: 'VU' },
  },
  {
    id: 'molly', name: 'Molly', category: 'fish', waterType: 'freshwater', minTankSize: 'small', maxCount: 8,
    description: 'Poisson vivipare robuste et sociable originaire d\'Amérique du Sud. Il fréquente les eaux calmes, marécages et ruisseaux, et s\'acclimate même aux eaux saumâtres des mangroves. Omnivore, il se nourrit surtout d\'algues, de détritus et de zooplancton. Les femelles sont plus grandes et plus ternes que les mâles.',
    icon: '🐟', modelType: 'fish-molly', rarity: 'common',
    info: { scientificName: 'Poecilia sphenops', size: '5-8 cm (♀ > ♂)', behavior: 'groupe', diet: 'omnivore (algues, détritus)', longevity: '3-5 ans', origin: 'Amérique du Sud', status: 'LC' },
  },
  {
    id: 'corydoras', name: 'Corydoras', category: 'fish', waterType: 'freshwater', minTankSize: 'small', maxCount: 6,
    description: 'Petit poisson-chat blindé de fond, au corps bicolore argent et marron parsemé de marbrures. Pacifique et diurne, il vit en banc et fouille le substrat à la recherche de nourriture — un précieux allié pour garder un sol propre. Sa longévité remarquable (jusqu\'à 10 ans) en fait un compagnon durable.',
    icon: '🐟', modelType: 'fish-cory', rarity: 'common',
    info: { scientificName: 'Hoplisoma paleatum (Corydoras paleatus)', size: '5-8 cm', behavior: 'banc', diet: 'omnivore', longevity: '10 ans', origin: 'Amérique du Sud (bassin du Río de la Plata)', status: 'LC' },
  },
  {
    id: 'goldfish', name: 'Poisson rouge', category: 'fish', waterType: 'freshwater', minTankSize: 'medium', maxCount: 3,
    description: 'Le poisson d\'ornement le plus célèbre au monde, élevé en Chine depuis environ 2 000 ans. Contrairement au dicton, il n\'a pas une mémoire de 3 secondes : des études montrent qu\'il retient des informations pendant plus d\'un mois. Sa forme sauvage, plus sobre, dépasse 30 cm et peut vivre plus de 30 ans en bassin.',
    icon: '🐠', modelType: 'fish-gold', rarity: 'uncommon',
    info: { scientificName: 'Carassius auratus', size: '20-36 cm', behavior: 'groupe', diet: 'omnivore', longevity: '35 ans', origin: 'Asie centrale et orientale', status: 'LC' },
  },

  // --- Equipment ---
  { id: 'air-pump', name: 'Pompe à air', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 1, description: 'Pompe à air avec diffuseur.', icon: '💨', modelType: 'air-pump' },
  { id: 'filter', name: 'Filtre', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 1, description: 'Filtre intérieur pour eau claire.', icon: '⚙️', modelType: 'filter' },
  { id: 'heater', name: 'Chauffage', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 1, description: 'Thermoplongeur réglable.', icon: '🌡️', modelType: 'heater' },
  { id: 'thermometer', name: 'Thermomètre', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 2, description: 'Thermomètre adhésif.', icon: '🌡️', modelType: 'thermometer' },
  { id: 'led-light', name: 'Éclairage LED', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 1, description: 'Rampe LED pour aquarium.', icon: '💡', modelType: 'led-light' },
];
