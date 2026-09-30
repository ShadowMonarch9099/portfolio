"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneStore } from "./store";
import { palette } from "./palette";
import { BODIES, restPosition, seededRandom, type Body } from "./world";

/* ------------------------------------------------------------------ */
/* Shared resources                                                   */
/* ------------------------------------------------------------------ */

const sphere = new THREE.SphereGeometry(1, 48, 32);

let glowTexture: THREE.Texture | null = null;
function getGlowTexture() {
  if (glowTexture) return glowTexture;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.18, "rgba(255,255,255,0.55)");
  g.addColorStop(0.45, "rgba(255,255,255,0.14)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  glowTexture = new THREE.CanvasTexture(canvas);
  return glowTexture;
}

/** Time that stands still when the visitor prefers reduced motion. */
function sceneTime(clock: THREE.Clock) {
  return sceneStore.reducedMotion ? 0 : clock.elapsedTime;
}

const planetVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const planetFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uGlow;
  uniform float uTime;
  uniform float uSeed;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    float warp = sin(vPos.x * 3.1 + uSeed + uTime * 0.15) * 0.35 + sin(vPos.z * 5.3 - uSeed) * 0.15;
    float bands = sin((vPos.y + warp) * 9.0 + uSeed) * 0.5 + 0.5;
    vec3 base = uColor * (0.72 + 0.4 * bands);
    vec3 light = normalize(vec3(-0.55, 0.55, 0.65));
    float diff = max(dot(vNormal, light), 0.0);
    vec3 col = base * (0.14 + 1.0 * diff);
    float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.4);
    col += uGlow * rim * 0.85;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const starFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uGlow;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    float facing = max(dot(vNormal, vView), 0.0);
    float grain = sin(vPos.x * 14.0 + uTime * 0.8) * sin(vPos.y * 13.0 - uTime * 0.6) * sin(vPos.z * 15.0 + uTime * 0.5);
    vec3 col = mix(uGlow, uColor, pow(facing, 0.55));
    col += grain * 0.06;
    gl_FragColor = vec4(col * 1.15, 1.0);
  }
`;

function usePlanetMaterial(color: string, glow: string, star = false, seed = 0) {
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: planetVertex,
        fragmentShader: star ? starFragment : planetFragment,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uGlow: { value: new THREE.Color(glow) },
          uTime: { value: 0 },
          uSeed: { value: seed },
        },
      }),
    [color, glow, star, seed],
  );
}

/** A soft billboard glow that switches blending with the theme. */
function Glow({ color, scale, strength = 1 }: { color: string; scale: number; strength?: number }) {
  const ref = useRef<THREE.SpriteMaterial>(null);
  const texture = useMemo(() => getGlowTexture(), []);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const p = palette(sceneStore.isDark);
    const blending = p.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    if (m.blending !== blending) {
      m.blending = blending;
      m.needsUpdate = true;
    }
    m.opacity = p.glowOpacity * strength;
  });
  return (
    <sprite scale={[scale, scale, 1]}>
      <spriteMaterial ref={ref} map={texture} color={color} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  );
}

/* ------------------------------------------------------------------ */
/* Body types                                                         */
/* ------------------------------------------------------------------ */

function Star({ body }: { body: Body }) {
  const mat = usePlanetMaterial(body.color, body.glow, true);
  useFrame(({ clock }) => (mat.uniforms.uTime.value = sceneTime(clock)));
  return (
    <group>
      <mesh geometry={sphere} material={mat} scale={body.radius} />
      <Glow color={body.glow} scale={body.radius * 7} />
      <Glow color={body.color} scale={body.radius * 3} strength={0.6} />
    </group>
  );
}

function Planet({ body, seed }: { body: Body; seed: number }) {
  const mat = usePlanetMaterial(body.color, body.glow, false, seed);
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = sceneTime(clock);
    mat.uniforms.uTime.value = t;
    if (ref.current) ref.current.rotation.y = t * 0.12;
  });
  return (
    <group>
      <mesh ref={ref} geometry={sphere} material={mat} scale={body.radius} />
      <Glow color={body.glow} scale={body.radius * 4.2} strength={0.35} />
    </group>
  );
}

const ringFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uInner;
  uniform float uOuter;
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    float r = (length(vPos.xy) - uInner) / (uOuter - uInner);
    float bands = 0.55 + 0.45 * sin(r * 42.0) * sin(r * 13.0 + 1.3);
    float edge = smoothstep(0.0, 0.08, r) * (1.0 - smoothstep(0.85, 1.0, r));
    gl_FragColor = vec4(uColor, edge * bands * 0.75);
  }
`;

const ringVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function Ringed({ body, seed }: { body: Body; seed: number }) {
  const inner = body.radius * 1.45;
  const outer = body.radius * 2.5;
  const ring = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ringVertex,
        fragmentShader: ringFragment,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        uniforms: { uColor: { value: new THREE.Color(body.glow) }, uInner: { value: inner }, uOuter: { value: outer } },
      }),
    [body.glow, inner, outer],
  );
  const geo = useMemo(() => new THREE.RingGeometry(inner, outer, 128, 1), [inner, outer]);
  return (
    <group rotation={[0.35, 0, -0.25]}>
      <Planet body={body} seed={seed} />
      <mesh geometry={geo} material={ring} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  );
}

const diskFragment = /* glsl */ `
  uniform float uTime;
  uniform float uInner;
  uniform float uOuter;
  uniform vec3 uHot;
  varying vec3 vPos;
  void main() {
    float r = (length(vPos.xy) - uInner) / (uOuter - uInner);
    float ang = atan(vPos.y, vPos.x);
    float swirl = 0.6 + 0.4 * sin(ang * 6.0 - uTime * 1.6 + r * 18.0);
    vec3 col = mix(vec3(1.0, 0.95, 0.85), uHot, smoothstep(0.0, 0.55, r));
    float a = (1.0 - smoothstep(0.0, 1.0, r)) * smoothstep(0.0, 0.04, r) * swirl;
    gl_FragColor = vec4(col, a);
  }
`;

function BlackHole({ body }: { body: Body }) {
  const inner = body.radius * 1.25;
  const outer = body.radius * 4.2;
  const disk = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ringVertex,
        fragmentShader: diskFragment,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uInner: { value: inner },
          uOuter: { value: outer },
          uHot: { value: new THREE.Color(body.glow) },
        },
      }),
    [body.glow, inner, outer],
  );
  const geo = useMemo(() => new THREE.RingGeometry(inner, outer, 160, 1), [inner, outer]);
  useFrame(({ clock }) => {
    disk.uniforms.uTime.value = sceneTime(clock);
    const blending = palette(sceneStore.isDark).additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    if (disk.blending !== blending) {
      disk.blending = blending;
      disk.needsUpdate = true;
    }
  });
  return (
    <group rotation={[0.28, 0, 0.18]}>
      <mesh geometry={sphere} scale={body.radius}>
        <meshBasicMaterial color="#050505" />
      </mesh>
      <mesh geometry={geo} material={disk} rotation={[-Math.PI / 2, 0, 0]} />
      <Glow color={body.glow} scale={body.radius * 6} strength={0.5} />
    </group>
  );
}

const MOON_COLORS = ["#ff7a3d", "#6fb7a8", "#efe0c8"];

function Moons({ body }: { body: Body }) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  useFrame(({ clock }) => {
    const t = sceneTime(clock);
    refs.current.forEach((g, i) => {
      if (!g) return;
      const a = t * (0.35 + i * 0.12) + (i * Math.PI * 2) / 3;
      const r = 3.6 + i * 1.3;
      g.position.set(Math.cos(a) * r, Math.sin(a * 0.7) * 0.6, Math.sin(a) * r);
    });
  });
  return (
    <group>
      <Star body={{ ...body, radius: body.radius * 0.8 }} />
      {MOON_COLORS.map((c, i) => (
        <group key={c} ref={(el) => void (refs.current[i] = el)}>
          <Planet body={{ ...body, radius: 0.55 + i * 0.12, color: c, glow: c }} seed={i * 2.1} />
        </group>
      ))}
    </group>
  );
}

function Binary({ body }: { body: Body }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = sceneTime(clock) * 0.45;
  });
  return (
    <group ref={ref}>
      <group position={[2.4, 0, 0]}>
        <Star body={body} />
      </group>
      <group position={[-2.4, 0, 0]}>
        <Star body={{ ...body, radius: body.radius * 0.75, color: "#ffe6cf", glow: "#ff7a3d" }} />
      </group>
    </group>
  );
}

function Belt({ body, lite }: { body: Body; lite: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const { geometry, material } = useMemo(() => {
    const count = lite ? 260 : 520;
    const random = seededRandom(42);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = random() * Math.PI * 2;
      const r = 4.6 + (random() - 0.5) * 2.2;
      pos.set([Math.cos(a) * r, (random() - 0.5) * 0.5, Math.sin(a) * r], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geometry: g, material: new THREE.PointsMaterial({ size: 0.13, color: body.color, sizeAttenuation: true }) };
  }, [body.color, lite]);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = sceneTime(clock) * 0.08;
  });
  return (
    <group rotation={[0.3, 0, 0.1]}>
      <Planet body={body} seed={4.2} />
      <points ref={ref} geometry={geometry} material={material} />
    </group>
  );
}

const TRAIL = 70;
function Comet({ body }: { body: Body }) {
  const head = useRef<THREE.Group>(null);
  const { geometry, material, history } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(TRAIL * 3);
    const alpha = new Float32Array(TRAIL);
    for (let i = 0; i < TRAIL; i++) alpha[i] = Math.pow(1 - i / TRAIL, 1.6);
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(alpha, 1));
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(body.glow) } },
      vertexShader: /* glsl */ `
        attribute float aAlpha;
        varying float vAlpha;
        void main() {
          vAlpha = aAlpha;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (2.0 + 26.0 * aAlpha) * (18.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          gl_FragColor = vec4(uColor, vAlpha * smoothstep(0.5, 0.0, d) * 0.8);
        }`,
    });
    return { geometry: g, material: m, history: [] as THREE.Vector3[] };
  }, [body.glow]);

  useFrame(({ clock }) => {
    const t = sceneTime(clock) * 0.35;
    const p = new THREE.Vector3(Math.cos(t) * 7, Math.sin(t * 2) * 0.8, Math.sin(t) * 4);
    head.current?.position.copy(p);
    history.unshift(p);
    if (history.length > TRAIL) history.length = TRAIL;
    const arr = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < TRAIL; i++) {
      const h = history[Math.min(i, history.length - 1)];
      arr.set([h.x, h.y, h.z], i * 3);
    }
    geometry.attributes.position.needsUpdate = true;
    const blending = palette(sceneStore.isDark).additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    if (material.blending !== blending) {
      material.blending = blending;
      material.needsUpdate = true;
    }
  });

  return (
    <group>
      <points geometry={geometry} material={material} frustumCulled={false} />
      <group ref={head}>
        <Star body={body} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */

export function Bodies({ lite }: { lite: boolean }) {
  return (
    <>
      {BODIES.map((body, i) => {
        const node =
          body.kind === "star" ? <Star body={body} />
          : body.kind === "ringed" ? <Ringed body={body} seed={i} />
          : body.kind === "blackhole" ? <BlackHole body={body} />
          : body.kind === "moons" ? <Moons body={body} />
          : body.kind === "binary" ? <Binary body={body} />
          : body.kind === "belt" ? <Belt body={body} lite={lite} />
          : body.kind === "comet" ? <Comet body={body} />
          : <Planet body={body} seed={i * 1.7} />;
        return (
          <group key={body.id} position={restPosition(body)}>
            {node}
          </group>
        );
      })}
    </>
  );
}
