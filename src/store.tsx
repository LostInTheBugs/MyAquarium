import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { AquariumState, TankConfig, PlacedElement, ElementCategory, TankSize } from './types';
import { getElementById, getElements } from './data';
import { maxFishCount } from './types';

type Action =
  | { type: 'SET_CONFIG'; config: TankConfig }
  | { type: 'ADD_ELEMENT'; elementId: string }
  | { type: 'REMOVE_ELEMENT'; instanceId: string }
  | { type: 'DUPLICATE_ELEMENT'; instanceId: string }
  | { type: 'UPDATE_ELEMENT_POSITION'; instanceId: string; position: [number, number, number] }
  | { type: 'UPDATE_ELEMENT_ROTATION'; instanceId: string; rotation: [number, number, number] }
  | { type: 'UPDATE_ELEMENT_SCALE'; instanceId: string; scale: number }
  | { type: 'SELECT_ELEMENT'; instanceId: string | null }
  | { type: 'SET_CATEGORY'; category: ElementCategory | null }
  | { type: 'TOGGLE_PUMP' }
  | { type: 'SET_PUMP_INTENSITY'; intensity: 'low' | 'medium' | 'high' }
  | { type: 'RESET_AQUARIUM' }
  | { type: 'CLEAR_ALL' }
  | { type: 'LOAD_STATE'; state: Partial<AquariumState> }
  | { type: 'SET_GRAPHICS'; quality: 'low' | 'medium' | 'high' }
  | { type: 'TOGGLE_ADVANCED_EFFECTS' }
  | { type: 'TRIGGER_CAMERA_RESET' }
  | { type: 'CAMERA_RESET_DONE' }
  | { type: 'TOGGLE_LIGHT' };

const initialState: AquariumState = {
  config: null,
  placedElements: [],
  pumpEnabled: false,
  pumpIntensity: 'medium',
  selectedElementId: null,
  activeCategory: null,
  graphicsQuality: 'high',
  showAdvancedEffects: true,
  cameraReset: false,
  lightOn: true,
};

let instanceCounter = 0;

function canAddElement(state: AquariumState, elementId: string): string | null {
  const { config } = state;
  if (!config) return "Aucune configuration d'aquarium.";

  const element = getElementById(config.waterType, elementId);
  if (!element) return 'Élément non trouvé.';

  if (element.waterType !== 'both' && element.waterType !== config.waterType) {
    return `Cet élément n'est pas compatible avec l'eau ${config.waterType === 'freshwater' ? 'douce' : 'de mer'}.`;
  }

  const sizeOrder: TankSize[] = ['small', 'medium', 'large'];
  if (sizeOrder.indexOf(config.size) < sizeOrder.indexOf(element.minTankSize)) {
    return `Cet élément nécessite un aquarium de taille ${element.minTankSize} minimum.`;
  }

  const existingCount = state.placedElements.filter(
    pe => pe.elementId === elementId
  ).length;
  if (existingCount >= element.maxCount) {
    return `Maximum de ${element.maxCount} "${element.name}" atteint.`;
  }

  if (element.category === 'fish') {
    const totalFish = state.placedElements.filter(pe => {
      const e = getElementById(config.waterType, pe.elementId);
      return e?.category === 'fish';
    }).length;
    if (totalFish >= maxFishCount(config.size)) {
      return `Capacité maximale de poissons atteinte (${maxFishCount(config.size)}).`;
    }
  }

  return null;
}

function getDefaultPosition(state: AquariumState, elementId: string): [number, number, number] {
  const element = state.config ? getElementById(state.config.waterType, elementId) : null;
  if (!element) return [0, 0, 0];

  const existing = state.placedElements.filter(pe => pe.elementId === elementId).length;

  switch (element.category) {
    case 'substrate':
      return [0, -0.85, 0];
    case 'fish':
      return [
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.3) * 0.6,
        (Math.random() - 0.5) * 2
      ];
    case 'plants':
      return [
        (existing % 2 === 0 ? 1 : -1) * (0.5 + existing * 0.3),
        -0.85,
        (existing % 3 - 1) * 0.6
      ];
    case 'corals':
      return [
        (existing % 2 === 0 ? 1 : -1) * (0.8 + existing * 0.4),
        -0.85,
        (existing % 3 - 1) * 0.7
      ];
    case 'decorations':
      return [
        (existing % 2 === 0 ? 1 : -1) * (0.4 + existing * 0.5),
        -0.85,
        (existing % 2 === 0 ? 0.3 : -0.3)
      ];
    case 'equipment':
      return [-3.8, 0.5, 0];
    default:
      return [0, -0.6, 0];
  }
}

function reducer(state: AquariumState, action: Action): AquariumState {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...initialState, config: action.config };

    case 'ADD_ELEMENT': {
      const error = canAddElement(state, action.elementId);
      if (error) {
        console.warn(error);
        return state;
      }
      instanceCounter++;
      const newElement: PlacedElement = {
        instanceId: `el-${instanceCounter}`,
        elementId: action.elementId,
        position: getDefaultPosition(state, action.elementId),
        rotation: [0, Math.random() * Math.PI * 2, 0],
        scale: 1,
      };
      return {
        ...state,
        placedElements: [...state.placedElements, newElement],
        selectedElementId: newElement.instanceId,
      };
    }

    case 'REMOVE_ELEMENT':
      return {
        ...state,
        placedElements: state.placedElements.filter(pe => pe.instanceId !== action.instanceId),
        selectedElementId: state.selectedElementId === action.instanceId ? null : state.selectedElementId,
      };

    case 'DUPLICATE_ELEMENT': {
      const original = state.placedElements.find(pe => pe.instanceId === action.instanceId);
      if (!original) return state;
      const error = canAddElement(state, original.elementId);
      if (error) return state;
      instanceCounter++;
      const dup: PlacedElement = {
        ...original,
        instanceId: `el-${instanceCounter}`,
        position: [
          original.position[0] + 0.3,
          original.position[1],
          original.position[2] + 0.3,
        ],
      };
      return {
        ...state,
        placedElements: [...state.placedElements, dup],
        selectedElementId: dup.instanceId,
      };
    }

    case 'UPDATE_ELEMENT_POSITION':
      return {
        ...state,
        placedElements: state.placedElements.map(pe =>
          pe.instanceId === action.instanceId
            ? { ...pe, position: action.position }
            : pe
        ),
      };

    case 'UPDATE_ELEMENT_ROTATION':
      return {
        ...state,
        placedElements: state.placedElements.map(pe =>
          pe.instanceId === action.instanceId
            ? { ...pe, rotation: action.rotation }
            : pe
        ),
      };

    case 'UPDATE_ELEMENT_SCALE':
      return {
        ...state,
        placedElements: state.placedElements.map(pe =>
          pe.instanceId === action.instanceId
            ? { ...pe, scale: Math.max(0.3, Math.min(2, action.scale)) }
            : pe
        ),
      };

    case 'SELECT_ELEMENT':
      return { ...state, selectedElementId: action.instanceId };

    case 'SET_CATEGORY':
      return { ...state, activeCategory: action.category };

    case 'TOGGLE_PUMP':
      return { ...state, pumpEnabled: !state.pumpEnabled };

    case 'SET_PUMP_INTENSITY':
      return { ...state, pumpIntensity: action.intensity };

    case 'RESET_AQUARIUM':
      return { ...state, placedElements: [], selectedElementId: null, pumpEnabled: false };

    case 'CLEAR_ALL':
      return { ...initialState };

    case 'LOAD_STATE':
      return { ...initialState, ...action.state, config: action.state.config || null };

    case 'SET_GRAPHICS':
      return { ...state, graphicsQuality: action.quality };

    case 'TOGGLE_ADVANCED_EFFECTS':
      return { ...state, showAdvancedEffects: !state.showAdvancedEffects };

    case 'TRIGGER_CAMERA_RESET':
      return { ...state, cameraReset: true };

    case 'CAMERA_RESET_DONE':
      return { ...state, cameraReset: false };

    case 'TOGGLE_LIGHT':
      return { ...state, lightOn: !state.lightOn };

    default:
      return state;
  }
}

interface StoreContextValue {
  state: AquariumState;
  dispatch: React.Dispatch<Action>;
  canAdd: (elementId: string) => string | null;
  getStats: () => {
    fishCount: number;
    plantCount: number;
    coralCount: number;
    decorCount: number;
    totalElements: number;
    maxFish: number;
  };
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function AquariumStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const canAdd = (elementId: string) => canAddElement(state, elementId);

  const getStats = () => {
    if (!state.config) return { fishCount: 0, plantCount: 0, coralCount: 0, decorCount: 0, totalElements: 0, maxFish: 0 };
    const elements = getElements(state.config.waterType);
    const elementMap = new Map(elements.map(e => [e.id, e]));

    let fishCount = 0, plantCount = 0, coralCount = 0, decorCount = 0;
    for (const pe of state.placedElements) {
      const e = elementMap.get(pe.elementId);
      if (!e) continue;
      switch (e.category) {
        case 'fish': fishCount++; break;
        case 'plants': plantCount++; break;
        case 'corals': coralCount++; break;
        case 'decorations': decorCount++; break;
      }
    }

    return {
      fishCount,
      plantCount,
      coralCount,
      decorCount,
      totalElements: state.placedElements.length,
      maxFish: maxFishCount(state.config.size),
    };
  };

  return (
    <StoreContext.Provider value={{ state, dispatch, canAdd, getStats }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useAquariumStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useAquariumStore must be used within AquariumStoreProvider');
  return ctx;
}
