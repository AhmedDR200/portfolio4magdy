import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Float, Preload, Text3D } from "@react-three/drei";
import { Group } from "three";

import CanvasLoader from "../layout/Loader";

const FONT_URL =
  "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/fonts/helvetiker_bold.typeface.json";

const Logo = () => {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.35;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <Float
        speed={1.6}
        rotationIntensity={0.15}
        floatIntensity={0.5}
        floatingRange={[-0.1, 0.1]}
      >
        <Center>
          <Text3D
            font={FONT_URL}
            size={1.7}
            height={0.45}
            curveSegments={16}
            bevelEnabled
            bevelThickness={0.06}
            bevelSize={0.05}
            bevelOffset={0}
            bevelSegments={6}
            letterSpacing={-0.04}
          >
            AM4
            <meshStandardMaterial
              color="#00FF88"
              metalness={0.7}
              roughness={0.25}
            />
          </Text3D>
        </Center>
      </Float>
    </group>
  );
};

const Logo3DCanvas = () => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.5], fov: 38 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} castShadow />
        <pointLight position={[-4, -4, 4]} intensity={0.8} color="#00FF88" />
        <pointLight position={[4, -2, 4]} intensity={0.6} color="#00CC66" />

        <Logo />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default Logo3DCanvas;
