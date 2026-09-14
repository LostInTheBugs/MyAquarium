import { useState } from 'react';
import { useAquariumStore } from '../store';
import { getElementsByCategory, categoryLabels, categoryIcons } from '../data';
import type { ElementCategory } from '../types';
import { useAudioSystem } from '../hooks/useAudioSystem';

export function CustomizationPanel() {
  const { state, dispatch, canAdd } = useAquariumStore();
  const { config, activeCategory, graphicsQuality, showAdvancedEffects, lightOn } = state;
  const audio = useAudioSystem();

  const [menuOpen, setMenuOpen] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  if (!config) return null;

  const categories: ElementCategory[] = config.waterType === 'freshwater'
    ? ['substrate', 'decorations', 'plants', 'fish', 'equipment']
    : ['substrate', 'decorations', 'corals', 'fish', 'equipment'];

  const handleAdd = (elementId: string) => {
    const error = canAdd(elementId);
    if (error) {
      setMessage(error);
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    dispatch({ type: 'ADD_ELEMENT', elementId });
    setMessage(null);
  };

  const handleSave = () => {
    try {
      const saveData = { ...state };
      localStorage.setItem('aquarium-save', JSON.stringify(saveData));
      setMessage('💾 Configuration sauvegardée !');
      setTimeout(() => setMessage(null), 2000);
    } catch {
      setMessage('❌ Erreur lors de la sauvegarde.');
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleReset = () => {
    if (confirm('Vider complètement l\'aquarium ?')) {
      dispatch({ type: 'RESET_AQUARIUM' });
    }
  };

  const handleBack = () => {
    if (confirm('Retourner à l\'écran de configuration ? Votre aquarium sera perdu.')) {
      dispatch({ type: 'CLEAR_ALL' });
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-ocean-700/80 backdrop-blur border border-ocean-500/40 flex items-center justify-center text-ocean-100 hover:bg-ocean-600/80 transition-all cursor-pointer"
        title={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Side panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-ocean-900/90 backdrop-blur-md border-l border-ocean-700/50 z-40 transition-transform duration-300 overflow-y-auto ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pt-8">
            <h2 className="text-lg font-semibold text-ocean-100">
              {config.waterType === 'freshwater' ? '🐠 Eau douce' : '🪸 Eau de mer'}
              <span className="text-ocean-400 text-sm ml-2">
                {config.size === 'large' ? 'Grand' : config.size === 'medium' ? 'Moyen' : 'Petit'}
              </span>
            </h2>
          </div>

          {/* Message */}
          {message && (
            <div className="p-3 rounded-lg bg-ocean-800/80 border border-ocean-600/40 text-ocean-200 text-sm animate-pulse">
              {message}
            </div>
          )}

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => dispatch({ type: 'SET_CATEGORY', category: activeCategory === cat ? null : cat })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer
                  ${activeCategory === cat
                    ? 'bg-ocean-500 text-white shadow'
                    : 'bg-ocean-800/60 text-ocean-300 hover:bg-ocean-700/60 border border-ocean-700/40'}`}
              >
                {categoryIcons[cat]} {categoryLabels[cat]}
              </button>
            ))}
          </div>

          {/* Elements list */}
          {activeCategory && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-ocean-300 uppercase tracking-wider">
                {categoryLabels[activeCategory]}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {getElementsByCategory(config.waterType, activeCategory).map(element => {
                  const error = canAdd(element.id);
                  const disabled = error !== null;
                  return (
                    <button
                      key={element.id}
                      onClick={() => handleAdd(element.id)}
                      disabled={disabled}
                      title={disabled ? error || '' : `Ajouter ${element.name}`}
                      className={`p-3 rounded-lg text-left transition-all cursor-pointer
                        ${disabled
                          ? 'bg-ocean-900/60 opacity-40 cursor-not-allowed border border-ocean-800/40'
                          : 'bg-ocean-800/60 hover:bg-ocean-700/60 border border-ocean-600/30 hover:border-ocean-500/40 active:scale-95'}`}
                    >
                      <div className="text-2xl mb-1">{element.icon}</div>
                      <div className="text-xs font-medium text-ocean-100">{element.name}</div>
                      <div className="text-[10px] text-ocean-400 mt-0.5">{element.description.substring(0, 40)}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pump controls */}
          <div className="space-y-2 p-3 rounded-lg bg-ocean-800/60 border border-ocean-700/40">
            <h3 className="text-sm font-medium text-ocean-300">💨 Pompe à air</h3>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_PUMP' })}
              className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer
                ${state.pumpEnabled
                  ? 'bg-ocean-500 text-white'
                  : 'bg-ocean-800 text-ocean-300 border border-ocean-600/30'}`}
            >
              {state.pumpEnabled ? '✓ Activée' : 'Désactivée'}
            </button>
            {state.pumpEnabled && (
              <div className="flex gap-1">
                {(['low', 'medium', 'high'] as const).map(intensity => (
                  <button
                    key={intensity}
                    onClick={() => dispatch({ type: 'SET_PUMP_INTENSITY', intensity })}
                    className={`flex-1 py-1 px-2 rounded text-xs transition-all cursor-pointer
                      ${state.pumpIntensity === intensity
                        ? 'bg-ocean-500 text-white'
                        : 'bg-ocean-800/60 text-ocean-400 hover:bg-ocean-700/60'}`}
                  >
                    {intensity === 'low' ? 'Faible' : intensity === 'medium' ? 'Moyen' : 'Fort'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lighting control */}
          <div className="space-y-2 p-3 rounded-lg bg-ocean-800/60 border border-ocean-700/40">
            <h3 className="text-sm font-medium text-ocean-300">💡 Éclairage</h3>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_LIGHT' })}
              className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer
                ${lightOn ? 'bg-amber-500/80 text-white' : 'bg-ocean-800 text-ocean-400 border border-ocean-600/30'}`}
            >
              {lightOn ? '✓ Allumé' : 'Éteint'}
            </button>
          </div>

          {/* Audio controls */}
          <div className="space-y-2 p-3 rounded-lg bg-ocean-800/60 border border-ocean-700/40">
            <h3 className="text-sm font-medium text-ocean-300">🔊 Son</h3>
            {!audio.isUnlocked ? (
              <button
                onClick={audio.unlock}
                className="w-full py-2 px-3 rounded-lg text-sm bg-ocean-500 hover:bg-ocean-400 text-white transition-all cursor-pointer"
              >
                🔓 Activer le son
              </button>
            ) : (
              <>
                <button
                  onClick={audio.toggleAudio}
                  className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer
                    ${audio.audioEnabled ? 'bg-ocean-500 text-white' : 'bg-ocean-800 text-ocean-400 border border-ocean-600/30'}`}
                >
                  {audio.audioEnabled ? '🔊 Son activé' : '🔇 Son désactivé'}
                </button>
                {audio.audioEnabled && (
                  <div className="flex items-center gap-2">
                    <span className="text-ocean-500 text-xs">Vol.</span>
                    <input
                      type="range" min="0" max="100" defaultValue="30"
                      onChange={(e) => audio.setVolume(parseInt(e.target.value) / 100)}
                      className="flex-1 h-1.5 accent-ocean-500 rounded cursor-pointer"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Graphics settings */}
          <div className="space-y-2 p-3 rounded-lg bg-ocean-800/60 border border-ocean-700/40">
            <h3 className="text-sm font-medium text-ocean-300">🎨 Qualité graphique</h3>
            <div className="flex gap-1">
              {(['low', 'medium', 'high'] as const).map(q => (
                <button
                  key={q}
                  onClick={() => dispatch({ type: 'SET_GRAPHICS', quality: q })}
                  className={`flex-1 py-1 px-2 rounded text-xs transition-all cursor-pointer
                    ${graphicsQuality === q
                      ? 'bg-ocean-500 text-white'
                      : 'bg-ocean-800/60 text-ocean-400 hover:bg-ocean-700/60'}`}
                >
                  {q === 'low' ? 'Basse' : q === 'medium' ? 'Moyenne' : 'Haute'}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs text-ocean-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showAdvancedEffects}
                onChange={() => dispatch({ type: 'TOGGLE_ADVANCED_EFFECTS' })}
                className="w-4 h-4 rounded accent-ocean-500"
              />
              Effets avancés (particules)
            </label>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2 border-t border-ocean-700/40">
            <button
              onClick={handleSave}
              className="w-full py-2 px-3 rounded-lg text-sm bg-ocean-700/60 hover:bg-ocean-600/60 text-ocean-200 border border-ocean-600/30 transition-all cursor-pointer"
            >
              💾 Sauvegarder
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_VIEW_MODE' })}
              className={`w-full py-2 px-3 rounded-lg text-sm transition-all cursor-pointer border
                ${state.viewMode === '2d'
                  ? 'bg-sky-600/80 hover:bg-sky-500/80 text-white border-sky-400/40'
                  : 'bg-ocean-700/60 hover:bg-ocean-600/60 text-ocean-200 border-ocean-600/30'}`}
            >
              {state.viewMode === '2d' ? '🔄 Vue 3D (libre)' : '🖼️ Vue 2D (face)'}
            </button>
            <button
              onClick={() => dispatch({ type: 'TRIGGER_CAMERA_RESET' })}
              className="w-full py-2 px-3 rounded-lg text-sm bg-ocean-700/60 hover:bg-ocean-600/60 text-ocean-200 border border-ocean-600/30 transition-all cursor-pointer"
            >
              📷 Réinitialiser la caméra
            </button>
            <button
              onClick={handleReset}
              className="w-full py-2 px-3 rounded-lg text-sm bg-red-900/40 hover:bg-red-800/40 text-red-300 border border-red-800/30 transition-all cursor-pointer"
            >
              🗑️ Vider l'aquarium
            </button>
            <button
              onClick={handleBack}
              className="w-full py-2 px-3 rounded-lg text-sm bg-ocean-800/60 hover:bg-ocean-700/60 text-ocean-400 border border-ocean-700/40 transition-all cursor-pointer"
            >
              ← Retour configuration
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
