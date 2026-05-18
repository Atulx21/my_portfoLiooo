"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 2000;
const CONNECTION_DIST = 80;
const SPREAD = 600;

function lerpColor(a: THREE.Color, b: THREE.Color, t: number): THREE.Color {
  return new THREE.Color(
    a.r + (b.r - a.r) * t,
    a.g + (b.g - a.g) * t,
    a.b + (b.b - a.b) * t
  );
}

export default function ParticleField() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth;
    const h = mount.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 2000);
    camera.position.z = 400;

    // Colors
    const colorA = new THREE.Color("#4E8EA2");
    const colorB = new THREE.Color("#0A4174");

    // Particle positions and velocities
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const particleColors = new Float32Array(PARTICLE_COUNT * 3);
    const originalPos = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * SPREAD;
      const y = (Math.random() - 0.5) * SPREAD;
      const z = (Math.random() - 0.5) * SPREAD;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPos[i * 3] = x;
      originalPos[i * 3 + 1] = y;
      originalPos[i * 3 + 2] = z;

      const t = Math.random();
      const c = lerpColor(colorA, colorB, t);
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }

    // Particle BufferGeometry
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Connection lines — one LineSegments with dynamic positions
    const MAX_CONNECTIONS = 4000;
    const linePositions = new Float32Array(MAX_CONNECTIONS * 6); // 2 verts per segment
    const lineColors = new Float32Array(MAX_CONNECTIONS * 6);
    const lineGeo = new THREE.BufferGeometry();
    const linePosAttr = new THREE.BufferAttribute(linePositions, 3);
    const lineColorAttr = new THREE.BufferAttribute(lineColors, 3);
    linePosAttr.setUsage(THREE.DynamicDrawUsage);
    lineColorAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute("position", linePosAttr);
    lineGeo.setAttribute("color", lineColorAttr);
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 1,
    });
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegments);

    // Mouse tracking in world space projection
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Resize
    const onResize = () => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    let frameId: number;
    const repelRadius = 60;
    const repelStrength = 0.12;
    const returnStrength = 0.04;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Rotate scene slowly around Y
      particles.rotation.y += 0.0003;
      lineSegments.rotation.y += 0.0003;

      // Mouse repel in world coords (project mouse ray to z=0 plane)
      const mouseVec = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0.5);
      mouseVec.unproject(camera);
      const dir = mouseVec.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      const worldMouse = camera.position.clone().add(dir.multiplyScalar(dist));
      // Undo scene rotation for comparison
      const invRot = new THREE.Quaternion();
      invRot.copy(particles.quaternion).invert();
      const localMouse = worldMouse.clone().applyQuaternion(invRot);

      const pos = particleGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;
        const px = pos.array[ix] as number;
        const py = pos.array[ix + 1] as number;
        const pz = pos.array[ix + 2] as number;

        const dx = px - localMouse.x;
        const dy = py - localMouse.y;
        const dz = pz - localMouse.z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (d < repelRadius && d > 0.01) {
          const force = (repelRadius - d) / repelRadius;
          (pos.array as Float32Array)[ix] += (dx / d) * force * repelStrength * 10;
          (pos.array as Float32Array)[ix + 1] += (dy / d) * force * repelStrength * 10;
          (pos.array as Float32Array)[ix + 2] += (dz / d) * force * repelStrength * 10;
        } else {
          // Spring return to original
          (pos.array as Float32Array)[ix] += (originalPos[ix] - px) * returnStrength;
          (pos.array as Float32Array)[ix + 1] += (originalPos[ix + 1] - py) * returnStrength;
          (pos.array as Float32Array)[ix + 2] += (originalPos[ix + 2] - pz) * returnStrength;
        }
      }
      pos.needsUpdate = true;

      // Update connection lines
      let connCount = 0;
      // Only check a subset of pairs each frame for performance (stride sampling)
      const stride = 4;
      for (let i = 0; i < PARTICLE_COUNT && connCount < MAX_CONNECTIONS - 1; i += stride) {
        for (let j = i + stride; j < PARTICLE_COUNT && connCount < MAX_CONNECTIONS - 1; j += stride) {
          const ix = i * 3;
          const jx = j * 3;
          const ax = pos.array[ix] as number;
          const ay = pos.array[ix + 1] as number;
          const az = pos.array[ix + 2] as number;
          const bx = pos.array[jx] as number;
          const by = pos.array[jx + 1] as number;
          const bz = pos.array[jx + 2] as number;
          const d = Math.sqrt(
            (ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2
          );
          if (d < CONNECTION_DIST) {
            const alpha = (1 - d / CONNECTION_DIST) * 0.6;
            const ci = connCount * 6;
            linePositions[ci] = ax;
            linePositions[ci + 1] = ay;
            linePositions[ci + 2] = az;
            linePositions[ci + 3] = bx;
            linePositions[ci + 4] = by;
            linePositions[ci + 5] = bz;
            // Color with alpha baked into RGB (lines don't support per-vertex alpha)
            const r = 0.306 * alpha; // #4E8EA2 R component approximation
            const g = 0.557 * alpha;
            const b = 0.635 * alpha;
            lineColors[ci] = r;
            lineColors[ci + 1] = g;
            lineColors[ci + 2] = b;
            lineColors[ci + 3] = r;
            lineColors[ci + 4] = g;
            lineColors[ci + 5] = b;
            connCount++;
          }
        }
      }

      lineGeo.setDrawRange(0, connCount * 2);
      linePosAttr.needsUpdate = true;
      lineColorAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
