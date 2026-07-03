"use client";

/**
 * Shared gallery lighting rig: warm key (gallery spot), cool rim counter,
 * low warm hemisphere fill so materials never crush to pure black.
 */
export default function Lights() {
  return (
    <>
      <hemisphereLight args={["#2a2118", "#0b0908", 0.6]} />
      <directionalLight
        position={[6, 8, 4]}
        color="#ffb066"
        intensity={1.4}
      />
      <directionalLight
        position={[-7, 3, -6]}
        color="#3a4a6b"
        intensity={0.7}
      />
    </>
  );
}
