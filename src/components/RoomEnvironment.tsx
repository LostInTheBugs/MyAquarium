import { tankDimensions, tankFloorY, type TankSize } from '../types';

/**
 * Environnement de pièce minimaliste : sol sombre légèrement brillant +
 * mur du fond sombre. Donne un contexte au bac (comme dans les références
 * avec meuble en intérieur) au lieu d'un vide noir.
 */
export function RoomEnvironment({ size }: { size: TankSize }) {
  const dims = tankDimensions(size);
  const floorY = tankFloorY(size);
  const wallZ = -dims.depth / 2 - 3.2;

  return (
    <group>
      {/* Sol */}
      <mesh position={[0, floorY, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#131009" roughness={0.78} metalness={0.06} fog={false} />
      </mesh>
      {/* Mur du fond */}
      <mesh position={[0, floorY + 9, wallZ]} receiveShadow>
        <planeGeometry args={[60, 18]} />
        <meshStandardMaterial color="#0a0c0f" roughness={1} metalness={0} fog={false} />
      </mesh>
    </group>
  );
}
