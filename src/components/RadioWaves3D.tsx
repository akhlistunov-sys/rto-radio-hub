import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// Animated radio wave rings
const WaveRing = ({ radius, speed, color, delay }: { radius: number; speed: number; color: string; delay: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = (clock.getElapsedTime() + delay) * speed;
      const scale = 1 + Math.sin(t) * 0.1;
      ref.current.scale.set(scale, scale, 1);
      ref.current.rotation.z = t * 0.2;
      
      // Pulsing opacity
      const material = ref.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
};

// Floating sphere with distortion
const FloatingSphere = ({ position, color, size }: { position: [number, number, number]; color: string; size: number }) => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.8}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
};

// Particle system for ambient effect
const Particles = ({ count = 100 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.05;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#4F7BF7" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

// Central microphone/speaker shape
const CentralShape = () => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={ref}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Main body */}
        <mesh>
          <cylinderGeometry args={[0.3, 0.4, 0.8, 32]} />
          <MeshDistortMaterial 
            color="#4F7BF7" 
            metalness={0.8} 
            roughness={0.2}
            distort={0.1}
            speed={1}
          />
        </mesh>
        {/* Top sphere */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial 
            color="#1e3a8a" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#4F7BF7"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>
    </group>
  );
};

const Scene = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#4F7BF7" />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#EC4899" />
      <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.3} penumbra={1} color="#ffffff" />

      {/* Central microphone */}
      <CentralShape />
      
      {/* Radio wave rings */}
      <WaveRing radius={1} speed={1.5} color="#4F7BF7" delay={0} />
      <WaveRing radius={1.5} speed={1.3} color="#3B82F6" delay={0.5} />
      <WaveRing radius={2} speed={1.1} color="#60A5FA" delay={1} />
      <WaveRing radius={2.5} speed={0.9} color="#93C5FD" delay={1.5} />
      <WaveRing radius={3} speed={0.7} color="#BFDBFE" delay={2} />

      {/* Floating accent spheres */}
      <FloatingSphere position={[-2, 1, -1]} color="#EC4899" size={0.15} />
      <FloatingSphere position={[2, -1, -1]} color="#10B981" size={0.12} />
      <FloatingSphere position={[1.5, 1.5, -2]} color="#F59E0B" size={0.1} />
      <FloatingSphere position={[-1.5, -1.5, -1.5]} color="#EF4444" size={0.13} />

      {/* Particles */}
      <Particles count={150} />
    </>
  );
};

const RadioWaves3D = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default RadioWaves3D;
