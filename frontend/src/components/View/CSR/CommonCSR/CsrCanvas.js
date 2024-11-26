// src/components/CommonCSR/CsrCanvas.js
import React, { useState, useEffect, forwardRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraControls from './CameraControls';
import SplatComponent from 'components/View/CSR/Splat/SplatComponent';
import { Environment } from '@react-three/drei';
import KeyDisplay from './KeyDisplay';

const CsrCanvas = forwardRef(
  (
    {
      delta,
      rotationDelta,
      splatUrl,
      modelPosition,
      maxPanX,
      maxPanY,
      maxPanZ,
      cameraSettings,
    },
    ref,
  ) => {
    const [keysPressed, setKeysPressed] = useState({});
    const [cameraPose, setCameraPose] = useState({
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    });

    useEffect(() => {
      console.log('splatUrl:', splatUrl);
      console.log('modelPosition:', modelPosition);
    }, [splatUrl, modelPosition]);

    useEffect(() => {
      const handleKeyDown = (event) => {
        setKeysPressed((prevKeys) => ({ ...prevKeys, [event.code]: true }));
      };

      const handleKeyUp = (event) => {
        setKeysPressed((prevKeys) => ({ ...prevKeys, [event.code]: false }));
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);

    const initialRotation = useMemo(
      () => ({ x: -115.29, y: 48.02, z: 152.66 }),
      [],
    );

    return (
      <div className="w-full h-full relative">
        <KeyDisplay keysPressed={keysPressed} />

        {/* Camera Pose 출력 부분 */}
        <div className="absolute top-0 right-0 p-2 bg-white bg-opacity-75 rounded z-10">
          <h3 className="text-sm font-semibold">Camera Pose</h3>
          <p className="text-xs">
            Position: x: {cameraPose.position.x.toFixed(2)}, y:{' '}
            {cameraPose.position.y.toFixed(2)}, z:{' '}
            {cameraPose.position.z.toFixed(2)}
          </p>
          <p className="text-xs">
            Rotation: x: {cameraPose.rotation.x.toFixed(2)}°, y:{' '}
            {cameraPose.rotation.y.toFixed(2)}°, z:{' '}
            {cameraPose.rotation.z.toFixed(2)}°
          </p>
        </div>

        <Canvas
          className="w-full h-full bg-background"
          gl={{ antialias: false }}
          dpr={window.devicePixelRatio || 1} // 향상된 렌더링 품질
          camera={cameraSettings}
        >
          <axesHelper args={[5]} />
          <CameraControls
            ref={ref} // Forward the ref to CameraControls
            keysPressed={keysPressed}
            delta={delta}
            rotationDelta={rotationDelta}
            maxPanX={maxPanX}
            maxPanY={maxPanY}
            maxPanZ={maxPanZ}
            setCameraPose={setCameraPose}
            initialPosition={cameraSettings.position}
            initialRotation={initialRotation} // 메모이제이션된 객체 전달
          />
          <SplatComponent
            maxSplats={20000000}
            splatPos={modelPosition}
            splatRot={[Math.PI, 0, 0]}
            splatScale={17.8}
            splatUrl={splatUrl}
          />
          <Environment preset="city" />
        </Canvas>
      </div>
    );
  },
);

export default CsrCanvas;
