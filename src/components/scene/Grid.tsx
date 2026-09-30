"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneStore } from "./store";
import { BODIES, GRID } from "./world";
import { palette } from "./palette";

export const MAX_WELLS = 16;

const vertexShader = /* glsl */ `
  uniform vec4 uWells[${MAX_WELLS}]; // x, z, depth, width
  uniform int uCount;
  uniform float uNear;
  uniform float uFar;
  varying float vFog;
  varying float vPull;

  void main() {
    vec3 p = position;
    float y = 0.0;
    float pull = 0.0;
    for (int i = 0; i < ${MAX_WELLS}; i++) {
      if (i >= uCount) break;
      vec4 w = uWells[i];
      vec2 d = p.xz - w.xy;
      float r2 = dot(d, d) / (w.w * w.w);
      float f = w.z / (1.0 + r2);
      y -= f;
      pull += f;
    }
    p.y = y;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vFog = 1.0 - smoothstep(uNear, uFar, -mv.z);
    vPull = pull;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uAlpha;
  varying float vFog;
  varying float vPull;

  void main() {
    float heat = clamp(vPull * 0.09, 0.0, 1.0);
    vec3 col = mix(uColor, uAccent, heat * 0.85);
    float a = uAlpha * vFog * (0.6 + heat * 0.9);
    if (a < 0.004) discard;
    gl_FragColor = vec4(col, a);
  }
`;

/** Build a grid of line segments on the XZ plane, subdivided so lines can bend. */
function buildGeometry(spacing: number, step: number) {
  const { minX, maxX, minZ, maxZ } = GRID;
  const pts: number[] = [];
  for (let z = minZ; z <= maxZ; z += spacing) {
    for (let x = minX; x < maxX; x += step) pts.push(x, 0, z, Math.min(x + step, maxX), 0, z);
  }
  for (let x = minX; x <= maxX; x += spacing) {
    for (let z = minZ; z < maxZ; z += step) pts.push(x, 0, z, x, 0, Math.min(z + step, maxZ));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

export function Grid({ lite }: { lite: boolean }) {
  const { camera } = useThree();
  const geometry = useMemo(() => buildGeometry(lite ? 3 : 2, lite ? 1.5 : 1), [lite]);
  const pointerWell = useRef({ x: 0, z: 0, depth: 0 });
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);

  const material = useMemo(() => {
    const wells = Array.from({ length: MAX_WELLS }, () => new THREE.Vector4());
    BODIES.forEach((b, i) => wells[i].set(b.position[0], b.position[2], b.well.depth, b.well.width));
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uWells: { value: wells },
        uCount: { value: BODIES.length + 1 },
        uNear: { value: 30 },
        uFar: { value: 150 },
        uColor: { value: new THREE.Color() },
        uAccent: { value: new THREE.Color() },
        uAlpha: { value: 0.3 },
      },
    });
  }, []);

  useFrame((_, dt) => {
    const p = palette(sceneStore.isDark);
    material.uniforms.uColor.value.set(p.grid);
    material.uniforms.uAccent.value.set(p.accent);
    material.uniforms.uAlpha.value = p.gridAlpha;

    // The cursor is a small mass too: it bends the grid where it points.
    const well = pointerWell.current;
    const { pointer } = sceneStore;
    if (!sceneStore.reducedMotion && pointer.active) {
      ndc.set(pointer.x, pointer.y);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        const k = 1 - Math.exp(-dt * 6);
        well.x += (hit.x - well.x) * k;
        well.z += (hit.z - well.z) * k;
      }
      pointer.moved = Math.max(0, pointer.moved - dt * 0.9);
      const targetDepth = 1.2 + Math.min(pointer.moved, 1) * 3.2;
      well.depth += (targetDepth - well.depth) * (1 - Math.exp(-dt * 3));
    } else {
      well.depth += (0 - well.depth) * (1 - Math.exp(-dt * 3));
    }
    material.uniforms.uWells.value[BODIES.length].set(well.x, well.z, well.depth, 4.5);
  });

  return <lineSegments geometry={geometry} material={material} frustumCulled={false} />;
}
