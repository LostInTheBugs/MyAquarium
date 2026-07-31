import { AquariumStoreProvider, useAquariumStore } from './store';
import { ConfigScreen } from './components/ConfigScreen';
import { AquariumScene } from './components/AquariumScene';
import { CustomizationPanel } from './components/CustomizationPanel';
import { InfoPanel } from './components/InfoPanel';

function AquariumView() {
  const { state } = useAquariumStore();

  if (!state.config) {
    return <ConfigScreen />;
  }

  return (
    <div className="w-full h-full relative">
      {/* 3D Scene */}
      <AquariumScene />

      {/* UI Overlay */}
      <CustomizationPanel />
      <InfoPanel />

      {/* Fullscreen hint */}
      <div className="fixed bottom-4 right-4 text-ocean-600 text-xs pointer-events-none">
        🖱️ Clic droit + glisser pour pivoter &bull; Molette pour zoomer
      </div>
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
