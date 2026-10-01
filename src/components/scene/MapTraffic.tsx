"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneStore } from "./store";
import { palette } from "./palette";
import { BLOCK, MAP, seededRandom } from "./world";

const vertexShader = /* glsl */ `
  attribute vec4 aCar;   // axis (0 = along x, 1 = along z), street coordinate, offset, speed
  attribute float aTint;
  uniform float uTime;
  uniform vec4 uBounds;  // minX, maxX, minZ, maxZ
  varying float vTint;
  varying float vDist;
  void main() {
    vTint = aTint;
    float lenX = uBounds.y - uBounds.x;
    float lenZ = uBounds.w - uBounds.z;
    float s = aCar.z + uTime * aCar.w;
    vec3 p = aCar.x < 0.5
      ? vec3(uBounds.x + mod(s, lenX), 0.25, aCar.y)
      : vec3(aCar.y, 0.25, uBounds.z + mod(s, lenZ));
    vec4 mv = viewMatrix * vec4(p, 1.0);
    vDist = -mv.z;
    gl_PointSize = 2.6 * (90.0 / -mv.z) * 3.0;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform float uFar;
  varying float vTint;
  varying float vDist;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.15, d) * 0.85 * (1.0 - smoothstep(uFar * 0.7, uFar, vDist));
    gl_FragColor = vec4(mix(uA, uB, vTint), a);
  }
`;

/** Little dots driving along the streets, like traffic on a minimap. */
export function MapTraffic({ lite }: { lite: boolean }) {
  const geometry = useMemo(() => {
    const random = seededRandom(31);
    const count = lite ? 160 : 380;
    const car = new Float32Array(count * 4);
    const tint = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const alongX = random() < 0.5;
      const street = alongX
        ? (MAP.minZ + Math.floor(random() * (MAP.maxZ - MAP.minZ))) * BLOCK
        : (MAP.minX + Math.floor(random() * (MAP.maxX - MAP.minX))) * BLOCK;
      const lane = (random() < 0.5 ? -1 : 1) * 0.55;
      const dir = random() < 0.5 ? -1 : 1;
      car.set([alongX ? 0 : 1, street + lane, random() * 600, dir * (4 + random() * 7)], i * 4);
      tint[i] = random() < 0.7 ? 0 : 1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aCar", new THREE.BufferAttribute(car, 4));
    g.setAttribute("aTint", new THREE.BufferAttribute(tint, 1));
    return g;
  }, [lite]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uBounds: { value: new THREE.Vector4(MAP.minX * BLOCK, MAP.maxX * BLOCK, MAP.minZ * BLOCK, MAP.maxZ * BLOCK) },
          uA: { value: new THREE.Color() },
          uB: { value: new THREE.Color() },
          uFar: { value: 280 },
        },
      }),
    [],
  );

  useFrame(({ clock }) => {
    const p = palette(sceneStore.isDark);
    material.uniforms.uTime.value = sceneStore.reducedMotion ? 0 : clock.elapsedTime;
    material.uniforms.uA.value.set(p.traffic[0]);
    material.uniforms.uB.value.set(p.traffic[1]);
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
