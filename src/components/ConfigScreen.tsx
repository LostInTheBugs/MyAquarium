import { useState } from 'react';
import type { WaterType, TankSize } from '../types';
import { useAquariumStore } from '../store';

export function ConfigScreen({ onDiscover }: { onDiscover?: (waterType: WaterType) => void }) {
  const { dispatch } = useAquariumStore();
  const [waterType, setWaterType] = useState<WaterType>('freshwater');
  const [size, setSize] = useState<TankSize>('medium');
  const [step, setStep] = useState<'water' | 'size'>('water');

  const handleStart = () => {
    dispatch({ type: 'SET_CONFIG', config: { waterType, size } });
  };

  // Try to load saved config
  const handleLoad = () => {
    try {
      const saved = localStorage.getItem('aquarium-save');
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', state: parsed });
      } else {
        alert('Aucune sauvegarde trouvée.');
      }
    } catch {
      alert('Erreur lors du chargement de la sauvegarde.');
    }
  };

  if (step === 'water') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-ocean-900 via-ocean-800 to-ocean-700">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-ocean-50 mb-3">Créez votre aquarium</h1>
            <p className="text-ocean-200 text-lg">Choisissez le type d'aquarium que vous souhaitez créer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Freshwater card */}
            <button
              onClick={() => { setWaterType('freshwater'); setStep('size'); }}
              className={`relative group p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer
                ${waterType === 'freshwater'
                  ? 'border-ocean-300 bg-ocean-700/60 shadow-lg shadow-ocean-500/20'
                  : 'border-ocean-700/50 bg-ocean-800/40 hover:border-ocean-500/50 hover:bg-ocean-700/40'}`}
            >
              <div className="text-6xl mb-4">🐠</div>
              <h3 className="text-2xl font-semibold text-ocean-50 mb-2">Eau douce</h3>
              <p className="text-ocean-300 text-sm">
                Poissons tropicaux, plantes aquatiques, racines et décorations naturelles
              </p>
              <ul className="mt-4 text-left text-ocean-300 text-xs space-y-1">
                <li>🌿 Plantes aquatiques</li>
                <li>🐟 Poissons tropicaux</li>
                <li>🪨 Roches et galets</li>
                <li>🪵 Racines naturelles</li>
              </ul>
              <span className="mt-4 inline-block px-4 py-1.5 rounded-lg bg-ocean-500/20 border border-ocean-400/40 text-ocean-200 text-xs font-medium">
                ✨ Vitrine pré-remplie : charger directement
              </span>
            </button>

            {/* Marine card */}
            <button
              onClick={() => { setWaterType('marine'); setStep('size'); }}
              className={`relative group p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer
                ${waterType === 'marine'
                  ? 'border-ocean-300 bg-ocean-700/60 shadow-lg shadow-ocean-500/20'
                  : 'border-ocean-700/50 bg-ocean-800/40 hover:border-ocean-500/50 hover:bg-ocean-700/40'}`}
            >
              <div className="text-6xl mb-4">🪸</div>
              <h3 className="text-2xl font-semibold text-ocean-50 mb-2">Eau de mer</h3>
              <p className="text-ocean-300 text-sm">
                Poissons marins, coraux colorés, anémones et vie récifale
              </p>
              <ul className="mt-4 text-left text-ocean-300 text-xs space-y-1">
                <li>🪸 Coraux et anémones</li>
                <li>🐠 Poissons marins</li>
                <li>⭐ Étoiles de mer</li>
                <li>🦀 Crustacés</li>
              </ul>
              <span className="mt-4 inline-block px-4 py-1.5 rounded-lg bg-ocean-500/20 border border-ocean-400/40 text-ocean-200 text-xs font-medium">
                ✨ Vitrine pré-remplie : charger directement
              </span>
            </button>
          </div>

          {/* Showcase presets */}
          <div className="pt-2">
            <p className="text-ocean-400 text-sm mb-3">— ou démarrez avec un aquarium vitrine déjà décoré —</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => dispatch({ type: 'LOAD_PRESET', waterType: 'freshwater' })}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                🐠 Vitrine eau douce
              </button>
              <button
                onClick={() => dispatch({ type: 'LOAD_PRESET', waterType: 'marine' })}
                className="px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                🪸 Vitrine eau de mer
              </button>
            </div>
          </div>

          {/* Discovery — éducation */}
          <div className="pt-10 border-t border-ocean-700/40">
            <h2 className="text-5xl font-bold text-ocean-50 mb-3">Découvrir l'écosystème des aquariums</h2>
            <p className="text-ocean-200 text-lg mb-8">
              Explorez les espèces, plantes et éléments qui composent un aquarium — fiches d'information et découverte
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Discovery freshwater card */}
              <button
                onClick={() => onDiscover?.('freshwater')}
                className="relative group p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer
                  border-ocean-700/50 bg-ocean-800/40 hover:border-ocean-500/50 hover:bg-ocean-700/40"
              >
                <div className="text-6xl mb-4">🌿</div>
                <h3 className="text-2xl font-semibold text-ocean-50 mb-2">Eau douce</h3>
                <p className="text-ocean-300 text-sm">
                  Poissons tropicaux, plantes aquatiques, racines et décors naturels — apprenez à les connaître
                </p>
                <ul className="mt-4 text-left text-ocean-300 text-xs space-y-1">
                  <li>🐟 7 espèces de poissons tropicaux</li>
                  <li>🌿 6 plantes aquatiques</li>
                  <li>🏖️ 5 substrats naturels</li>
                  <li>🏰 7 décorations</li>
                </ul>
                <span className="mt-4 inline-block px-4 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-medium">
                  📚 Fiches d'information
                </span>
              </button>

              {/* Discovery marine card */}
              <button
                onClick={() => onDiscover?.('marine')}
                className="relative group p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer
                  border-ocean-700/50 bg-ocean-800/40 hover:border-ocean-500/50 hover:bg-ocean-700/40"
              >
                <div className="text-6xl mb-4">🪸</div>
                <h3 className="text-2xl font-semibold text-ocean-50 mb-2">Eau de mer</h3>
                <p className="text-ocean-300 text-sm">
                  Poissons marins, coraux colorés, anémones et vie récifale — plongez dans l'écosystème marin
                </p>
                <ul className="mt-4 text-left text-ocean-300 text-xs space-y-1">
                  <li>🐠 5 poissons marins</li>
                  <li>🪸 8 coraux et invertébrés</li>
                  <li>🏖️ 3 substrats récifaux</li>
                  <li>🏰 5 décorations</li>
                </ul>
                <span className="mt-4 inline-block px-4 py-1.5 rounded-lg bg-sky-500/20 border border-sky-400/40 text-sky-200 text-xs font-medium">
                  📚 Fiches d'information
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: size selection
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-ocean-900 via-ocean-800 to-ocean-700">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div>
          <button
            onClick={() => setStep('water')}
            className="text-ocean-300 hover:text-ocean-100 mb-4 inline-flex items-center gap-2"
          >
            ← Retour
          </button>
          <h2 className="text-4xl font-bold text-ocean-50">
            {waterType === 'freshwater' ? '🐠 Aquarium d\'eau douce' : '🪸 Aquarium d\'eau de mer'}
          </h2>
          <p className="text-ocean-200 mt-2">Choisissez la taille de votre aquarium</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Small */}
          <button
            onClick={() => setSize('small')}
            className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
              ${size === 'small'
                ? 'border-ocean-300 bg-ocean-700/60 shadow-lg shadow-ocean-500/20'
                : 'border-ocean-700/50 bg-ocean-800/40 hover:border-ocean-500/50'}`}
          >
            <div className="text-5xl mb-3">🟦</div>
            <h3 className="text-xl font-semibold text-ocean-50">Petit</h3>
            <p className="text-ocean-300 text-sm mt-2">40 × 25 × 20 cm</p>
            <p className="text-ocean-400 text-xs mt-2">~5 poissons max</p>
            <p className="text-ocean-500 text-xs">20 L</p>
          </button>

          {/* Medium */}
          <button
            onClick={() => setSize('medium')}
            className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
              ${size === 'medium'
                ? 'border-ocean-300 bg-ocean-700/60 shadow-lg shadow-ocean-500/20'
                : 'border-ocean-700/50 bg-ocean-800/40 hover:border-ocean-500/50'}`}
          >
            <div className="text-5xl mb-3">🟩</div>
            <h3 className="text-xl font-semibold text-ocean-50">Moyen</h3>
            <p className="text-ocean-300 text-sm mt-2">60 × 35 × 30 cm</p>
            <p className="text-ocean-400 text-xs mt-2">~12 poissons max</p>
            <p className="text-ocean-500 text-xs">63 L</p>
          </button>

          {/* Large */}
          <button
            onClick={() => setSize('large')}
            className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
              ${size === 'large'
                ? 'border-ocean-300 bg-ocean-700/60 shadow-lg shadow-ocean-500/20'
                : 'border-ocean-700/50 bg-ocean-800/40 hover:border-ocean-500/50'}`}
          >
            <div className="text-5xl mb-3">🟪</div>
            <h3 className="text-xl font-semibold text-ocean-50">Grand</h3>
            <p className="text-ocean-300 text-sm mt-2">80 × 50 × 40 cm</p>
            <p className="text-ocean-400 text-xs mt-2">~25 poissons max</p>
            <p className="text-ocean-500 text-xs">160 L</p>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={handleStart}
            className="px-8 py-3 bg-ocean-500 hover:bg-ocean-400 active:bg-ocean-600 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg shadow-ocean-500/30 hover:shadow-ocean-400/40 cursor-pointer"
          >
            ✨ Créer mon aquarium
          </button>
          <button
            onClick={handleLoad}
            className="px-6 py-3 bg-ocean-800/60 hover:bg-ocean-700/60 border border-ocean-600/50 text-ocean-200 rounded-xl transition-all duration-200 cursor-pointer"
          >
            📂 Charger une sauvegarde
          </button>
        </div>
      </div>
    </div>
  );
}
