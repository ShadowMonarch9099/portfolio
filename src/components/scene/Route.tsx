"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneStore } from "./store";
import { palette } from "./palette";
import { live } from "./live";
import { ROUTE } from "./world";

/** A flat ribbon along the route; each vertex knows its distance along it. */
function ribbon(width: number, y: number) {
  const pos: number[] = [];
  const dist: number[] = [];
  const side: number[] = [];
  const idx: number[] = [];
  const { points, cum } = ROUTE;
  for (let i = 1; i < points.length; i++) {
    const [ax, az] = points[i - 1];
    const [bx, bz] = points[i];
    const len = cum[i] - cum[i - 1] || 1;
    const dx = (bx - ax) / len;
    const dz = (bz - az) / len;
    const nx = -dz * (width / 2);
    const nz = dx * (width / 2);
    // Extend each leg by half a width so corners join cleanly.
    const ex = dx * (width / 2);
    const ez = dz * (width / 2);
    const base = pos.length / 3;
    const d0 = cum[i - 1] - width / 2;
    const d1 = cum[i] + width / 2;
    pos.push(ax - ex + nx, y, az - ez + nz, ax - ex - nx, y, az - ez - nz, bx + ex + nx, y, bz + ez + nz, bx + ex - nx, y, bz + ez - nz);
    dist.push(d0, d0, d1, d1);
    side.push(1, -1, 1, -1);
    idx.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aDist", new THREE.Float32BufferAttribute(dist, 1));
  g.setAttribute("aSide", new THREE.Float32BufferAttribute(side, 1));
  g.setIndex(idx);
  return g;
}

const vertexShader = /* glsl */ `
  attribute float aDist;
  attribute float aSide;
  varying float vDist;
  varying float vSide;
  varying float vView;
  void main() {
    vDist = aDist;
    vSide = aSide;
    vec4 mv = viewMatrix * modelMatrix * vec4(position, 1.0);
    vView = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uProgress;
  uniform float uBoost;
  uniform float uGlow;
  uniform vec3 uDone;
  uniform vec3 uHead;
  uniform vec3 uAhead;
  uniform float uFar;
  varying float vDist;
  varying float vSide;
  varying float vView;
  void main() {
    float edge = 1.0 - smoothstep(0.45, 1.0, abs(vSide));
    float done = step(vDist, uProgress);
    float behind = uProgress - vDist;
    // The last stretch before the head glows orange (longer when scrolling fast).
    float heat = done * exp(-behind / (10.0 + uBoost * 35.0));
    vec3 col = mix(uDone, uHead, heat);
    float a = done * (uGlow > 0.5 ? 0.16 + heat * 0.25 : 0.85);
    // The road ahead: a faint dashed line that fades into the distance.
    float ahead = (1.0 - done) * step(0.5, fract(vDist * 0.22)) * (1.0 - smoothstep(0.0, 160.0, vDist - uProgress));
    if (uGlow < 0.5) { a += ahead * 0.32; col = mix(col, uAhead, 1.0 - done); }
    a *= edge * (1.0 - smoothstep(uFar * 0.85, uFar * 1.3, vView));
    if (a < 0.003) discard;
    gl_FragColor = vec4(col, a);
  }
`;

const radarFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAngle;
  uniform float uAlpha;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    if (r > 1.0) discard;
    float ang = atan(p.y, p.x);
    float diff = mod(uAngle - ang + 6.2831853, 6.2831853);
    float sweep = exp(-diff * 6.0) * 0.5;
    float rings = (1.0 - smoothstep(0.0, 0.01, abs(fract(r * 3.0) - 0.5) - 0.49)) * 0.3;
    float rim = smoothstep(0.97, 1.0, r) * 0.4;
    gl_FragColor = vec4(uColor, (sweep + rings + rim) * uAlpha * (1.0 - smoothstep(0.85, 1.0, r) * 0.5));
  }
`;

let glowTexture: THREE.Texture | null = null;
function getGlowTexture() {
  if (glowTexture) return glowTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  glowTexture = new THREE.CanvasTexture(c);
  return glowTexture;
}

export function Route() {
  const core = useMemo(() => ribbon(0.9, 0.06), []);
  const glow = useMemo(() => ribbon(4, 0.04), []);
  const makeMat = (isGlow: boolean) =>
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uProgress: { value: 0 },
        uBoost: { value: 0 },
        uGlow: { value: isGlow ? 1 : 0 },
        uDone: { value: new THREE.Color() },
        uHead: { value: new THREE.Color() },
        uAhead: { value: new THREE.Color() },
        uFar: { value: 280 },
      },
    });
  const coreMat = useMemo(() => makeMat(false), []);
  const glowMat = useMemo(() => makeMat(true), []);

  const radarMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: radarFragment,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: { uColor: { value: new THREE.Color() }, uAngle: { value: 0 }, uAlpha: { value: 0.5 } },
      }),
    [],
  );
  const radar = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Sprite>(null);
  const headMat = useRef<THREE.SpriteMaterial>(null);
  const texture = useMemo(() => getGlowTexture(), []);

  useFrame(({ clock }) => {
    const p = palette(sceneStore.isDark);
    for (const m of [coreMat, glowMat]) {
      const u = m.uniforms;
      u.uProgress.value = live.headDist;
      u.uBoost.value = live.speed;
      u.uDone.value.set(p.done);
      u.uHead.value.set(p.head);
      u.uAhead.value.set(p.ahead);
      u.uFar.value = live.fogFar;
      const blending = p.additive && m === glowMat ? THREE.AdditiveBlending : THREE.NormalBlending;
      if (m.blending !== blending) {
        m.blending = blending;
        m.needsUpdate = true;
      }
    }
    const t = sceneStore.reducedMotion ? 0 : clock.elapsedTime;
    radarMat.uniforms.uColor.value.set(p.done);
    radarMat.uniforms.uAngle.value = (t * 0.9) % (Math.PI * 2);
    radarMat.uniforms.uAlpha.value = (p.ink ? 0.22 : 0.26) * (1 - live.overview);
    radar.current?.position.set(live.head.x, 0.03, live.head.z);
    if (head.current && headMat.current) {
      head.current.position.set(live.head.x, 1.2, live.head.z);
      const s = 7 + live.speed * 8 + Math.sin(t * 4) * 0.5;
      head.current.scale.set(s, s, 1);
      headMat.current.color.set(p.head);
      headMat.current.opacity = p.ink ? 0.8 : 1;
    }
  });

  return (
    <>
      <mesh ref={radar} rotation={[-Math.PI / 2, 0, 0]} material={radarMat} renderOrder={1}>
        <planeGeometry args={[84, 84]} />
      </mesh>
      <mesh geometry={glow} material={glowMat} renderOrder={2} frustumCulled={false} />
      <mesh geometry={core} material={coreMat} renderOrder={3} frustumCulled={false} />
      <sprite ref={head} renderOrder={19}>
        <spriteMaterial ref={headMat} map={texture} transparent depthWrite={false} depthTest={false} />
      </sprite>
    </>
  );
}
