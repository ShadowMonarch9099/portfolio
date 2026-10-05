"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneStore } from "./store";
import { palette } from "./palette";
import { live } from "./live";
import { drawCard, drawLabel, loadFonts, type Fonts } from "./canvasText";
import { POIS, ROUTE, WAYPOINTS, toWorld, type Waypoint } from "./world";

const beamVertex = /* glsl */ `
  varying float vH;
  void main() {
    vH = uv.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const beamFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vH;
  void main() { gl_FragColor = vec4(uColor, uAlpha * pow(1.0 - vH, 1.6)); }
`;

const ringGeo = new THREE.RingGeometry(2.2, 2.7, 48);
const pulseGeo = new THREE.RingGeometry(2.7, 3.05, 48);
const beamGeo = new THREE.CylinderGeometry(0.18, 1, 26, 16, 1, true);
const diamondGeo = new THREE.OctahedronGeometry(1.3, 0);

function useCanvasTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return { canvas: c, texture: t };
  }, []);
}

function WaypointMarker({ wp, index, fonts }: { wp: Waypoint; index: number; fonts: Fonts }) {
  const [x, z] = toWorld(wp.cell);
  const group = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const diamond = useRef<THREE.Mesh>(null);
  const labelSprite = useRef<THREE.Sprite>(null);
  const cardSprite = useRef<THREE.Sprite>(null);
  const label = useCanvasTexture();
  const card = useCanvasTexture();
  const [image, setImage] = useState<HTMLImageElement>();
  const drawn = useRef("");
  const labelKey = useRef("");
  const aspect = useRef(4);
  const cardOpacity = useRef(0);
  // On tall screens the page text spans the full width, so map labels and cards stay faint.
  const portrait = useThree((s) => s.size.width / s.size.height < 1.05);

  const mats = useMemo(
    () => ({
      ring: new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide }),
      pulse: new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide }),
      diamond: new THREE.MeshBasicMaterial({ wireframe: true, transparent: true }),
      beam: new THREE.ShaderMaterial({
        vertexShader: beamVertex,
        fragmentShader: beamFragment,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: { uColor: { value: new THREE.Color() }, uAlpha: { value: 0.5 } },
      }),
      // Labels and cards draw over buildings, like a game map UI.
      label: new THREE.SpriteMaterial({ map: label.texture, transparent: true, depthWrite: false, depthTest: false }),
      card: new THREE.SpriteMaterial({ map: card.texture, transparent: true, depthWrite: false, depthTest: false, opacity: 0 }),
    }),
    [label.texture, card.texture],
  );

  useEffect(() => {
    if (!wp.image) return;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => setImage(img);
    img.src = wp.image;
  }, [wp.image]);

  useFrame(({ clock }, dt) => {
    const p = palette(sceneStore.isDark);
    const key = `${p.ink}-${image ? 1 : 0}`;
    if (drawn.current !== key) {
      if (wp.image) {
        const [sub, title] = wp.label.split(" · ");
        drawCard(card.canvas, title, sub, wp.color, fonts, p.ink, image);
        card.texture.needsUpdate = true;
      }
      drawn.current = key;
    }

    const t = sceneStore.reducedMotion ? 0 : clock.elapsedTime;
    const isCurrent = live.current === index;
    const visited = ROUTE.stopDist[index] <= live.headDist + 0.5;
    const color = isCurrent ? p.head : visited ? p.done : p.upcoming;
    // Labels are drawn in their state colour; redraw only when the state or theme changes.
    const lk = `${p.ink}-${color}`;
    if (labelKey.current !== lk) {
      aspect.current = drawLabel(label.canvas, wp.label, fonts, p.ink, color);
      label.texture.needsUpdate = true;
      labelKey.current = lk;
    }
    mats.ring.color.set(color);
    mats.ring.opacity = isCurrent ? 0.95 : visited ? 0.7 : 0.4;
    mats.diamond.color.set(color);
    mats.diamond.opacity = isCurrent ? 1 : visited ? 0.75 : 0.35;
    mats.beam.uniforms.uColor.value.set(color);
    mats.beam.uniforms.uAlpha.value = isCurrent ? (p.ink ? 0.35 : 0.55) : visited ? 0.16 : 0.06;
    const beamBlend = p.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    if (mats.beam.blending !== beamBlend) {
      mats.beam.blending = beamBlend;
      mats.beam.needsUpdate = true;
    }

    // Pulse ring on the current waypoint.
    if (pulse.current) {
      const k = (t * 0.8) % 1;
      const s = isCurrent ? 1 + k * 2.4 : 1;
      pulse.current.scale.set(s, s, s);
      mats.pulse.color.set(color);
      mats.pulse.opacity = isCurrent ? (1 - k) * 0.8 : 0;
    }
    ring.current?.scale.setScalar(1 + live.overview * 3);
    if (diamond.current) {
      diamond.current.rotation.y = t * 0.9 + index;
      diamond.current.position.y = 4.6 + Math.sin(t * 1.4 + index) * 0.3;
    }

    // Labels near the route head are readable; far ones fade out to avoid clutter.
    const far = Math.abs(ROUTE.stopDist[index] - live.headDist);
    const near = isCurrent ? 1 : 1 - THREE.MathUtils.smoothstep(far, 25, 70) + live.overview;
    const dim = portrait ? 0.3 : 1;
    if (labelSprite.current) {
      // Labels grow as the camera pulls back for the overview, so they stay readable.
      const h = (isCurrent ? 3.8 : 2.9) * (1 + live.overview * 3.4);
      labelSprite.current.scale.set(h * aspect.current, h, 1);
      // A project shows its card instead of the label while you are at it.
      const hideForCard = wp.image ? cardOpacity.current : 0;
      const state = THREE.MathUtils.lerp(isCurrent ? 1 : visited ? 0.75 : 0.55, 1, live.overview);
      mats.label.opacity = Math.min(1, near) * state * (1 - hideForCard) * dim;
    }

    // Project screenshot card rises when you reach its waypoint.
    if (cardSprite.current && wp.image) {
      const want = isCurrent && live.overview < 0.5 ? 1 : 0;
      cardOpacity.current += (want - cardOpacity.current) * Math.min(1, dt * 4);
      mats.card.opacity = cardOpacity.current * dim;
      cardSprite.current.position.y = 17 + (1 - cardOpacity.current) * -4;
      cardSprite.current.visible = cardOpacity.current > 0.01;
    }
  });

  return (
    <group ref={group} position={[x, 0, z]}>
      <mesh ref={ring} geometry={ringGeo} material={mats.ring} rotation={[-Math.PI / 2, 0, 0]} position-y={0.08} renderOrder={5} />
      <mesh ref={pulse} geometry={pulseGeo} material={mats.pulse} rotation={[-Math.PI / 2, 0, 0]} position-y={0.08} renderOrder={5} />
      <mesh geometry={beamGeo} material={mats.beam} position-y={13} renderOrder={5} />
      <mesh ref={diamond} geometry={diamondGeo} material={mats.diamond} position-y={4.6} />
      <sprite ref={labelSprite} material={mats.label} position-y={8.8} renderOrder={20} />
      {wp.image && <sprite ref={cardSprite} material={mats.card} position-y={17} scale={[19, 14, 1]} renderOrder={21} />}
    </group>
  );
}

function Poi({ label, position, color, fonts, index }: (typeof POIS)[number] & { fonts: Fonts; index: number }) {
  const tex = useCanvasTexture();
  const sprite = useRef<THREE.Sprite>(null);
  const mat = useMemo(
    () => new THREE.SpriteMaterial({ map: tex.texture, transparent: true, depthWrite: false, depthTest: false }),
    [tex.texture],
  );
  const drawn = useRef("");
  const aspect = useRef(3);
  const portrait = useThree((s) => s.size.width / s.size.height < 1.05);
  useFrame(() => {
    const p = palette(sceneStore.isDark);
    if (drawn.current !== String(p.ink)) {
      aspect.current = drawLabel(tex.canvas, label, fonts, p.ink, p.ink ? p.poi : color);
      tex.texture.needsUpdate = true;
      drawn.current = String(p.ink);
    }
    if (!sprite.current) return;
    sprite.current.scale.set(2 * aspect.current, 2, 1);
    const d = Math.hypot(position[0] - live.head.x, position[2] - live.head.z);
    mat.opacity = 0.55 * (1 - THREE.MathUtils.smoothstep(d, 60, 150)) * (1 - live.overview) * (portrait ? 0.3 : 1);
    sprite.current.position.y = 7 + (index % 3) * 1.5;
  });
  return <sprite ref={sprite} material={mat} position={position} renderOrder={6} />;
}

export function Waypoints() {
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
      {WAYPOINTS.map((wp, i) => (
        <WaypointMarker key={wp.id} wp={wp} index={i} fonts={fonts} />
      ))}
      {POIS.map((poi, i) => (
        <Poi key={poi.label} {...poi} fonts={fonts} index={i} />
      ))}
    </>
  );
}
