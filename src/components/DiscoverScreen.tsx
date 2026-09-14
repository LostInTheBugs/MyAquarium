import { useMemo, useState, useEffect } from 'react';
import type { AquariumElement, ElementCategory, TankSize, WaterType } from '../types';
import { getElementsByCategory, categoryLabels, categoryIcons } from '../data';
import { SUBSTRATE_TEXTURES, PLANT_SPRITES, CORAL_SPRITES, FISH_SPRITES, ANIM_SPRITES } from './textures';

/** Image de la tuile pour un élément, ou null (fallback emoji). */
function elementImage(el: AquariumElement): string | null {
  if (el.category === 'substrate') return SUBSTRATE_TEXTURES[el.id]?.albedo ?? null;
  if (el.category === 'fish') return FISH_SPRITES[el.modelType] ?? null;
  if (el.category === 'plants') return PLANT_SPRITES[el.modelType] ?? null;
  if (el.category === 'corals') return CORAL_SPRITES[el.modelType] ?? null;
  return null;
}

/** Animation CSS par catégorie (fallback quand pas d'animation IA). */
function animClassFor(el: AquariumElement): string {
  if (el.category === 'fish') return 'aq-anim-swim';
  if (el.category === 'plants') return 'aq-anim-sway';
  if (el.category === 'corals') return 'aq-anim-pulse';
  if (el.category === 'decorations') return 'aq-anim-float';
  return 'aq-anim-kenburns';
}

const SIZE_LABELS: Record<TankSize, string> = { small: 'Petit', medium: 'Moyen', large: 'Grand' };

const RARITY_BADGES: Record<string, string> = {
  common: 'bg-ocean-700/60 text-ocean-300 border-ocean-600/40',
  uncommon: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/40',
  rare: 'bg-amber-900/40 text-amber-300 border-amber-700/40',
};

function ElementTile({ el, onSelect }: { el: AquariumElement; onSelect: (el: AquariumElement) => void }) {
  const img = elementImage(el);
  return (
    <button
      onClick={() => onSelect(el)}
      className="group w-40 shrink-0 bg-ocean-800/50 rounded-xl border border-ocean-700/40 overflow-hidden hover:border-ocean-500/50 hover:bg-ocean-800/80 hover:shadow-lg hover:shadow-ocean-500/10 transition-all duration-200 cursor-pointer text-left"
    >
      <div className="h-36 bg-gradient-to-b from-ocean-900/70 to-ocean-800/30 flex items-center justify-center p-3">
        {img ? (
          <img
            src={img}
            alt={el.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <span className="text-5xl group-hover:scale-110 transition-transform duration-200">{el.icon}</span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-1">
          <span className="text-sm font-medium text-ocean-100 truncate">{el.name}</span>
          {el.rarity && (
            <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wide border ${RARITY_BADGES[el.rarity]}`}>
              {el.rarity === 'common' ? 'Commun' : el.rarity === 'uncommon' ? 'Peu courant' : 'Rare'}
            </span>
          )}
        </div>
        <p className="text-[11px] text-ocean-400 mt-1 leading-snug line-clamp-2">{el.description}</p>
      </div>
    </button>
  );
}

/** Fiche agrandie (modale) : grande image animée + détails. */
function ElementModal({ el, onClose }: { el: AquariumElement; onClose: () => void }) {
  const img = elementImage(el);
  const animUrl = ANIM_SPRITES[el.modelType];
  const animClass = animClassFor(el);

  // Fermeture par Échap + verrouillage du scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Bulles d'ambiance (positions/durées aléatoires stables)
  const bubbles = useMemo(() =>
    Array.from({ length: 10 }, () => ({
      left: 8 + Math.random() * 84,
      size: 4 + Math.random() * 10,
      dur: 3.5 + Math.random() * 4,
      delay: Math.random() * 5,
    })),
  []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-ocean-900/95 border border-ocean-600/40 rounded-2xl shadow-2xl shadow-ocean-950/80 max-w-lg w-full overflow-hidden max-h-[92vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur border border-white/15 text-white/80 hover:text-white hover:bg-black/60 transition-all cursor-pointer flex items-center justify-center"
          title="Fermer (Échap)"
        >
          ✕
        </button>

        {/* Grande image animée */}
        <div className="h-80 relative overflow-hidden bg-gradient-to-b from-ocean-800 via-ocean-900 to-[#010a10] flex items-center justify-center">
          {bubbles.map((b, i) => (
            <span
              key={i}
              className="aq-bubble"
              style={{ left: `${b.left}%`, width: b.size, height: b.size, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}
            />
          ))}
          {img && (
            <img
              src={animUrl ?? img}
              alt={el.name}
              className={`max-h-[85%] max-w-[90%] object-contain drop-shadow-2xl ${animUrl ? '' : animClass}`}
            />
          )}
        </div>

        {/* Détails */}
        <div className="p-5 overflow-y-auto">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl font-semibold text-ocean-50 flex items-center gap-2">
              <span>{el.icon}</span> {el.name}
            </h3>
            {el.rarity && (
              <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] uppercase tracking-wide border ${RARITY_BADGES[el.rarity]}`}>
                {el.rarity === 'common' ? 'Commun' : el.rarity === 'uncommon' ? 'Peu courant' : 'Rare'}
              </span>
            )}
          </div>
          <p className="text-ocean-300 text-sm mt-2 leading-relaxed">{el.description}</p>

          {/* Fiche d'information (Fishipedia) */}
          {el.info && (
            <div className="mt-4 p-3 rounded-xl bg-ocean-800/50 border border-ocean-700/40">
              <p className="text-ocean-200 text-xs italic mb-2">✓ {el.info.scientificName}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded-lg bg-ocean-800/70 border border-ocean-700/40 text-ocean-300">
                  📏 {el.info.size}
                </span>
                <span className="px-2 py-1 rounded-lg bg-ocean-800/70 border border-ocean-700/40 text-ocean-300">
                  👥 {el.info.behavior}
                </span>
                <span className="px-2 py-1 rounded-lg bg-ocean-800/70 border border-ocean-700/40 text-ocean-300">
                  🍽️ {el.info.diet}
                </span>
                {el.info.longevity && (
                  <span className="px-2 py-1 rounded-lg bg-ocean-800/70 border border-ocean-700/40 text-ocean-300">
                    ⏳ {el.info.longevity}
                  </span>
                )}
                {el.info.origin && (
                  <span className="px-2 py-1 rounded-lg bg-ocean-800/70 border border-ocean-700/40 text-ocean-300">
                    🌍 {el.info.origin}
                  </span>
                )}
                {el.info.status && (
                  <span className={`px-2 py-1 rounded-lg border ${el.info.status === 'VU'
                    ? 'bg-amber-900/30 border-amber-700/50 text-amber-300'
                    : 'bg-emerald-900/30 border-emerald-700/50 text-emerald-300'}`}
                    title="Statut UICN (Liste rouge)"
                  >
                    IUCN {el.info.status}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-ocean-800/70 border border-ocean-700/40 text-ocean-300">
              {categoryIcons[el.category]} {categoryLabels[el.category]}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-ocean-800/70 border border-ocean-700/40 text-ocean-300">
              📏 Taille mini : {SIZE_LABELS[el.minTankSize]}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-ocean-800/70 border border-ocean-700/40 text-ocean-300">
              🔢 Max : {el.maxCount} par aquarium
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DiscoverScreen({ waterType, onBack }: { waterType: WaterType; onBack: () => void }) {
  // Une seule catégorie sélectionnée à la fois (la première par défaut)
  const [selectedCat, setSelectedCat] = useState<ElementCategory>('substrate');
  // Élément ouvert dans la fiche agrandie
  const [selectedElement, setSelectedElement] = useState<AquariumElement | null>(null);

  const sections = useMemo(
    () => {
      const cats: ElementCategory[] = waterType === 'freshwater'
        ? ['substrate', 'decorations', 'plants', 'fish', 'equipment']
        : ['substrate', 'decorations', 'corals', 'fish', 'equipment'];
      return cats.map(cat => ({ cat, elements: getElementsByCategory(waterType, cat) }));
    },
    [waterType],
  );

  const visibleSections = sections.filter(s => s.cat === selectedCat);

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-900 via-ocean-800 to-ocean-700 pb-16">
      <div className="max-w-6xl px-6 pt-8" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-ocean-300 hover:text-ocean-100 transition-colors cursor-pointer"
          >
            ← Retour à l'accueil
          </button>
        </div>
        <h1 className="text-4xl font-bold text-ocean-50">
          {waterType === 'freshwater' ? '🐠 Découverte eau douce' : '🪸 Découverte eau de mer'}
        </h1>
        <p className="text-ocean-300 mt-2 mb-6">
          Tous les poissons, plantes, coraux et décorations disponibles — cliquez pour agrandir votre imagination.
        </p>

        {/* Sélecteur de type — une seule catégorie à la fois */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {sections.map(({ cat, elements }) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer
                ${selectedCat === cat
                  ? 'bg-ocean-500 text-white border-ocean-400 shadow'
                  : 'bg-ocean-800/60 text-ocean-300 border-ocean-700/40 hover:bg-ocean-700/60'}`}
            >
              {categoryIcons[cat]} {categoryLabels[cat]}
              <span className={`ml-1.5 text-xs ${selectedCat === cat ? 'text-ocean-100' : 'text-ocean-500'}`}>
                {elements.length}
              </span>
            </button>
          ))}
        </div>

        {/* Sections par catégorie */}
        <div className="space-y-10">
          {visibleSections.map(({ cat, elements }) => (
            <section key={cat}>
              <h2 className="text-lg font-semibold text-ocean-200 mb-4 flex items-center justify-center gap-2">
                <span>{categoryIcons[cat]}</span>
                <span>{categoryLabels[cat]}</span>
                <span className="text-xs font-normal text-ocean-500 bg-ocean-800/60 border border-ocean-700/40 rounded-full px-2 py-0.5">
                  {elements.length}
                </span>
              </h2>
              <div className="flex flex-wrap justify-center gap-5">
                {elements.map(el => <ElementTile key={el.id} el={el} onSelect={setSelectedElement} />)}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Fiche agrandie */}
      {selectedElement && <ElementModal el={selectedElement} onClose={() => setSelectedElement(null)} />}
    </div>
  );
}
