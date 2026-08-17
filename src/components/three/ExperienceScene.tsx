"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import gsap from "gsap";
import { sceneBus } from "@/lib/sceneBus";
import { pointerState } from "@/lib/pointerBus";
import { indiaMarkerWorld } from "@/lib/sceneGlobals";
import { isTouchDevice } from "@/lib/utils";
import { SolarSystem } from "./SolarBodies";
import { useScenePalette } from "@/lib/sceneTheme";

const TOUCH = isTouchDevice();

/* ── Tunnel particles (boot flight) ───────────────────── */
function Tunnel({ active, progress }: { active: boolean; progress: number }) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const amount = TOUCH ? 900 : 1700;

  const positions = useMemo(() => {
    const arr = new Float32Array(amount * 3);
    for (let i = 0; i < amount; i++) {
      const t = Math.random();
      const radius = 2.4 + Math.pow(1 - t, 1.4) * 8 + Math.random() * 0.8;
      const angle = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = Math.sin(angle) * radius * 0.72;
      arr[i * 3 + 2] = 8 - t * 27;
    }
    return arr;
  }, [amount]);

  useFrame((_, dt) => {
    if (!group.current || !active) return;
    group.current.rotation.z += dt * 0.14;
    group.current.rotation.y += dt * 0.03;
    mat.current!.opacity = progress < 0.34 ? 1 : Math.max(0, 1 - (progress - 0.34) * 6);
  });

  return (
    <group ref={group} visible={active && progress < 0.6}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={mat}
          size={0.055}
          color="#ffffff"
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

/* ── Energy rings flying through the tunnel ───────────── */
function FlightRings({ active, progress }: { active: boolean; progress: number }) {
  const palette = useScenePalette();
  const group = useRef<THREE.Group>(null);

  const ringDefs = useMemo(
    () => [
      { radius: 3.2, z: 10 },
      { radius: 4.9, z: 6 },
      { radius: 6.7, z: -2 },
      { radius: 3.9, z: -9 },
    ],
    [],
  );

  useFrame((_, dt) => {
    if (!group.current || !active) return;
    const targetOpacity = progress < 0.3 ? 0.8 : Math.max(0, 0.8 - (progress - 0.3) * 4);
    group.current.children.forEach((child) => {
      child.position.z += dt * 9;
      if (child.position.z > 12) child.position.z = -12;
      child.rotation.z += dt * 0.3;
      (child as THREE.Mesh).scale.setScalar(0.5 + progress * 1.1);
    });
  });

  return (
    <group ref={group} visible={active && progress < 0.5}>
      {ringDefs.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} rotation={[Math.PI / 2, 0, i * 1.3]}>
          <ringGeometry args={[ring.radius - 0.035, ring.radius, 90]} />
          <meshBasicMaterial
            color={palette.flightRings[i % palette.flightRings.length]}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Camera director: path + phase transitions ────────── */
type Slot = { at: number; pos: THREE.Vector3; look: THREE.Vector3 };

function Director() {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0.4, 21));
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
  const reduced = useRef(false);

  const bootPath = useMemo<Slot[]>(() => {
    const p0 = new THREE.Vector3(0, 0.4, 21);
    const p1 = new THREE.Vector3(1.7, 1.2, 14);
    const p2 = new THREE.Vector3(4.7, 2.5, 7.4);
    const p3 = new THREE.Vector3(5.1, 3.1, -0.8);
    return [
      { at: 0.0, pos: p0, look: new THREE.Vector3(0, 0, 0) },
      { at: 0.22, pos: p1, look: new THREE.Vector3(0, 0, 0) },
      { at: 0.44, pos: p2, look: new THREE.Vector3(0, 0, 0) },
      { at: 0.62, pos: p3, look: new THREE.Vector3(0, 0.4, 0) },
    ];
  }, []);

  const findSlot = (p: number) => {
    if (p >= 0.8) {
      const wp = indiaMarkerWorld.value.clone();
      const at = wp.clone().multiplyScalar(1.5);
      const near = wp.clone().multiplyScalar(1.75);
      const t = Math.min(1, (p - 0.8) / 0.2);
      return { pos: near.clone().lerp(at, t), look: wp.clone() };
    }
    let from = bootPath[0];
    let to = bootPath[bootPath.length - 1];
    for (let i = 0; i < bootPath.length - 1; i++) {
      if (p >= bootPath[i].at && p <= bootPath[i + 1].at) {
        from = bootPath[i];
        to = bootPath[i + 1];
        break;
      }
    }
    const span = Math.max(0.0001, to.at - from.at);
    const t = Math.min(1, Math.max(0, (p - from.at) / span));
    return { pos: from.pos.clone().lerp(to.pos, t), look: from.look.clone().lerp(to.look, t) };
  };

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced.current) {
      targetPos.current.set(0, 1.0, 11);
      lookTarget.current.set(0, 0, 0);
      sceneBus.setPhase("idle");
      return;
    }

    const unsub = sceneBus.subscribe((state) => {
      if (state.progress > 0 && state.progress < 1) {
        const slot = findSlot(state.progress);
        targetPos.current.copy(slot.pos);
        lookTarget.current.copy(slot.look);
      }
      if (state.introDone) {
        gsap.to(targetPos.current, {
          x: 0,
          y: 1.05,
          z: 13.6,
          duration: 2.2,
          ease: "power3.inOut",
        });
        gsap.to(lookTarget.current, { x: 0, y: 0, z: 0, duration: 2.2, ease: "power3.inOut" });
      }
    });

    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.001, dt);
    camera.position.lerp(targetPos.current, k);
    const drift = new THREE.Vector3(pointerState.x * 0.7, pointerState.y * 0.45, 0);
    const look = lookTarget.current.clone().add(drift);
    camera.lookAt(look);
  });

  return null;
}

/* ── Root canvas ──────────────────────────────────────── */
export default function ExperienceScene() {
  const palette = useScenePalette();
  const [phase, setPhase] = useState("boot");
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const unsub = sceneBus.subscribe((s) => {
      setProgress(s.progress);
      setPhase(s.phase);
    });
    return () => {
      unsub();
    };
  }, []);

  // Global cursor tracking → hover drives the system revolution.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointerState.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerState.y = (e.clientY / window.innerHeight) * 2 - 1;
      pointerState.active = true;
    };
    const onLeave = () => {
      pointerState.x = 0;
      pointerState.y = 0;
      pointerState.active = false;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const tunnelActive = phase === "boot" && progress < 0.5;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        frameloop={reduced ? "demand" : "always"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.4, 21], fov: 55, near: 0.1, far: 400 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color("#000000"), 0)}
      >
        <ambientLight intensity={0.32} />
        <directionalLight position={[8, 6, 5]} intensity={1.2} />
        <pointLight position={[0, 0, 0]} intensity={2.4} distance={34} color={palette.lightWarm} />
        <pointLight position={[-6, 2, -4]} intensity={0.5} color={palette.lightViolet} />

        <Stars
          radius={130}
          depth={50}
          count={TOUCH ? 900 : 1600}
          factor={3.2}
          saturation={0}
          fade
          speed={0.3}
        />

        <Tunnel active={tunnelActive} progress={progress} />
        <FlightRings active={tunnelActive} progress={progress} />
        <SolarSystem phase={phase} />
        <Director />
      </Canvas>

      {/* vignette scrim so the hero text stays crisp over the bright core */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_72%_62%_at_50%_36%,rgba(2,3,10,0.18)_0%,rgba(2,3,10,0.55)_66%,rgba(1,2,6,0.94)_100%)]"
      />
    </div>
  );
}