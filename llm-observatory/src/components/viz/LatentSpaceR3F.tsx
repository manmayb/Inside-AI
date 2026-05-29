"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { memo, useRef } from "react";
import * as THREE from "three";
import type { EmbeddingPoint } from "@/types/pipeline";
import { cosineSimilarity } from "@/lib/inference";

function EmbeddingPoints({
  points,
  selectedIndex,
  onSelect,
}: {
  points: EmbeddingPoint[];
  selectedIndex: number;
  onSelect: (i: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const selected = points[selectedIndex];

  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.08;
  });

  return (
    <group ref={group}>
      {[...Array(6)].map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25 + i * 0.15, 0.002, 8, 64]} />
          <meshBasicMaterial color="#00d4aa" transparent opacity={0.12} />
        </mesh>
      ))}
      {points.map((p, i) => {
        const sim =
          selected && i !== selectedIndex ? cosineSimilarity(selected, p) : 0;
        const isSel = i === selectedIndex;
        const scale = isSel ? 0.12 : 0.05 + p.magnitude * 0.04;
        return (
          <mesh
            key={i}
            position={[p.x, p.z, -p.y]}
            scale={scale}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(i);
            }}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color={isSel ? "#ffffff" : new THREE.Color().setHSL(0.45, 0.8, 0.35 + sim * 0.35)}
              emissive={isSel ? "#00d4aa" : "#004433"}
              emissiveIntensity={isSel ? 1.2 : 0.3 + sim}
            />
          </mesh>
        );
      })}
      {selected &&
        points.map((p, i) => {
          if (i === selectedIndex) return null;
          const sim = cosineSimilarity(selected, p);
          if (sim < 0.65) return null;
          return (
            <Line
              key={`link-${i}`}
              points={[
                [selected.x, selected.z, -selected.y],
                [p.x, p.z, -p.y],
              ]}
              color="#8b5cf6"
              transparent
              opacity={sim * 0.6}
              lineWidth={1}
            />
          );
        })}
    </group>
  );
}

function LatentSpaceScene({
  points,
  selectedIndex,
  onSelect,
}: {
  points: EmbeddingPoint[];
  selectedIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <>
      <color attach="background" args={["#030508"]} />
      <fog attach="fog" args={["#030508", 2, 6]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 3, 3]} intensity={1.2} color="#00d4aa" />
      <pointLight position={[-2, -1, 2]} intensity={0.5} color="#8b5cf6" />
      <EmbeddingPoints points={points} selectedIndex={selectedIndex} onSelect={onSelect} />
      <OrbitControls enablePan enableZoom minDistance={1.2} maxDistance={5} />
    </>
  );
}

function LatentSpaceR3FInner({
  points,
  selectedIndex,
  onSelect,
}: {
  points: EmbeddingPoint[];
  selectedIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[var(--panel-border)]">
      <Canvas camera={{ position: [0, 0.5, 2.8], fov: 50 }} gl={{ antialias: true }}>
        <LatentSpaceScene points={points} selectedIndex={selectedIndex} onSelect={onSelect} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-2 left-2 font-mono text-[10px] text-slate-500">
        Orbit · click tokens · PCA projection (simulated)
      </div>
      {points[selectedIndex] && (
        <div className="pointer-events-none absolute right-2 top-2 rounded border border-[var(--panel-border)] bg-black/70 px-2 py-1 font-mono text-[10px] text-[var(--accent)]">
          &quot;{points[selectedIndex].text}&quot;
        </div>
      )}
    </div>
  );
}

export const LatentSpaceR3F = memo(LatentSpaceR3FInner);
