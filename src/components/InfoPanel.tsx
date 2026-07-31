import { useEffect, useState } from 'react';
import { useAquariumStore } from '../store';
import { getElementById } from '../data';
import type { PlacedElement } from '../types';

export function InfoPanel() {
  const { state, dispatch, getStats } = useAquariumStore();
  const { config, selectedElementId, placedElements } = state;
  const stats = getStats();

  const [selectedPlaced, setSelectedPlaced] = useState<PlacedElement | null>(null);

  useEffect(() => {
    if (selectedElementId) {
      const found = placedElements.find(pe => pe.instanceId === selectedElementId);
      setSelectedPlaced(found || null);
    } else {
      setSelectedPlaced(null);
    }
  }, [selectedElementId, placedElements]);

  if (!config) return null;

  const selectedElement = selectedPlaced && config
    ? getElementById(config.waterType, selectedPlaced.elementId)
    : null;

  return (
    <div className="fixed bottom-4 left-4 z-40 space-y-3">
      {/* Stats panel */}
      <div className="bg-ocean-900/85 backdrop-blur-md border border-ocean-700/50 rounded-xl p-4 w-64 text-sm">
        <h3 className="text-ocean-300 font-semibold mb-3 text-xs uppercase tracking-wider">📊 Informations</h3>
        <div className="space-y-1.5">
          <div className="flex justify-between text-ocean-200">
            <span>Type</span>
            <span className="text-ocean-100">{config.waterType === 'freshwater' ? 'Eau douce' : 'Eau de mer'}</span>
          </div>
          <div className="flex justify-between text-ocean-200">
            <span>Taille</span>
            <span className="text-ocean-100">{config.size === 'large' ? 'Grand' : config.size === 'medium' ? 'Moyen' : 'Petit'}</span>
          </div>
          <div className="flex justify-between text-ocean-200">
            <span>Poissons</span>
            <span className="text-ocean-100">{stats.fishCount} / {stats.maxFish}</span>
          </div>
          <div className="flex justify-between text-ocean-200">
            <span>Plantes</span>
            <span className="text-ocean-100">{stats.plantCount}</span>
          </div>
          <div className="flex justify-between text-ocean-200">
            <span>Coraux</span>
            <span className="text-ocean-100">{stats.coralCount}</span>
          </div>
          <div className="flex justify-between text-ocean-200">
            <span>Décorations</span>
            <span className="text-ocean-100">{stats.decorCount}</span>
          </div>
          <div className="flex justify-between text-ocean-200 pt-1 border-t border-ocean-700/40">
            <span>Pompe à air</span>
            <span className={state.pumpEnabled ? 'text-green-400' : 'text-ocean-500'}>
              {state.pumpEnabled ? 'Activée' : 'Désactivée'}
            </span>
          </div>
        </div>
      </div>

      {/* Selected element controls */}
      {selectedPlaced && selectedElement && (
        <div className="bg-ocean-900/85 backdrop-blur-md border border-ocean-700/50 rounded-xl p-4 w-64 text-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-ocean-300 font-semibold text-xs uppercase tracking-wider">
              ✏️ Objet sélectionné
            </h3>
            <button
              onClick={() => dispatch({ type: 'SELECT_ELEMENT', instanceId: null })}
              className="text-ocean-500 hover:text-ocean-200 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{selectedElement.icon}</span>
            <div>
              <div className="text-ocean-100 font-medium text-xs">{selectedElement.name}</div>
              <div className="text-ocean-400 text-[10px]">{selectedElement.category}</div>
            </div>
          </div>

          {/* Scale */}
          <div className="mb-2">
            <label className="text-ocean-400 text-[10px] block mb-1">Taille: {selectedPlaced.scale.toFixed(1)}x</label>
            <input
              type="range"
              min="0.3"
              max="2"
              step="0.1"
              value={selectedPlaced.scale}
              onChange={(e) => dispatch({
                type: 'UPDATE_ELEMENT_SCALE',
                instanceId: selectedPlaced.instanceId,
                scale: parseFloat(e.target.value),
              })}
              className="w-full h-1.5 accent-ocean-500 rounded cursor-pointer"
            />
          </div>

          {/* Position controls */}
          <div className="grid grid-cols-3 gap-1 mb-2">
            {(['X', 'Y', 'Z'] as const).map((axis, i) => (
              <div key={axis} className="text-center">
                <span className="text-ocean-500 text-[10px]">{axis}</span>
                <div className="flex gap-0.5 justify-center">
                  <button
                    onClick={() => {
                      const newPos = [...selectedPlaced.position] as [number, number, number];
                      newPos[i] -= 0.2;
                      dispatch({ type: 'UPDATE_ELEMENT_POSITION', instanceId: selectedPlaced.instanceId, position: newPos });
                    }}
                    className="w-5 h-5 text-[10px] bg-ocean-800 hover:bg-ocean-700 rounded cursor-pointer text-ocean-300"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => {
                      const newPos = [...selectedPlaced.position] as [number, number, number];
                      newPos[i] += 0.2;
                      dispatch({ type: 'UPDATE_ELEMENT_POSITION', instanceId: selectedPlaced.instanceId, position: newPos });
                    }}
                    className="w-5 h-5 text-[10px] bg-ocean-800 hover:bg-ocean-700 rounded cursor-pointer text-ocean-300"
                  >
                    ▶
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => dispatch({ type: 'DUPLICATE_ELEMENT', instanceId: selectedPlaced.instanceId })}
              className="flex-1 py-1.5 text-xs bg-ocean-700/60 hover:bg-ocean-600/60 text-ocean-200 rounded cursor-pointer border border-ocean-600/30"
            >
              📋 Dupliquer
            </button>
            <button
              onClick={() => dispatch({ type: 'REMOVE_ELEMENT', instanceId: selectedPlaced.instanceId })}
              className="flex-1 py-1.5 text-xs bg-red-900/40 hover:bg-red-800/40 text-red-300 rounded cursor-pointer border border-red-800/30"
            >
              🗑️ Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
