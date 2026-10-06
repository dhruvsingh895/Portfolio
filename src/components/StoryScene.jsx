import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';

function Universe({ scene, accent, playing, reducedMotion }) {
  const world = useRef(),
    signal = useRef(),
    sculpture = useRef(),
    particles = useRef();
  const time = useRef(0);
  const name = useRef(),
    localTime = useRef(0);
  useEffect(() => {
    localTime.current = 0;
  }, [scene]);
  const namePoints = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 84px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('DHRUV SINGH', 350, 88);
    const pixels = ctx.getImageData(0, 0, 700, 120).data,
      positions = [];
    for (let y = 0; y < 120; y += 3)
      for (let x = 0; x < 700; x += 3)
        if (pixels[(y * 700 + x) * 4 + 3] > 128) positions.push((x - 350) / 60, (60 - y) / 60, 0);
    return new Float32Array(positions);
  }, []);
  const orange = accent === 'orange',
    glow = orange ? '#ff8c42' : '#adc7e6';
  const points = useMemo(() => {
    const values = new Float32Array(720 * 3);
    for (let i = 0; i < 720; i++) {
      values[i * 3] = Math.sin(i * 127.1) * 19;
      values[i * 3 + 1] = Math.cos(i * 311.7) * 11;
      values[i * 3 + 2] = Math.sin(i * 74.7) * 18;
    }
    return values;
  }, []);
  const nodes = useMemo(
    () =>
      Array.from(
        { length: 38 },
        (_, i) =>
          new THREE.Vector3(
            Math.sin(i * 7.13) * 8,
            Math.cos(i * 3.9) * 4.5,
            Math.sin(i * 2.17) * 4,
          ),
      ),
    [],
  );
  useFrame((state, delta) => {
    if (playing) {
      time.current += Math.min(delta, 0.05);
      localTime.current += Math.min(delta, 0.05);
    }
    const t = time.current;
    const target =
      scene === 'city'
        ? [9, 7, 13]
        : scene === 'vision'
          ? [0, 1, 13]
          : scene === 'workspace'
            ? [3, 2, 13]
            : [0, 1, scene === 'finale' ? 16 : 13];
    const factor = playing ? 1 - Math.exp(-delta * 1.8) : 1;
    state.camera.position.lerp(new THREE.Vector3(...target), factor);
    state.camera.lookAt(0, 0, 0);
    if (world.current) world.current.rotation.y = Math.sin(t * 0.12) * 0.12;
    if (particles.current) particles.current.rotation.y = t * 0.012;
    if (name.current) {
      const blend = reducedMotion ? 1 : THREE.MathUtils.smoothstep(localTime.current, 0, 6);
      const attribute = name.current.geometry.attributes.position;
      for (let i = 0; i < namePoints.length; i += 3) {
        attribute.array[i] = THREE.MathUtils.lerp(Math.sin(i * 17) * 14, namePoints[i], blend);
        attribute.array[i + 1] = THREE.MathUtils.lerp(
          Math.cos(i * 7) * 8,
          namePoints[i + 1],
          blend,
        );
        attribute.array[i + 2] = THREE.MathUtils.lerp(Math.sin(i * 3) * 8, 0, blend);
      }
      attribute.needsUpdate = true;
    }
    if (sculpture.current) {
      sculpture.current.rotation.y = t * 0.22;
      sculpture.current.rotation.z = Math.sin(t * 0.17) * 0.2;
    }
    if (signal.current) {
      signal.current.position.set(
        Math.sin(t * 0.65) * 6,
        0.7 + Math.cos(t * 0.8),
        Math.cos(t * 0.65) * 4,
      );
    }
  });
  return (
    <>
      <color attach="background" args={['#030508']} />
      <fog attach="fog" args={['#030508', 18, 48]} />
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[5, 8, 10]}
        intensity={3}
        color={orange ? '#ffb87b' : '#dceaff'}
      />
      <pointLight position={[-5, 2, 3]} color={glow} intensity={45} />
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.027} color={glow} transparent opacity={0.65} sizeAttenuation />
      </points>
      {scene === 'origin' && (
        <points ref={name} position={[0, 3.4, 1]}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[namePoints.slice(), 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.026} color={glow} />
        </points>
      )}
      <group ref={world} position={[1.7, 1, 0]}>
        {(scene === 'origin' || scene === 'choice') && (
          <group>
            {nodes.map((node, i) => (
              <group key={i}>
                <mesh position={node}>
                  <sphereGeometry args={[i % 7 === 0 ? 0.085 : 0.04, 8, 8]} />
                  <meshBasicMaterial color={glow} />
                </mesh>
                <Line
                  points={[node, nodes[(i + 7) % nodes.length]]}
                  color={glow}
                  transparent
                  opacity={0.16}
                  lineWidth={1}
                />
              </group>
            ))}
            {[0, 1, 2].map((i) => (
              <mesh key={i} rotation={[i * 0.7, i * 0.9, 0.4]}>
                <torusGeometry args={[2.4 + i * 0.5, 0.009, 6, 120]} />
                <meshBasicMaterial color={glow} />
              </mesh>
            ))}
            <mesh>
              <icosahedronGeometry args={[1.3, 1]} />
              <meshStandardMaterial
                color={glow}
                wireframe
                emissive={glow}
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        )}
        {scene === 'city' && (
          <group position={[0, -2, 0]}>
            <gridHelper args={[24, 24, glow, '#27303c']} />
            {Array.from({ length: 49 }, (_, i) => {
              const height = 0.5 + Math.abs(Math.sin(i * 17.3)) * 4;
              return (
                <group
                  key={i}
                  position={[((i % 7) - 3) * 1.65, height / 2, (Math.floor(i / 7) - 3) * 1.65]}
                >
                  <mesh>
                    <boxGeometry args={[0.8, height, 0.8]} />
                    <meshStandardMaterial
                      color={i % 5 === 0 ? glow : '#222b36'}
                      metalness={0.7}
                      roughness={0.3}
                    />
                  </mesh>
                  <mesh scale={[1.005, 1.005, 1.005]}>
                    <boxGeometry args={[0.8, height, 0.8]} />
                    <meshBasicMaterial color={glow} wireframe transparent opacity={0.25} />
                  </mesh>
                </group>
              );
            })}
          </group>
        )}
        {scene === 'vision' && (
          <group>
            {Array.from({ length: 15 }, (_, i) => (
              <mesh key={i} position={[0, 0, 6 - i * 3]} rotation={[0, 0, Math.PI / 4 + i * 0.03]}>
                <torusGeometry args={[4.2, 0.023, 6, 4]} />
                <meshBasicMaterial color={glow} transparent opacity={1 - i * 0.045} />
              </mesh>
            ))}
            {[-1, 0, 1].map((x, i) => (
              <Float key={i} speed={playing ? 2 : 0} floatIntensity={playing ? 1 : 0}>
                <group position={[x * 2.1, i % 2 ? 1 : -0.5, -i * 3]}>
                  <mesh>
                    <boxGeometry args={[1.1, 0.65, 1.7]} />
                    <meshStandardMaterial color="#364353" metalness={0.8} roughness={0.25} />
                  </mesh>
                  <mesh>
                    <boxGeometry args={[1.5, 1.2, 2]} />
                    <meshBasicMaterial color={glow} wireframe />
                  </mesh>
                </group>
              </Float>
            ))}
          </group>
        )}
        {scene === 'workspace' && (
          <group rotation={[0.05, -0.3, 0]}>
            {[-1, 0, 1].map((x, i) => (
              <Float key={i} speed={playing ? 1.4 : 0} floatIntensity={playing ? 0.5 : 0}>
                <group
                  position={[x * 3.2, i === 1 ? 0.6 : 0, -Math.abs(x)]}
                  rotation={[0, -x * 0.22, 0]}
                >
                  <mesh>
                    <boxGeometry args={[2.8, 3.8, 0.16]} />
                    <meshStandardMaterial color="#141c27" metalness={0.7} roughness={0.3} />
                  </mesh>
                  <mesh position={[0, 1.45, 0.1]}>
                    <boxGeometry args={[2.3, 0.06, 0.03]} />
                    <meshBasicMaterial color={glow} />
                  </mesh>
                  {Array.from({ length: 7 }, (_, j) => (
                    <mesh key={j} position={[-0.25 + (j % 2) * 0.2, 0.95 - j * 0.37, 0.11]}>
                      <boxGeometry args={[1.2 + Math.sin(j * 5) * 0.5, 0.055, 0.025]} />
                      <meshBasicMaterial color={j % 3 ? '#738499' : glow} />
                    </mesh>
                  ))}
                </group>
              </Float>
            ))}
            <gridHelper args={[22, 22, glow, '#1b2430']} position={[0, -3, 0]} />
          </group>
        )}
        {scene === 'finale' && (
          <group ref={sculpture}>
            <mesh>
              <torusKnotGeometry args={[2.1, 0.55, 180, 24]} />
              <meshStandardMaterial
                color={orange ? '#d8793b' : '#acb7c6'}
                metalness={0.85}
                roughness={0.24}
              />
            </mesh>
            <mesh scale={1.025}>
              <torusKnotGeometry args={[2.1, 0.55, 100, 12]} />
              <meshBasicMaterial color={glow} wireframe transparent opacity={0.1} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0.2, 0]}>
              <torusGeometry args={[3.7, 0.013, 8, 160]} />
              <meshBasicMaterial color={glow} />
            </mesh>
          </group>
        )}
        <mesh ref={signal}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
          <pointLight color={glow} intensity={5} distance={4} />
        </mesh>
      </group>
    </>
  );
}
export default function StoryScene(props) {
  return (
    <Canvas
      camera={{ position: [0, 1, 13], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'low-power' }}
    >
      <Universe {...props} />
    </Canvas>
  );
}
