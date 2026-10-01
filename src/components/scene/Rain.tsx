"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneStore } from "./store";
import { palette } from "./palette";
import { seededRandom } from "./world";
import { live } from "./live";

const vertexShader = /* glsl */ `
  attribute vec3 aSeed;
  attribute float aEnd;
  uniform float uTime;
  uniform vec3 uCam;
  varying float vDist;
  void main() {
    // Rain falls over the part of the map you're looking at (uCam = route head).
    float x = uCam.x + (aSeed.x - 0.5) * 150.0 + aEnd * 0.2;
    float z = uCam.z + 40.0 - aSeed.z * 170.0;
    float y = mod(aSeed.y * 70.0 - uTime * 42.0, 70.0) - aEnd * 2.4;
    vec4 mv = viewMatrix * vec4(x, y, z, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vDist;
  void main() {
    gl_FragColor = vec4(uColor, uAlpha * (1.0 - smoothstep(60.0, 200.0, vDist)));
  }
`;

export function Rain({ lite }: { lite: boolean }) {
  const ref = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(() => {
    const random = seededRandom(13);
    const count = lite ? 500 : 1300;
    const pos = new Float32Array(count * 6);
    const seed = new Float32Array(count * 6);
    const end = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const s = [random(), random(), random()];
      seed.set([...s, ...s], i * 6);
      end.set([0, 1], i * 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));
    g.setAttribute("aEnd", new THREE.BufferAttribute(end, 1));
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
          uCam: { value: new THREE.Vector3() },
          uColor: { value: new THREE.Color() },
          uAlpha: { value: 0.2 },
        },
      }),
    [],
  );

  useFrame(({ clock }) => {
    const p = palette(sceneStore.isDark);
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uCam.value.copy(live.head);
    material.uniforms.uColor.value.set(p.rain);
    material.uniforms.uAlpha.value = p.rainAlpha;
    if (ref.current) ref.current.visible = !sceneStore.reducedMotion;
  });

  return <lineSegments ref={ref} geometry={geometry} material={material} frustumCulled={false} />;
}
