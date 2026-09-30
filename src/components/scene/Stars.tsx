"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneStore } from "./store";
import { palette } from "./palette";
import { seededRandom } from "./world";

export function Stars({ lite }: { lite: boolean }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color() }, uAlpha: { value: 1 } },
        vertexShader: /* glsl */ `
          attribute float aScale;
          attribute float aPhase;
          uniform float uTime;
          varying float vTwinkle;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aScale * (220.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
            vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aPhase) + aPhase * 12.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uAlpha;
          varying float vTwinkle;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.1, d) * vTwinkle * uAlpha;
            gl_FragColor = vec4(uColor, a);
          }`,
      }),
    [],
  );

  const geometry = useMemo(() => {
    const count = lite ? 900 : 1800;
    const random = seededRandom(7);
    const pos = new Float32Array(count * 3);
    const scale = new Float32Array(count);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos.set([(random() - 0.5) * 460, 18 + random() * 170, 120 - random() * 760], i * 3);
      scale[i] = 0.6 + Math.pow(random(), 3) * 2.6;
      phase[i] = random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    return g;
  }, [lite]);

  useFrame(({ clock }) => {
    const p = palette(sceneStore.isDark);
    material.uniforms.uTime.value = sceneStore.reducedMotion ? 0 : clock.elapsedTime;
    material.uniforms.uColor.value.set(p.stars);
    material.uniforms.uAlpha.value = p.starAlpha;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
