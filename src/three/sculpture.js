import { BufferAttribute, BufferGeometry, Color, TorusKnotGeometry, Vector3 } from 'three';

const random = (n) => {
  const value = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return value - Math.floor(value);
};

// Separate strips open real gaps; shared source normals keep the assembled metal seamless.
export function createSculpture(mobile = false) {
  const count = mobile ? 16 : 24;
  const source = new TorusKnotGeometry(1.36, 0.405, count * 8, mobile ? 16 : 24, 2, 3);
  const flat = source.toNonIndexed();
  const positions = flat.getAttribute('position').array;
  const normals = flat.getAttribute('normal').array;
  const stride = positions.length / count;
  const palette = ['#bdc2c7', '#84878a', '#9fa3a7', '#adb1b5', '#dde3e9'].map(
    (hex) => new Color(hex),
  );
  const pieces = Array.from({ length: count }, (_, i) => {
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      'position',
      new BufferAttribute(positions.slice(i * stride, (i + 1) * stride), 3),
    );
    geometry.setAttribute(
      'normal',
      new BufferAttribute(normals.slice(i * stride, (i + 1) * stride), 3),
    );
    // Color depends on source position, so neighboring strips meet without color seams.
    const vertexColors = new Float32Array(stride);
    const tint = new Color();
    for (let vertex = 0; vertex < stride; vertex += 3) {
      const sourceIndex = i * stride + vertex;
      const blend = Math.max(
        0,
        Math.min(
          3.999,
          ((positions[sourceIndex] + positions[sourceIndex + 1] * 0.45 + 2.7) / 5.4) * 4,
        ),
      );
      const stop = Math.floor(blend);
      tint.copy(palette[stop]).lerp(palette[stop + 1], blend - stop);
      tint.toArray(vertexColors, vertex);
    }
    geometry.setAttribute('color', new BufferAttribute(vertexColors, 3));
    geometry.computeBoundingBox();
    const center = geometry.boundingBox.getCenter(new Vector3());
    geometry.translate(-center.x, -center.y, -center.z);
    const direction = center
      .clone()
      .normalize()
      .multiplyScalar(1.1 + random(i) * 1.2);
    return {
      geometry,
      center,
      direction,
      spin: new Vector3(
        random(i + 20) - 0.5,
        random(i + 50) - 0.5,
        random(i + 90) - 0.5,
      ).multiplyScalar(2.5),
    };
  });
  const particleCount = mobile ? 1000 : 2400;
  const particlePositions = new Float32Array(particleCount * 3);
  const targets = new Float32Array(particleCount * 3);
  const seeds = new Float32Array(particleCount);
  const surface = source.getAttribute('position');
  for (let i = 0; i < particleCount; i++) {
    const index = Math.floor(random(i + 1) * surface.count);
    for (let axis = 0; axis < 3; axis++)
      particlePositions[i * 3 + axis] = surface.array[index * 3 + axis];
    const radius = 0.15 + Math.pow(random(i + 150), 0.55) * 3.15;
    const angle = ((i % 3) * Math.PI * 2) / 3 + radius * 1.8 + (random(i + 240) - 0.5) * 0.7;
    targets[i * 3] = Math.cos(angle) * radius;
    targets[i * 3 + 1] = (random(i + 430) - 0.5) * 0.7 + Math.sin(angle * 2) * 0.12;
    targets[i * 3 + 2] = Math.sin(angle) * radius;
    seeds[i] = random(i + 450);
  }
  const particles = new BufferGeometry();
  particles.setAttribute('position', new BufferAttribute(particlePositions, 3));
  particles.setAttribute('aTarget', new BufferAttribute(targets, 3));
  particles.setAttribute('aSeed', new BufferAttribute(seeds, 1));
  const stars = new BufferGeometry();
  const starPositions = new Float32Array((mobile ? 90 : 260) * 3);
  for (let i = 0; i < starPositions.length / 3; i++) {
    starPositions[i * 3] = (random(i + 2000) - 0.5) * 20;
    starPositions[i * 3 + 1] = (random(i + 2500) - 0.5) * 15;
    starPositions[i * 3 + 2] = -3 - random(i + 3000) * 8;
  }
  stars.setAttribute('position', new BufferAttribute(starPositions, 3));
  source.dispose();
  flat.dispose();
  return { pieces, particles, stars };
}

export const particleVertex = /* glsl */ `
  attribute vec3 aTarget;
  attribute float aSeed;
  uniform float uTime;
  uniform float uMorph;
  uniform float uScatter;
  uniform float uDpr;
  varying float vSeed;
  void main() {
    vSeed = aSeed;
    vec3 target = aTarget;
    float angle = uTime * 0.075 * (0.4 + aSeed) + uScatter * 0.5;
    target.xz = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * target.xz;
    vec3 p = mix(position * (1.008 + uScatter * 0.4), target, uMorph);
    p += normalize(position) * sin(uTime * 1.1 + aSeed * 12.0) * (0.02 + uMorph * 0.09);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp((1.3 + aSeed * 3.2) * uDpr * 7.0 / -mv.z, 1.0, 8.0);
  }
`;
export const particleFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTime;
  varying float vSeed;
  void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    float alpha = pow(1.0 - smoothstep(0.03, 0.5, distanceToCenter), 1.7);
    if (alpha < 0.01) discard;
    float twinkle = 0.75 + sin(uTime * 1.7 + vSeed * 30.0) * 0.25;
    vec3 color = vSeed < 0.5
      ? mix(vec3(0.65, 0.74, 0.83), uColor, vSeed * 2.0)
      : mix(vec3(0.7, 0.73, 0.78), vec3(0.95, 0.96, 1.0), (vSeed - 0.5) * 2.0);
    color = mix(color, uColor, 0.7);
    color = mix(color, vec3(1.0), pow(vSeed, 8.0) * 0.65);
    gl_FragColor = vec4(color * 1.8, alpha * uOpacity * twinkle);
  }
`;
