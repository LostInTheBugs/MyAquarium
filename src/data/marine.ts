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

  // --- Corals & Marine Life (fiches Fishipedia) ---
  {
    id: 'brain-coral', name: 'Corail cerveau', category: 'corals', waterType: 'marine', minTankSize: 'medium', maxCount: 3,
    description: 'Corail dur massif dont la surface évoque un cerveau, formé de sillons et vallées sinueuses. Il abrite des algues symbiotiques (zooxanthelles) qui lui fournissent l\'essentiel de son énergie par photosynthèse. Sa croissance est très lente — certaines colonies ont plusieurs siècles.',
    icon: '🧠', modelType: 'coral-brain', rarity: 'uncommon',
    info: { scientificName: 'Platygyra sp.', size: 'colonies 30-200 cm', behavior: 'Croissance très lente', diet: 'Zooxanthelles + plancton', origin: 'Récifs Indo-Pacifique', status: 'LC' },
  },
  {
    id: 'branch-coral', name: 'Corail branchu', category: 'corals', waterType: 'marine', minTankSize: 'medium', maxCount: 5,
    description: 'Corail dur scléractiniaire de la famille des Acroporidae, emblématique des récifs de l\'Indo-Pacifique tropical. Ses branches ramifiées, dites « corne de cerf », offrent un habitat essentiel à des centaines d\'espèces de poissons. C\'est l\'un des coraux à la croissance la plus rapide, mais aussi l\'un des plus sensibles au blanchissement.',
    icon: '🪸', modelType: 'coral-branch', rarity: 'uncommon',
    info: { scientificName: 'Acropora sp.', size: 'colonies 20-200 cm', behavior: 'Croissance rapide', diet: 'Zooxanthelles + plancton', origin: 'Récifs Indo-Pacifique', status: 'NE' },
  },
  {
    id: 'colorful-coral', name: 'Corail coloré', category: 'corals', waterType: 'marine', minTankSize: 'medium', maxCount: 4,
    description: 'Corail mou aux couleurs éclatantes, très prisé en aquarium récifal. Contrairement aux coraux durs, il ne sécrète pas de squelette calcaire et ondule souplement avec le courant. Ses polypes, souvent étendus le jour, captent le plancton et tirent leur énergie des algues symbiotiques.',
    icon: '🪸', modelType: 'coral-colorful', rarity: 'uncommon',
    info: { scientificName: 'Coraux mous (Sarcophyton, Zoanthides)', size: 'colonies 10-60 cm', behavior: 'Ondule avec le courant', diet: 'Zooxanthelles + plancton', origin: 'Récifs tropicaux', status: 'NE' },
  },
  {
    id: 'anemone', name: 'Anémone', category: 'corals', waterType: 'marine', minTankSize: 'medium', maxCount: 3,
    description: 'L\'anémone magnifique, grande solitaire carnivore de l\'Indo-Pacifique pouvant atteindre 50 cm. Ses tentacules urticants capturent poissons et plancton, mais épargnent les poissons-clowns qui vivent en symbiose avec elle — protégés par leur mucus. Un pied marin essentiel des récifs.',
    icon: '🪸', modelType: 'anemone', rarity: 'rare',
    info: { scientificName: 'Radianthus magnifica (Heteractis magnifica)', size: 'jusqu\'à 50 cm', behavior: 'Solitaire', diet: 'Carnivore (poissons, plancton)', origin: 'Indo-Pacifique', status: 'NE' },
  },
  {
    id: 'starfish', name: 'Étoile de mer', category: 'corals', waterType: 'marine', minTankSize: 'small', maxCount: 5,
    description: 'Étoile de mer bleue ou rouge des récifs, célèbre pour ses capacités de régénération : un bras sectionné peut reformer un individu complet. Elle se déplace lentement sur des milliers de podia et se nourrit de biofilm, d\'éponges et de détritus. Précieuse pour nettoyer les roches vivantes.',
    icon: '⭐', modelType: 'starfish', rarity: 'uncommon',
    info: { scientificName: 'Linckia laevigata / Fromia sp.', size: '10-30 cm', behavior: 'Solitaire, lente', diet: 'Détritivore (biofilm, éponges)', origin: 'Indo-Pacifique', status: 'NE' },
  },
  {
    id: 'urchin', name: 'Oursin', category: 'corals', waterType: 'marine', minTankSize: 'small', maxCount: 4,
    description: 'Oursin diadème reconnaissable à ses longs piquants noirs et à son anneau bleu électrique. Herbivore nocturne, il broute les algues et joue un rôle clé dans l\'équilibre des récifs en empêchant les algues d\'étouffer les coraux. Ses piquants sont fragiles et se régénèrent.',
    icon: '🦔', modelType: 'urchin', rarity: 'common',
    info: { scientificName: 'Diadema setosum', size: 'piquants jusqu\'à 30 cm', behavior: 'Nocturne, solitaire', diet: 'Herbivore (algues)', origin: 'Indo-Pacifique', status: 'NE' },
  },
  {
    id: 'crab', name: 'Crabe', category: 'corals', waterType: 'marine', minTankSize: 'small', maxCount: 3,
    description: 'Petit crabe des récifs qui vit caché entre les roches et les coraux, n\'en sortant qu\'à la tombée de la nuit. Charognard et détritivore, il participe au nettoyage du bac en consommant les restes de nourriture. Certaines espèces vivent en symbiose avec les coraux, qu\'elles défendent.',
    icon: '🦀', modelType: 'crab', rarity: 'common',
    info: { scientificName: 'Décapodes récifaux (Xanthidae, Trapezia)', size: '2-5 cm', behavior: 'Nocturne, caché', diet: 'Détritivore', origin: 'Récifs tropicaux', status: '—' },
  },
  {
    id: 'shrimp', name: 'Crevette', category: 'corals', waterType: 'marine', minTankSize: 'small', maxCount: 6,
    description: 'Crevette nettoyeuse rayée de rouge et de blanc, célèbre pour son poste de nettoyage : elle débarrasse les poissons de leurs parasites et peaux mortes, qui se présentent volontairement à elle. Ce comportement mutualiste est l\'un des plus spectaculaires des récifs. Vit en couple ou petit groupe.',
    icon: '🦐', modelType: 'shrimp', rarity: 'uncommon',
    info: { scientificName: 'Lysmata amboinensis', size: '5-6 cm', behavior: 'Couple / petit groupe', diet: 'Parasites et détritus des poissons', origin: 'Indo-Pacifique', status: 'NE' },
  },

  // --- Marine Fish (fiches Fishipedia) ---
  {
    id: 'clownfish', name: 'Poisson-clown', category: 'fish', waterType: 'marine', minTankSize: 'small', maxCount: 4,
    description: 'Rendu mondialement célèbre par « Le Monde de Nemo », ce poisson orange à bandes blanches vit en symbiose avec les anémones de mer, dont les tentacules urticantes le protègent des prédateurs. Présent dans l\'est de l\'océan Indien, il est aujourd\'hui majoritairement reproduit en élevage, ce qui limite la pression sur les populations sauvages.',
    icon: '🐠', modelType: 'fish-clown', rarity: 'common',
    info: { scientificName: 'Amphiprion ocellaris', size: '8-11 cm', behavior: 'couple / petit groupe', diet: 'omnivore', longevity: '10 ans', origin: 'Est de l\'océan Indien, Pacifique ouest', status: 'LC' },
  },
  {
    id: 'blue-tang', name: 'Chirurgien bleu', category: 'fish', waterType: 'marine', minTankSize: 'medium', maxCount: 3,
    description: 'Connu du grand public sous le nom de Dory, ce nageur rapide de l\'Indo-Pacifique porte des scalpels tranchants de chaque côté de la queue — d\'où son nom de « chirurgien ». Il broute les algues sur les récifs coralliens et peut mesurer jusqu\'à 30 cm. Sa reproduction difficile en captivité a longtemps conduit à la capture de nombreux individus sauvages.',
    icon: '🐠', modelType: 'fish-tang', rarity: 'rare',
    info: { scientificName: 'Paracanthurus hepatus', size: '25-30 cm', behavior: 'groupe / solitaire', diet: 'herbivore (algues)', longevity: '10 ans', origin: 'Indo-Pacifique (Grande Barrière de corail)', status: 'LC' },
  },
  {
    id: 'butterflyfish', name: 'Poisson-papillon', category: 'fish', waterType: 'marine', minTankSize: 'medium', maxCount: 3,
    description: 'Reconnaissable à son corps comprimé latéralement, de forme ovale, aux couleurs vives et rayures diagonales. Les 87 espèces du genre Chaetodon sont inféodées aux récifs coralliens tropicaux, où elles se nourrissent principalement de polypes de coraux, d\'algues et de petits invertébrés. Elles vivent souvent en solitaire ou en couple, et sont monogames.',
    icon: '🐠', modelType: 'fish-butterfly', rarity: 'uncommon',
    info: { scientificName: 'Chaetodon mertensii', size: '10-12,5 cm', behavior: 'solitaire / couple', diet: 'corallivore (polypes, algues)', longevity: '8 ans', origin: 'Récifs coralliens tropicaux', status: 'LC' },
  },
  {
    id: 'goby', name: 'Gobie', category: 'fish', waterType: 'marine', minTankSize: 'small', maxCount: 5,
    description: 'Petit poisson corail-commensal jaune vif qui vit entre les branches des coraux Acropora, où il se repose et se cache. Les Gobiodon sont hermaphrodites bidirectionnels : ils peuvent changer de sexe plusieurs fois au cours de leur vie selon les besoins du groupe. La plus grande espèce du genre ne dépasse pas 7 cm.',
    icon: '🐟', modelType: 'fish-goby', rarity: 'common',
    info: { scientificName: 'Gobiodon okinawae', size: '3-6 cm', behavior: 'couple dans les coraux Acropora', diet: 'planctophage', longevity: '5 ans', origin: 'Pacifique occidental', status: 'LC' },
  },
  {
    id: 'damselfish', name: 'Poisson-demoiselle', category: 'fish', waterType: 'marine', minTankSize: 'small', maxCount: 8,
    description: 'Petite demoiselle vert-bleu électrique très grégaire : elle évolue en larges bancs au-dessus des roches et des barrières de corail de l\'Indo-Pacifique, plongeant simultanément pour se cacher au moindre danger. Les adultes protègent activement leur ponte jusqu\'à l\'éclosion. Très résistante, c\'est une excellente première espèce marine.',
    icon: '🐟', modelType: 'fish-damsel', rarity: 'common',
    info: { scientificName: 'Chromis viridis', size: '6-9 cm', behavior: 'banc', diet: 'planctophage', longevity: '6 ans', origin: 'Indo-Pacifique', status: 'LC' },
  },

  // --- Equipment ---
  { id: 'air-pump-marine', name: 'Pompe à air', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 1, description: 'Pompe à air avec diffuseur.', icon: '💨', modelType: 'air-pump' },
  { id: 'filter-marine', name: 'Filtre', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 1, description: 'Filtre pour aquarium marin.', icon: '⚙️', modelType: 'filter' },
  { id: 'heater-marine', name: 'Chauffage', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 1, description: 'Thermoplongeur pour eau de mer.', icon: '🌡️', modelType: 'heater' },
  { id: 'thermometer-marine', name: 'Thermomètre', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 2, description: 'Thermomètre adhésif.', icon: '🌡️', modelType: 'thermometer' },
  { id: 'led-light-marine', name: 'Éclairage LED', category: 'equipment', waterType: 'both', minTankSize: 'small', maxCount: 1, description: 'Rampe LED haute puissance.', icon: '💡', modelType: 'led-light' },
  { id: 'skimmer', name: 'Écumeur', category: 'equipment', waterType: 'marine', minTankSize: 'medium', maxCount: 1, description: 'Écumeur de protéines.', icon: '🫧', modelType: 'skimmer' },
];
