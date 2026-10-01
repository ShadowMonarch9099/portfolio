"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneStore } from "./store";
import { palette } from "./palette";
import { live } from "./live";
import { AVENUE_EVERY, BLOCK, MAP, SIDEWALK, buildLots } from "./world";

/** Fog helpers shared by the map shaders. */
const FOG = /* glsl */ `
  uniform vec3 uFog;
  uniform float uNear;
  uniform float uFar;
  float fogAmount(float d) { return smoothstep(uNear, uFar, d); }
`;

const HASH = /* glsl */ `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
`;

/* ------------------------------------------------------------------ */
/* Ground: roads, sidewalks, lane markings, crosswalks                */
/* ------------------------------------------------------------------ */

const groundVertex = /* glsl */ `
  varying vec2 vXZ;
  varying float vDist;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vXZ = wp.xz;
    vec4 mv = viewMatrix * wp;
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const groundFragment = /* glsl */ `
  uniform float uBlock;
  uniform float uEvery;
  uniform float uSidewalk;
  uniform vec3 uLot;
  uniform vec3 uWalk;
  uniform vec3 uRoad;
  uniform vec3 uCurb;
  uniform vec3 uLane;
  uniform vec3 uScanColor;
  uniform vec3 uScan;
  uniform float uMark;
  ${FOG}
  varying vec2 vXZ;
  varying float vDist;

  // Distance to the nearest street centre-line along one axis, plus that street's half-width.
  vec2 street(float v) {
    float i = floor(v / uBlock + 0.5);
    float halfW = mod(i, uEvery) < 0.5 ? 2.3 : 1.3;
    return vec2(abs(v - i * uBlock), halfW);
  }

  void main() {
    vec2 sx = street(vXZ.x);   // north-south street (runs along z)
    vec2 sz = street(vXZ.y);   // east-west street (runs along x)
    float onX = step(sx.x, sx.y);
    float onZ = step(sz.x, sz.y);
    float road = max(onX, onZ);
    float cross = onX * onZ;
    float walkX = step(sx.x, sx.y + uSidewalk) * (1.0 - onX);
    float walkZ = step(sz.x, sz.y + uSidewalk) * (1.0 - onZ);
    float walk = max(walkX, walkZ) * (1.0 - road);

    vec3 col = mix(uLot, uWalk, walk);
    col = mix(col, uRoad, road);

    float aa = fwidth(vXZ.x) + fwidth(vXZ.y);
    // Curb lines along road edges (not across intersections).
    float curbX = (1.0 - smoothstep(0.0, aa * 1.2, abs(sx.x - sx.y))) * (1.0 - onZ);
    float curbZ = (1.0 - smoothstep(0.0, aa * 1.2, abs(sz.x - sz.y))) * (1.0 - onX);
    float curb = max(curbX, curbZ);

    // Centre markings: dashed on streets, a double line on avenues; none inside intersections.
    float dashX = step(0.5, fract(vXZ.y / 3.0));
    float dashZ = step(0.5, fract(vXZ.x / 3.0));
    float avX = step(2.0, sx.y);
    float avZ = step(2.0, sz.y);
    float lineX = onX * (1.0 - onZ) * mix(
      (1.0 - smoothstep(0.0, aa, sx.x - 0.05)) * dashX,
      (1.0 - smoothstep(0.0, aa, abs(sx.x - 0.22) - 0.05)),
      avX);
    float lineZ = onZ * (1.0 - onX) * mix(
      (1.0 - smoothstep(0.0, aa, sz.x - 0.05)) * dashZ,
      (1.0 - smoothstep(0.0, aa, abs(sz.x - 0.22) - 0.05)),
      avZ);
    float lane = max(lineX, lineZ);

    // Zebra crossings just outside each intersection.
    float zx = onX * (1.0 - onZ) * step(sz.y + 0.25, sz.x) * step(sz.x, sz.y + 1.1) * step(0.5, fract(vXZ.x * 1.6));
    float zz = onZ * (1.0 - onX) * step(sx.y + 0.25, sx.x) * step(sx.x, sx.y + 1.1) * step(0.5, fract(vXZ.y * 1.6));
    float zebra = max(zx, zz);

    col = mix(col, uCurb, curb * uMark);
    col = mix(col, uLane, lane * uMark * 0.8);
    col = mix(col, uCurb, zebra * uMark * 0.35);

    // The cursor scanner also lights the ground it passes over.
    float scan = uScan.z * (1.0 - smoothstep(4.0, 9.5, distance(vXZ, uScan.xy)));
    col = mix(col, uScanColor, scan * 0.12 + scan * curb * 0.5);

    gl_FragColor = vec4(mix(col, uFog, fogAmount(vDist)), 1.0);
  }
`;

/* ------------------------------------------------------------------ */
/* Buildings                                                          */
/* ------------------------------------------------------------------ */

/* Fills: dark holographic faces with floor lines, a window grid and a few lit windows. */
const fillVertex = /* glsl */ `
  varying float vDist;
  varying vec3 vN;
  varying vec3 vWorld;
  varying float vSeed;
  void main() {
    vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vN = normalize(mat3(instanceMatrix) * normal);
    vWorld = wp.xyz;
    vec3 t = vec3(instanceMatrix[3]);
    vSeed = fract(sin(dot(t.xz, vec2(12.9898, 78.233))) * 43758.5453);
    vec4 mv = viewMatrix * wp;
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const fillFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uTint;
  uniform vec3 uLit;
  uniform float uTintAmt;
  uniform float uLitAmt;
  uniform float uTime;
  ${FOG}
  ${HASH}
  varying float vDist;
  varying vec3 vN;
  varying vec3 vWorld;
  varying float vSeed;
  void main() {
    float roof = step(0.5, vN.y);
    vec2 f = abs(vN.x) > 0.5 ? vec2(vWorld.z, vWorld.y) : vec2(vWorld.x, vWorld.y);
    vec2 cellSize = vec2(1.5, 1.35);
    vec2 g = f / cellSize;
    vec2 cell = floor(g);
    vec2 r = fract(g);
    float side = 1.0 - roof;
    float floors = step(0.9, r.y) * side * step(0.4, vWorld.y);           // floor slabs
    float mullion = step(0.92, r.x) * side;                              // vertical mullions
    float pane = step(0.18, r.x) * step(r.x, 0.82) * step(0.28, r.y) * step(r.y, 0.78) * side;
    float h = hash(cell + vSeed * 91.0);
    float lit = pane * step(0.95 - vSeed * 0.03, h) * step(0.8, vWorld.y);
    float flicker = h > 0.995 ? step(0.5, fract(sin(floor(uTime * 5.0) + h * 70.0) * 43.0)) : 1.0;
    float scanline = step(0.88, fract(vWorld.y * 0.9 - uTime * 0.3)) * side;

    vec3 col = mix(uColor, uTint, uTintAmt * (0.45 + roof * 1.2 + floors * 1.6 + mullion * 0.9 + scanline * 0.8));
    vec3 litCol = mix(uTint, uLit, step(0.55, hash(cell * 1.3 + 4.0)));
    col = mix(col, litCol, lit * flicker * uLitAmt);
    gl_FragColor = vec4(mix(col, uFog, fogAmount(vDist)), 1.0);
  }
`;

/* Wireframe edges: brighter at the top, lit by the cursor scanner and the radar sweep. */
const edgeVertex = /* glsl */ `
  attribute float aTop;
  varying float vTop;
  varying vec3 vWorld;
  varying float vDist;
  void main() {
    vTop = aTop;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    vec4 mv = viewMatrix * wp;
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const edgeFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uScanColor;
  uniform float uAlpha;
  uniform vec3 uScan;   // x, z, strength
  uniform vec3 uSweep;  // centre x, centre z, angle
  ${FOG}
  varying float vTop;
  varying vec3 vWorld;
  varying float vDist;
  void main() {
    float scan = uScan.z * (1.0 - smoothstep(5.0, 11.0, distance(vWorld.xz, uScan.xy)));
    vec2 rel = vWorld.xz - uSweep.xy;
    float diff = mod(uSweep.z - atan(rel.y, rel.x) + 6.2831853, 6.2831853);
    float sweep = exp(-diff * 3.5) * (1.0 - smoothstep(25.0, 55.0, length(rel)));
    float a = uAlpha * (0.4 + 0.6 * vTop) + scan * 0.75 + sweep * 0.3;
    vec3 col = mix(uColor, uScanColor, scan);
    gl_FragColor = vec4(col, a * (1.0 - fogAmount(vDist)));
  }
`;

const fogUniforms = () => ({
  uFog: { value: new THREE.Color() },
  uNear: { value: 90 },
  uFar: { value: 280 },
});

function syncFog(u: Record<string, THREE.IUniform>, fog: string) {
  u.uFog.value.set(fog);
  u.uNear.value = live.fogNear;
  u.uFar.value = live.fogFar;
}

export function CityMap({ lite }: { lite: boolean }) {
  const lots = useMemo(() => buildLots(lite), [lite]);
  const fill = useRef<THREE.InstancedMesh>(null);
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  const groundMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: groundVertex,
        fragmentShader: groundFragment,
        uniforms: {
          uBlock: { value: BLOCK },
          uEvery: { value: AVENUE_EVERY },
          uSidewalk: { value: SIDEWALK },
          uLot: { value: new THREE.Color() },
          uWalk: { value: new THREE.Color() },
          uRoad: { value: new THREE.Color() },
          uCurb: { value: new THREE.Color() },
          uLane: { value: new THREE.Color() },
          uScanColor: { value: new THREE.Color() },
          uScan: { value: new THREE.Vector3() },
          uMark: { value: 1 },
          ...fogUniforms(),
        },
      }),
    [],
  );

  const fillMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fillVertex,
        fragmentShader: fillFragment,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
        uniforms: {
          uColor: { value: new THREE.Color() },
          uTint: { value: new THREE.Color() },
          uLit: { value: new THREE.Color() },
          uTintAmt: { value: 0.08 },
          uLitAmt: { value: 0.8 },
          uTime: { value: 0 },
          ...fogUniforms(),
        },
      }),
    [],
  );

  // All building edges in one line geometry (12 edges per box).
  const edges = useMemo(() => {
    const pos: number[] = [];
    const top: number[] = [];
    for (const { position: [x, y, z], scale: [w, h, d] } of lots) {
      const x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2;
      const y0 = y - h / 2, y1 = y + h / 2;
      const c = [
        [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1],
        [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1],
      ];
      const pairs = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
      for (const [a, b] of pairs) {
        pos.push(...c[a], ...c[b]);
        top.push(a >= 4 ? 1 : 0, b >= 4 ? 1 : 0);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("aTop", new THREE.Float32BufferAttribute(top, 1));
    return g;
  }, [lots]);

  const edgeMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: edgeVertex,
        fragmentShader: edgeFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new THREE.Color() },
          uScanColor: { value: new THREE.Color() },
          uAlpha: { value: 0.26 },
          uScan: { value: new THREE.Vector3() },
          uSweep: { value: new THREE.Vector3() },
          ...fogUniforms(),
        },
      }),
    [],
  );

  const ground = useMemo(() => {
    const w = (MAP.maxX - MAP.minX + 8) * BLOCK;
    const d = (MAP.maxZ - MAP.minZ + 8) * BLOCK;
    const cx = ((MAP.maxX + MAP.minX) / 2) * BLOCK;
    const cz = ((MAP.maxZ + MAP.minZ) / 2) * BLOCK;
    return { w, d, cx, cz };
  }, []);

  useLayoutEffect(() => {
    const m = fill.current;
    if (!m) return;
    const o = new THREE.Object3D();
    lots.forEach((l, i) => {
      o.position.set(...l.position);
      o.scale.set(...l.scale);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }, [lots]);

  useFrame(({ clock }) => {
    const p = palette(sceneStore.isDark);
    const t = sceneStore.reducedMotion ? 0 : clock.elapsedTime;

    const g = groundMat.uniforms;
    g.uLot.value.set(p.lot);
    g.uWalk.value.set(p.walk);
    g.uRoad.value.set(p.road);
    g.uCurb.value.set(p.curb);
    g.uLane.value.set(p.lane);
    g.uScanColor.value.set(p.scan);
    g.uScan.value.copy(live.scan);
    syncFog(g, p.fog);

    const f = fillMat.uniforms;
    f.uColor.value.set(p.fill);
    f.uTint.value.set(p.edge);
    f.uLit.value.set(p.head);
    f.uTintAmt.value = p.ink ? 0.05 : 0.09;
    f.uLitAmt.value = p.ink ? 0.25 : 0.75;
    f.uTime.value = t;
    syncFog(f, p.fog);

    const e = edgeMat.uniforms;
    e.uColor.value.set(p.edge);
    e.uScanColor.value.set(p.scan);
    e.uAlpha.value = p.edgeAlpha;
    e.uScan.value.copy(live.scan);
    e.uSweep.value.set(live.head.x, live.head.z, (t * 0.9) % (Math.PI * 2));
    syncFog(e, p.fog);
  });

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ground.cx, -0.02, ground.cz]} material={groundMat}>
        <planeGeometry args={[ground.w, ground.d]} />
      </mesh>
      <instancedMesh ref={fill} args={[box, fillMat, lots.length]} frustumCulled={false} />
      <lineSegments geometry={edges} material={edgeMat} frustumCulled={false} />
    </>
  );
}
