import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

interface Model3DViewerProps {
  modelUrl: string;
  onClose: () => void;
}

const Model3DViewer: React.FC<Model3DViewerProps> = ({ modelUrl, onClose }) => {
  const { scene } = useGLTF(modelUrl);

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex flex-col">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ flex: 1 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <spotLight position={[0, 10, 0]} intensity={0.5} />
        <primitive object={scene} scale={1.5} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
      <div className="absolute top-4 right-4">
        <button
          className="bg-white text-black px-4 py-2 rounded shadow"
          onClick={onClose}
          aria-label="Close 3D View"
        >
          Close 3D View
        </button>
      </div>
    </div>
  );
};

export default Model3DViewer;
