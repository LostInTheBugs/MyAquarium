import { useEffect, useState } from 'react';
import { AquariumStoreProvider, useAquariumStore } from './store';
import type { WaterType } from './types';
import { ConfigScreen } from './components/ConfigScreen';
import { AquariumScene } from './components/AquariumScene';
import { CustomizationPanel } from './components/CustomizationPanel';
import { InfoPanel } from './components/InfoPanel';
import { DiscoverScreen } from './components/DiscoverScreen';

function AquariumView() {
  const { state, dispatch } = useAquariumStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [discoverWaterType, setDiscoverWaterType] = useState<WaterType | null>(null);

  // Suivi de l'état plein écran (touche Échap incluse)
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  // En quittant le mode 2D, on sort aussi du plein écran
  useEffect(() => {
    if (state.viewMode === '3d' && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, [state.viewMode]);

  if (!state.config) {
    if (discoverWaterType) {
      return <DiscoverScreen waterType={discoverWaterType} onBack={() => setDiscoverWaterType(null)} />;
    }
    return <ConfigScreen onDiscover={setDiscoverWaterType} />;
  }

  // Plein écran = mode 2D + fullscreen actif : UI masquée, aquarium seul
  const fullscreen2D = state.viewMode === '2d' && isFullscreen;

  return (
    <div className="w-full h-full relative">
      {/* 3D Scene */}
      <AquariumScene />

      {/* UI Overlay — masquée en plein écran 2D */}
      {!fullscreen2D && <CustomizationPanel />}
      {!fullscreen2D && <InfoPanel />}

      {/* Contrôles flottants (haut gauche) */}
      {!fullscreen2D && (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_VIEW_MODE' })}
            title={state.viewMode === '2d' ? 'Revenir en vue 3D libre' : 'Passer en vue 2D (face)'}
            className="px-3 py-2 rounded-full bg-ocean-800/80 backdrop-blur border border-ocean-500/40 text-ocean-100 text-sm font-medium hover:bg-ocean-700/80 transition-all cursor-pointer shadow-lg"
          >
            {state.viewMode === '2d' ? '🔄 Vue 3D' : '🖼️ Vue 2D'}
          </button>
          {state.viewMode === '2d' && (
            <button
              onClick={toggleFullscreen}
              title="Passer en plein écran (fond d'écran)"
              className="px-3 py-2 rounded-full bg-ocean-800/80 backdrop-blur border border-ocean-500/40 text-ocean-100 text-sm font-medium hover:bg-ocean-700/80 transition-all cursor-pointer shadow-lg"
            >
              ⛶ Plein écran
            </button>
          )}
        </div>
      )}

      {/* Bouton discret pour quitter le plein écran */}
      {fullscreen2D && (
        <>
          <button
            onClick={toggleFullscreen}
            title="Quitter le plein écran"
            className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full bg-black/25 backdrop-blur border border-white/10 text-white/60 text-xs hover:text-white hover:bg-black/50 transition-all cursor-pointer"
          >
            ✕ Quitter
          </button>
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-white/35 text-xs pointer-events-none select-none">
            Échap pour quitter le plein écran
          </div>
        </>
      )}

      {/* Hint */}
      {!fullscreen2D && (
        <div className="fixed bottom-4 right-4 text-ocean-600 text-xs pointer-events-none">
          {state.viewMode === '2d'
            ? '🖼️ Vue 2D — « ⛶ Plein écran » pour le fond d\'écran, « Vue 3D » pour pivoter'
            : '🖱️ Clic droit + glisser pour pivoter • Molette pour zoomer'}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AquariumStoreProvider>
      <AquariumView />
    </AquariumStoreProvider>
  );
}
