"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneStore } from "./store";
import { palette } from "./palette";
import { live } from "./live";

/**
 * The cursor is a scanner: a targeting reticle that glides over the map and
 * lights up the buildings underneath it (see the edge shader in CityMap).
 */
export function Scanner() {
  const { camera } = useThree();
  const group = useRef<THREE.Group>(null);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide }), []);
  const ring = useMemo(() => new THREE.RingGeometry(5.6, 5.9, 64), []);
  const ticks = useMemo(() => {
    // Four short crosshair ticks around the ring.
    const g = new THREE.BufferGeometry();
    const p: number[] = [];
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) p.push(dx * 6.4, 0, dz * 6.4, dx * 8, 0, dz * 8);
    g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
    return g;
  }, []);
  const lineMat = useMemo(() => new THREE.LineBasicMaterial({ transparent: true, depthWrite: false }), []);

  useFrame(({ clock }, dt) => {
    const p = palette(sceneStore.isDark);
    const { pointer } = sceneStore;
    const on = pointer.active && !sceneStore.reducedMotion && !sceneStore.focus && live.overview < 0.5;
    if (on) {
      ndc.set(pointer.x, pointer.y);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        const k = 1 - Math.exp(-dt * 10);
        live.scan.x += (hit.x - live.scan.x) * k;
        live.scan.y += (hit.z - live.scan.y) * k;
      }
    }
    live.scan.z += ((on ? 1 : 0) - live.scan.z) * Math.min(1, dt * 5);

    mat.color.set(p.scan);
    lineMat.color.set(p.scan);
    mat.opacity = live.scan.z * 0.8;
    lineMat.opacity = live.scan.z * 0.9;
    if (group.current) {
      group.current.position.set(live.scan.x, 0.12, live.scan.y);
      group.current.rotation.y = clock.elapsedTime * 0.6;
      group.current.visible = live.scan.z > 0.01;
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={ring} material={mat} rotation={[-Math.PI / 2, 0, 0]} renderOrder={8} />
      <lineSegments geometry={ticks} material={lineMat} renderOrder={8} />
    </group>
  );
}
