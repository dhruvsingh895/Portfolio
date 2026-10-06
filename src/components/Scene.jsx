import { memo, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  MathUtils,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
} from 'three';
import { createSculpture, particleFragment, particleVertex } from '../three/sculpture';

const Sculpture = memo(function Sculpture({ accent, mobile, mode, controls, exploded, sequence }) {
  const group = useRef(),
    fragments = useRef([]),
    ringGroup = useRef(),
    cloud = useRef(),
    core = useRef();
  const birth = useRef(null);
  const motion = useRef({ scatter: 0, morph: 0, yaw: 0, pitch: 0, wire: 0 });
  const geometry = useMemo(() => createSculpture(mobile), [mobile]);
  const orange = accent === 'orange';
  const color = orange ? '#ff9a50' : '#a1a5a9';
  const materials = useMemo(
    () => ({
      physical: new MeshPhysicalMaterial({
        color: orange ? '#ffba83' : '#f9ffff',
        vertexColors: true,
        metalness: 0.94,
        roughness: 0.19,
        envMapIntensity: 1.7,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        iridescence: 0,
        iridescenceIOR: 1.35,
        transparent: true,
        side: DoubleSide,
        forceSinglePass: true,
      }),
      wire: new MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.7 }),
    }),
    [color, orange],
  );
  useEffect(
    () => () => {
      materials.physical.dispose();
      materials.wire.dispose();
    },
    [materials],
  );
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uScatter: { value: 0 },
      uDpr: { value: mobile ? 1 : 1.4 },
      uOpacity: { value: 0.5 },
      uColor: { value: new Color(color) },
    }),
    [mobile, color],
  );

  useEffect(
    () => () => {
      geometry.pieces.forEach((piece) => piece.geometry.dispose());
      geometry.particles.dispose();
      geometry.stars.dispose();
    },
    [geometry],
  );

  useFrame(({ clock, pointer, camera }, elapsed) => {
    const delta = Math.min(elapsed, 0.05),
      time = clock.elapsedTime;
    if (birth.current === null) birth.current = time;
    const input = controls?.current,
      step = sequence?.current ?? 0,
      inSequence = !!sequence;
    const enter = input?.enterStart
      ? Math.min((performance.now() - input.enterStart) / 1200, 1)
      : 0;
    const field = inSequence ? MathUtils.smoothstep(step, 0.55, 0.83) : mode === 'field' ? 1 : 0;
    const structure = inSequence
      ? 1 - MathUtils.smoothstep(step, 0.15, 0.38)
      : mode === 'wire'
        ? 1
        : 0;
    const hold =
      input?.down && !input?.dragged ? Math.min((performance.now() - input.start) / 1100, 1) : 0;
    const impulse = input?.pulse ? Math.max(0, 1 - (performance.now() - input.pulse) / 1800) : 0;
    const entrance = Math.pow(Math.max(0, 1 - (time - birth.current) / 1.9), 3);
    const scroll = inSequence ? 0 : Math.min(window.scrollY / window.innerHeight, 1);
    const sequenceScatter = Math.sin(MathUtils.clamp((step - 0.18) / 0.72, 0, 1) * Math.PI) * 0.9;
    const scatterTarget =
      entrance * 1.4 +
      enter * 1.4 +
      (inSequence ? sequenceScatter : Math.max(exploded ? 0.9 : 0, hold, impulse)) +
      scroll * 0.75;
    const state = motion.current;
    state.scatter = MathUtils.damp(state.scatter, scatterTarget, 4, delta);
    state.morph = MathUtils.damp(state.morph, field, 3, delta);
    state.wire = MathUtils.damp(state.wire, structure, 5, delta);
    state.yaw = MathUtils.damp(state.yaw, input?.yaw || 0, 4, delta);
    state.pitch = MathUtils.damp(state.pitch, input?.pitch || 0, 4, delta);
    group.current.rotation.set(
      0.35 + state.pitch + pointer.y * 0.12 + step * 0.5,
      time * 0.12 + state.yaw + pointer.x * 0.17 + step * 2,
      -0.35 + Math.sin(time * 0.2) * 0.08,
    );
    group.current.position.y = Math.sin(time * 0.75) * 0.08;
    group.current.scale.setScalar(mobile ? 0.88 : 0.91);
    for (let i = 0; i < geometry.pieces.length; i++) {
      const piece = geometry.pieces[i],
        mesh = fragments.current[i],
        amount = state.scatter + state.morph * 1.4;
      mesh.position.copy(piece.center).addScaledVector(piece.direction, amount);
      mesh.rotation.set(piece.spin.x * amount, piece.spin.y * amount, piece.spin.z * amount);
      mesh.scale.setScalar(1 - state.morph * 0.95);
      mesh.visible = state.morph < 0.98;
      mesh.material = state.wire > 0.5 ? materials.wire : materials.physical;
    }
    materials.physical.opacity = 1 - state.morph;
    materials.wire.opacity = (1 - state.morph) * 0.7;
    uniforms.uTime.value = time;
    uniforms.uMorph.value = state.morph;
    uniforms.uScatter.value = state.scatter;
    uniforms.uOpacity.value = MathUtils.lerp(0.22 + state.wire * 0.65, 1, state.morph);
    cloud.current.rotation.x = state.morph * 0.4;
    core.current.scale.setScalar(
      0.7 + state.scatter * 1.5 + state.morph * 0.65 + Math.sin(time * 2) * 0.08,
    );
    core.current.material.opacity = 0.25 + state.scatter * 0.5 + state.morph * 0.5;
    ringGroup.current.rotation.set(
      1.05 + Math.sin(time * 0.13) * 0.25,
      -0.2 + time * 0.025,
      -0.35 + time * 0.04,
    );
    ringGroup.current.scale.setScalar(1 + state.scatter * 0.17);
    camera.position.z = MathUtils.damp(
      camera.position.z,
      enter
        ? MathUtils.lerp(8.7, 1.8, enter)
        : (inSequence ? 9.3 : 8.7) + state.scatter * 1.9 + state.morph * 0.8,
      3,
      delta,
    );
  });
  return (
    <>
      <points geometry={geometry.stars}>
        <pointsMaterial
          size={0.018}
          color={color}
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <group ref={group}>
        {geometry.pieces.map((piece, index) => (
          <mesh
            key={index}
            ref={(el) => (fragments.current[index] = el)}
            geometry={piece.geometry}
            material={materials.physical}
            position={piece.center}
          />
        ))}
        <points ref={cloud} geometry={geometry.particles} frustumCulled={false}>
          <shaderMaterial
            uniforms={uniforms}
            vertexShader={particleVertex}
            fragmentShader={particleFragment}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </points>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.2, 1]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} toneMapped={false} />
        </mesh>
      </group>
      <group ref={ringGroup}>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[i * 0.58, i * 0.33, i * 0.72]}>
            <mesh>
              <torusGeometry args={[2.7 + i * 0.14, 0.007, 5, 140]} />
              <meshBasicMaterial
                color={
                  (orange ? ['#ff8c3c', '#ffb96e', '#e16b29'] : ['#cbd0d5', '#bec3c8', '#9fa3a7'])[
                    i
                  ]
                }
                transparent
                opacity={0.42 - i * 0.065}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[2.7 + i * 0.14, 0, 0]}>
              <octahedronGeometry args={[0.07 + i * 0.02, 0]} />
              <meshBasicMaterial
                color={
                  (orange ? ['#ff9c54', '#ffd19b', '#ffb170'] : ['#cbd0d5', '#d3d8dd', '#b6bbc0'])[
                    i
                  ]
                }
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}
      </group>
      <Environment key={accent} resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={5}
          color={orange ? '#ffe1bd' : '#ecf2f8'}
          scale={[9, 3, 1]}
          position={[-4, 5, 4]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          color={orange ? '#ffb073' : '#c8cdd2'}
          scale={[3, 10, 1]}
          position={[5, 0, 2]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={6}
          color={orange ? '#ff6c24' : '#aaaeb2'}
          scale={[6, 4, 1]}
          position={[2, -2, -4]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          color={color}
          scale={[2, 8, 1]}
          position={[-5, -2, 0]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="ring"
          intensity={2}
          color={orange ? '#ffd5a8' : '#cdd2d7'}
          scale={5}
          position={[0, 6, -2]}
          target={[0, 0, 0]}
        />
      </Environment>
      {!mobile && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom luminanceThreshold={1.2} intensity={0.45} mipmapBlur />
        </EffectComposer>
      )}
    </>
  );
});
function Ready({ onReady }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}
export default function Scene({
  accent,
  mobile,
  active = true,
  onReady,
  mode = 'solid',
  controls,
  exploded = false,
  sequence,
}) {
  return (
    <Canvas
      className="sculpture-canvas"
      frameloop={active ? 'always' : 'never'}
      dpr={mobile ? 1 : [1, 1.25]}
      camera={{ position: [0, 0, 8.7], fov: 40 }}
      gl={{ alpha: true, antialias: !mobile, powerPreference: 'low-power', stencil: false }}
      fallback={null}
    >
      <Sculpture
        accent={accent}
        mobile={mobile}
        mode={mode}
        controls={controls}
        exploded={exploded}
        sequence={sequence}
      />
      <Ready onReady={onReady} />
    </Canvas>
  );
}
