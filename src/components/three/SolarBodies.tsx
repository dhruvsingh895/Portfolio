"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { pointerState } from "@/lib/pointerBus";
import {
  makePlanetTexture,
  makeSunTexture,
  makeEarthTexture,
  makeCloudTexture,
} from "@/lib/textures";
import { EARTH_RADIUS, INDIA_POINT, indiaMarkerWorld } from "@/lib/sceneGlobals";
import { SCENE_COLORFUL, useScenePalette } from "@/lib/sceneTheme";

const TOUCH = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;

/* ── Shared fresnel shaders ────────────────────────────── */
const fresnelVertex = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragment = `
  uniform vec3 uColor;
  uniform vec3 uColor2;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.2);
    vec3 color = mix(uColor, uColor2, fresnel);
    gl_FragColor = vec4(color, fresnel * 0.55);
  }
`;

const sunCoronaFragment = `
  uniform vec3 uColor;
  uniform vec3 uColor2;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.6);
    vec3 color = mix(uColor, uColor2, fresnel);
    gl_FragColor = vec4(color, fresnel * 0.8);
  }
`;

/* ── Sun ───────────────────────────────────────────────── */
function Sun() {
  const palette = useScenePalette();
  const colorful = palette === SCENE_COLORFUL;
  const sunMesh = useRef<THREE.Mesh>(null);
  const coronaMat = useRef<THREE.ShaderMaterial>(null);
  const flare = useRef<THREE.Points>(null);
  const sunUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(palette.corona) },
      uColor2: { value: new THREE.Color(palette.corona2) },
    }),
    [palette],
  );
  const flareCount = TOUCH ? 50 : 110;

  const sunTex = useMemo(() => makeSunTexture(512, colorful), [colorful]);
  const flarePositions = useMemo(() => {
    const arr = new Float32Array(flareCount * 3);
    for (let i = 0; i < flareCount; i++) {
      const r = 2.1 + Math.random() * 1.5;
      const a = Math.random() * Math.PI * 2;
      const b = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * Math.sin(b) * r;
      arr[i * 3 + 1] = Math.sin(a) * Math.sin(b) * r;
      arr[i * 3 + 2] = Math.cos(b) * r;
    }
    return arr;
  }, [flareCount]);

  useEffect(() => () => sunTex.dispose(), [sunTex]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (sunMesh.current) sunMesh.current.rotation.y += dt * 0.04;
    if (coronaMat.current) {
      coronaMat.current.uniforms.uTime.value = t;
      coronaMat.current.opacity = 0.78 + Math.sin(t * 1.4) * 0.07;
    }
    if (flare.current) {
      flare.current.rotation.y += dt * 0.05;
      flare.current.rotation.x += dt * 0.012;
    }
  });

  return (
    <group>
      <mesh ref={sunMesh}>
        <sphereGeometry args={[1.62, 48, 48]} />
        <meshBasicMaterial map={sunTex} />
      </mesh>

      <mesh scale={1.5}>
        <sphereGeometry args={[1.62, 40, 40]} />
        <shaderMaterial
          ref={coronaMat}
          vertexShader={fresnelVertex}
          fragmentShader={sunCoronaFragment}
          uniforms={sunUniforms}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <points ref={flare}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[flarePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          color={palette.flare}
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

/* ── Earth + atmosphere + clouds + India marker + moon ─── */
export function Earth({ phase }: { phase: string }) {
  const palette = useScenePalette();
  const colorful = palette === SCENE_COLORFUL;
  const group = useRef<THREE.Group>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const markerMat = useRef<THREE.MeshBasicMaterial>(null);
  const beamMat = useRef<THREE.MeshBasicMaterial>(null);
  const moon = useRef<THREE.Group>(null);
  const rotRef = useRef(0);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const earthTex = useMemo(() => makeEarthTexture(768, colorful), [colorful]);
  const cloudTex = useMemo(() => makeCloudTexture(), []);
  const moonTex = useMemo(() => makePlanetTexture("mercury"), []);

  const indiaDir = useMemo(() => INDIA_POINT.clone().normalize(), []);
  const beamQuat = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), indiaDir),
    [indiaDir],
  );
  const ringQuat = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), indiaDir),
    [indiaDir],
  );

  useEffect(() => {
    return () => {
      earthTex.dispose();
      cloudTex.dispose();
      moonTex.dispose();
    };
  }, [earthTex, cloudTex, moonTex]);

  useFrame((state, dt) => {
    const speed = phase === "boot" ? 0.05 : 0.045;
    rotRef.current += dt * speed;
    if (group.current) group.current.rotation.y = rotRef.current;
    if (clouds.current) clouds.current.rotation.y = rotRef.current * 1.35;
    if (moon.current) moon.current.rotation.y += dt * (phase === "boot" ? 0.12 : 0.6);

    if (group.current) {
      tmp.copy(INDIA_POINT);
      group.current.localToWorld(tmp);
      indiaMarkerWorld.value.copy(tmp);
    }

    if (phase !== "boot") {
      const t = state.clock.elapsedTime;
      if (markerMat.current) markerMat.current.opacity = 0.55 + Math.sin(t * 3) * 0.3;
      if (beamMat.current) beamMat.current.opacity = 0.14 + Math.sin(t * 2.4) * 0.1;
    }
  });

  const atmoUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(palette.atmosphere) },
      uColor2: { value: new THREE.Color(palette.atmosphere2) },
    }),
    [palette],
  );

  const beamPos = indiaDir.clone().multiplyScalar(EARTH_RADIUS + 0.28);
  const haloPos = indiaDir.clone().multiplyScalar(EARTH_RADIUS + 0.02);

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshPhongMaterial map={earthTex} shininess={6} specular={new THREE.Color(palette.earthSpecular)} />
      </mesh>

      <mesh ref={clouds} scale={1.012}>
        <sphereGeometry args={[EARTH_RADIUS, 48, 48]} />
        <meshStandardMaterial map={cloudTex} transparent opacity={0.68} depthWrite={false} />
      </mesh>

      <mesh scale={1.14}>
        <sphereGeometry args={[EARTH_RADIUS, 48, 48]} />
        <shaderMaterial
          vertexShader={fresnelVertex}
          fragmentShader={atmosphereFragment}
          uniforms={atmoUniforms}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2.5, 0.5, 0]} scale={1.3}>
        <ringGeometry args={[EARTH_RADIUS * 0.42, EARTH_RADIUS * 0.424, 80]} />
        <meshBasicMaterial
          color={palette.atmosphere}
          transparent
          opacity={0.24}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group>
        <mesh position={INDIA_POINT}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial ref={markerMat} color={palette.marker} transparent opacity={0.7} depthWrite={false} />
        </mesh>
        <mesh position={haloPos}>
          <sphereGeometry args={[0.11, 24, 24]} />
          <meshBasicMaterial color={palette.marker} transparent opacity={0.13} depthWrite={false} />
        </mesh>
        <mesh position={beamPos} quaternion={beamQuat}>
          <cylinderGeometry args={[0.02, 0.05, 0.6, 12, 1, true]} />
          <meshBasicMaterial
            ref={beamMat}
            color={palette.marker}
            transparent
            opacity={0.14}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh position={beamPos} quaternion={ringQuat}>
          <ringGeometry args={[0.09, 0.12, 48]} />
          <meshBasicMaterial color={palette.marker} transparent opacity={0.42} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <group ref={moon}>
        <group position={[EARTH_RADIUS * 1.9, 0.15, 0]}>
          <mesh>
            <sphereGeometry args={[EARTH_RADIUS * 0.16, 24, 24]} />
            <meshStandardMaterial map={moonTex} roughness={0.95} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ── Orbit ring lines ──────────────────────────────────── */
export function OrbitRing({ radius, color }: { radius: number; color?: string }) {
  const palette = useScenePalette();
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.006, radius + 0.006, 140]} />
      <meshBasicMaterial
        color={color ?? palette.orbit}
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Saturn's realistic multi-band rings ───────────────── */
function SaturnRings({ planetRadius }: { planetRadius: number }) {
  const palette = useScenePalette();
  const bands = palette.ringColors.map((c, i) => ({ i: 1.3 + i * 0.12, o: 1.42 + i * 0.12, op: [0.3, 0.55, 0.4, 0.25][i], c }));
  return (
    <group rotation={[0.55, 0.18, 0]}>
      {bands.map((b) => (
        <mesh key={`${b.i}-${b.o}`}>
          <ringGeometry args={[planetRadius * b.i, planetRadius * b.o, 96]} />
          <meshBasicMaterial
            color={b.c}
            transparent
            opacity={b.op}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Asteroid belt ─────────────────────────────────────── */
function AsteroidBelt() {
  const palette = useScenePalette();
  const instanced = useRef<THREE.InstancedMesh>(null);
  const belt = useRef<THREE.Group>(null);
  const count = TOUCH ? 150 : 340;

  const { positions, scales } = useMemo(() => {
    const positions: number[] = [];
    const scales: number[] = [];
    for (let i = 0; i < count; i++) {
      const r = 7.0 + (Math.random() - 0.5) * 1.1;
      const a = Math.random() * Math.PI * 2;
      positions.push(Math.cos(a) * r, (Math.random() - 0.5) * 0.4, Math.sin(a) * r);
      scales.push(0.03 + Math.random() * 0.06);
    }
    return { positions, scales };
  }, [count]);

  useLayoutEffect(() => {
    if (!instanced.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = scales[i];
      dummy.scale.set(s, s * (0.7 + Math.random() * 0.5), s);
      dummy.updateMatrix();
      instanced.current.setMatrixAt(i, dummy.matrix);
    }
    instanced.current.instanceMatrix.needsUpdate = true;
  }, [positions, scales, count]);

  useFrame((_, dt) => {
    if (belt.current) belt.current.rotation.y += dt * 0.02;
  });

  return (
    <group ref={belt}>
      <instancedMesh ref={instanced} args={[undefined as never, undefined as never, count]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color={palette.asteroid} roughness={1} metalness={0.05} />
      </instancedMesh>
    </group>
  );
}

/* ── Planets on their orbits ───────────────────────────── */
export interface PlanetDef {
  id: string;
  orbit: number;
  radius: number;
  speed: number;
  axial: number;
  tiltX: number;
  tiltZ: number;
  roughness: number;
  metalness: number;
}

const PLANETS: PlanetDef[] = [
  { id: "mercury", orbit: 3.0, radius: 0.2, speed: 1.5, axial: 0.01, tiltX: 0.02, tiltZ: 0.05, roughness: 0.95, metalness: 0.05 },
  { id: "venus", orbit: 3.9, radius: 0.34, speed: 1.1, axial: 2.6, tiltX: -0.03, tiltZ: -0.04, roughness: 0.9, metalness: 0 },
  { id: "earth", orbit: 5.1, radius: EARTH_RADIUS, speed: 0.75, axial: 0.41, tiltX: 0.02, tiltZ: 0.03, roughness: 0.7, metalness: 0.02 },
  { id: "mars", orbit: 6.2, radius: 0.27, speed: 0.6, axial: 0.44, tiltX: 0.05, tiltZ: -0.05, roughness: 0.95, metalness: 0.05 },
  { id: "jupiter", orbit: 8.0, radius: 0.6, speed: 0.34, axial: 0.05, tiltX: -0.04, tiltZ: 0.07, roughness: 0.85, metalness: 0 },
  { id: "saturn", orbit: 9.8, radius: 0.48, speed: 0.24, axial: 0.47, tiltX: 0.07, tiltZ: -0.09, roughness: 0.85, metalness: 0 },
];

function Planet({ def, phase }: { def: PlanetDef; phase: string }) {
  const palette = useScenePalette();
  const orbit = useRef<THREE.Group>(null);
  const spinMesh = useRef<THREE.Mesh>(null);
  const colorful = palette === SCENE_COLORFUL;
  const tex = useMemo(() => (def.id === "earth" ? null : makePlanetTexture(def.id, colorful)), [def.id, colorful]);

  useEffect(() => {
    return () => {
      if (tex) tex.dispose();
    };
  }, [tex]);

  useFrame((_, dt) => {
    const mult = phase === "boot" ? 0.22 : 1;
    if (orbit.current) orbit.current.rotation.y += dt * def.speed * mult;
    if (spinMesh.current) spinMesh.current.rotation.y += dt * 0.35 * mult;
  });

  return (
    <group ref={orbit} rotation={[def.tiltX, 0, def.tiltZ]}>
      <OrbitRing radius={def.orbit} />
      <group position={[def.orbit, 0, 0]}>
        {def.id === "earth" ? (
          <group rotation={[0, 0, def.axial]}>
            <Earth phase={phase} />
          </group>
        ) : (
          <group rotation={[0, 0, def.axial]}>
            <mesh ref={spinMesh}>
              <sphereGeometry args={[def.radius, 42, 42]} />
              <meshStandardMaterial
                map={tex}
                roughness={def.roughness}
                metalness={def.metalness}
              />
            </mesh>
            {def.id === "saturn" && <SaturnRings planetRadius={def.radius} />}
          </group>
        )}
      </group>
    </group>
  );
}

/* ── Constellation field around the system ─────────────── */
function Constellation() {
  const palette = useScenePalette();
  const group = useRef<THREE.Group>(null);

  const { geom } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const shell = 14;
    for (let i = 0; i < 26; i++) {
      const v = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
      )
        .normalize()
        .multiplyScalar(shell + Math.random() * 2.5);
      pts.push(v);
    }
    const positions: number[] = [];
    const indices: number[] = [];
    pts.forEach((p) => positions.push(p.x, p.y, p.z));
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < 5.6 && Math.random() > 0.45) indices.push(i, j);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    if (indices.length) g.setIndex(indices);
    return { geom: g };
  }, []);

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.008;
    group.current.rotation.x += dt * 0.002;
  });

  return (
    <group ref={group}>
      <points geometry={geom}>
        <pointsMaterial size={0.11} color={palette.starPoints} transparent opacity={0.8} sizeAttenuation depthWrite={false} />
      </points>
      <lineSegments geometry={geom}>
        <lineBasicMaterial color={palette.constellation} transparent opacity={0.26} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

/* ── Solar system root (reacts to the cursor) ──────────── */
export function SolarSystem({ phase }: { phase: string }) {
  const root = useRef<THREE.Group>(null);
  const autoY = useRef(0);
  const ux = useRef(0);
  const uy = useRef(0);
  const ur = useRef(0);

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.001, dt);
    const mult = phase === "boot" ? 0.15 : 1;
    autoY.current += dt * 0.012 * mult;

    // Cursor hover → the whole system tilts and revolves with the pointer.
    ux.current += (pointerState.x * 0.9 - ux.current) * k;
    uy.current += (pointerState.y * 0.55 - uy.current) * k;
    ur.current += (pointerState.x * 0.22 - ur.current) * k;

    if (root.current) {
      root.current.rotation.set(
        -0.14 + uy.current,
        autoY.current + ux.current,
        0.05 + ur.current,
      );
    }
  });

  return (
    <group ref={root} rotation={[-0.14, 0, 0.05]}>
      <Sun />
      {PLANETS.map((def) => (
        <Planet key={def.id} def={def} phase={phase} />
      ))}
      <AsteroidBelt />
    </group>
  );
}