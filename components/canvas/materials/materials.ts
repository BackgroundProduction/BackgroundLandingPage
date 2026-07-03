import * as THREE from "three";

/** Aged gold — matches --color-gold family in globals.css */
export function createGoldMaterial(bright = false) {
  return new THREE.MeshPhysicalMaterial({
    color: bright ? "#e9c873" : "#c9a24b",
    metalness: 1,
    roughness: 0.28,
    envMapIntensity: 1.2,
  });
}

/** Crystal/glass for chandelier drops and champagne coupes */
export function createCrystalMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: "#fffaf0",
    metalness: 0,
    roughness: 0.05,
    transmission: 1,
    thickness: 0.4,
    ior: 1.7,
    envMapIntensity: 1.6,
  });
}

/** Oxblood velvet — high roughness + sheen */
export function createVelvetMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: "#5c1a1f",
    metalness: 0,
    roughness: 0.95,
    sheen: 1,
    sheenColor: new THREE.Color("#8a3038"),
    sheenRoughness: 0.6,
  });
}
