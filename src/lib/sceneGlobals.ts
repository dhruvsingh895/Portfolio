import * as THREE from "three";

export const EARTH_RADIUS = 1.0;
export const DEG2RAD = Math.PI / 180;
export const INDIA_LAT = 26.4499;
export const INDIA_LON = 80.3319;

export function latLonToVec3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * DEG2RAD;
  const theta = (lon + 180) * DEG2RAD;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export const INDIA_POINT = latLonToVec3(INDIA_LAT, INDIA_LON, EARTH_RADIUS);
export const indiaMarkerWorld = { value: INDIA_POINT.clone() };