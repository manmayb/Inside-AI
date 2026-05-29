"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const count = 4200;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4;
      pos[i * 3 + 2] = r * Math.cos(phi);
      col[i * 3] = 0.1 + Math.random() * 0.3;
      col[i * 3 + 1] = 0.7 + Math.random() * 0.3;
      col[i * 3 + 2] = 0.85 + Math.random() * 0.15;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.06) * 0.06;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

function TensorRings() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.08;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.15;
  });

  return (
    <group ref={ref}>
      {[6, 9, 12].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2, 0, i * 0.3]}>
          <torusGeometry args={[r, 0.02, 8, 64]} />
          <meshBasicMaterial color="#00e5c4" transparent opacity={0.12 - i * 0.02} />
        </mesh>
      ))}
    </group>
  );
}

function ConnectionLines() {
  const ref = useRef<THREE.LineSegments>(null);
  const segments = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 60; i++) {
      const x1 = (Math.random() - 0.5) * 20;
      const y1 = (Math.random() - 0.5) * 10;
      const z1 = (Math.random() - 0.5) * 8;
      const x2 = x1 + (Math.random() - 0.5) * 5;
      const y2 = y1 + (Math.random() - 0.5) * 3;
      const z2 = z1 + (Math.random() - 0.5) * 3;
      pts.push(x1, y1, z1, x2, y2, z2);
    }
    return new Float32Array(pts);
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.012;
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[segments, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#7c3aed" transparent opacity={0.1} />
    </lineSegments>
  );
}

export function NeuralBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas camera={{ position: [0, 1, 14], fov: 55 }} gl={{ alpha: true, antialias: true }}>
        <color attach="background" args={["#000208"]} />
        <fog attach="fog" args={["#000208", 12, 32]} />
        <ambientLight intensity={0.15} />
        <pointLight position={[8, 5, 8]} intensity={1.1} color="#00e5c4" />
        <pointLight position={[-6, -3, 5]} intensity={0.5} color="#7c3aed" />
        <TensorRings />
        <ConnectionLines />
        <ParticleField />
      </Canvas>
    </div>
  );
}
