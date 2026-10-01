"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneStore } from "./store";
import { palette } from "./palette";
import { live } from "./live";
import { loadFonts, type Fonts } from "./canvasText";
import { STREET_LABELS, type StreetLabel } from "./world";

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uColor;
  uniform float uAlpha;
  uniform float uFar;
  varying vec2 vUv;
  varying float vDist;
  void main() {
    float a = texture2D(uMap, vUv).a * uAlpha * (1.0 - smoothstep(uFar * 0.5, uFar * 0.9, vDist));
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vDist;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

/** One street name, painted flat on the road like a map label. */
function Name({ label, fonts }: { label: StreetLabel; fonts: Fonts }) {
  const ref = useRef<THREE.Mesh>(null);
  const { texture, aspect } = useMemo(() => {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d")!;
    const size = 56;
    ctx.font = `700 ${size}px ${fonts.heading}`;
    const w = Math.ceil(ctx.measureText(label.text).width) + 24;
    c.width = w;
    c.height = 72;
    ctx.font = `700 ${size}px ${fonts.heading}`;
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "middle";
    ctx.fillText(label.text, 12, 38);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 8;
    return { texture: t, aspect: w / 72 };
  }, [label.text, fonts]);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: { uMap: { value: texture }, uColor: { value: new THREE.Color() }, uAlpha: { value: 0.3 }, uFar: { value: 280 } },
      }),
    [texture],
  );
  useFrame(() => {
    const p = palette(sceneStore.isDark);
    material.uniforms.uColor.value.set(p.streetName);
    material.uniforms.uAlpha.value = (p.ink ? 0.6 : 0.5) * (1 - live.overview * 0.7);
    material.uniforms.uFar.value = live.fogFar;
  });
  const h = 1.6;
  return (
    <mesh ref={ref} position={label.position} rotation={[-Math.PI / 2, 0, label.rotationY]} material={material} renderOrder={1}>
      <planeGeometry args={[h * aspect, h]} />
    </mesh>
  );
}

export function StreetNames() {
  const [fonts, setFonts] = useState<Fonts | null>(null);
  useEffect(() => {
    let alive = true;
    loadFonts().then((f) => alive && setFonts(f));
    return () => {
      alive = false;
    };
  }, []);
  if (!fonts) return null;
  return (
    <>
      {STREET_LABELS.map((l, i) => (
        <Name key={`${l.text}-${i}`} label={l} fonts={fonts} />
      ))}
    </>
  );
}
