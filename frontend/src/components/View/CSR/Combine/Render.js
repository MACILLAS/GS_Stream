// src/pages/RenderingPage.js
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Checkbox,
  TextField,
  Slider,
  Box,
  Tooltip,
} from '@mui/material';
import { Search, Home } from 'lucide-react';
import CsrCanvas from '../CommonCSR/CsrCanvas';
import { DUAL_VIEW_SETTINGS } from '../Dual/CsrDualViewSettings';
import * as THREE from 'three';

// Helper functions
const handleMove = (axis, direction, refs) => {
  refs.forEach((ref) => {
    if (ref.current) ref.current.move(axis, direction);
  });
};

const handleRotate = (axis, direction, refs) => {
  refs.forEach((ref) => {
    if (ref.current) ref.current.rotate(axis, direction);
  });
};

function RenderingPage() {
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [aiFunctions, setAiFunctions] = useState({
    measurement: false,
    annotation: false,
    segmentation: false,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [delta, setDelta] = useState(DUAL_VIEW_SETTINGS.delta);
  const [rotationDelta, setRotationDelta] = useState(
    DUAL_VIEW_SETTINGS.rotationDelta,
  );
  const [allModels, setAllModels] = useState([]);

  const backendCsrAddress = process.env.REACT_APP_CSR_BACKEND_URL;

  const cameraControlsRef1 = useRef(null);
  const cameraControlsRef2 = useRef(null);

  const getWebglModelUrl = (modelId) => {
    return `${backendCsrAddress}/api/assets/splat/${modelId}`;
  };

  const handleResetCamera = useCallback(() => {
    console.log('handleResetCamera called');
    if (cameraControlsRef1.current) {
      cameraControlsRef1.current.resetCamera();
    }
    if (cameraControlsRef2.current) {
      cameraControlsRef2.current.resetCamera();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'r' || event.key === 'R') {
        handleResetCamera();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleResetCamera]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch(backendCsrAddress + '/api/assets/splat/list')
        .then((response) => response.json())
        .then((data) => {
          if (JSON.stringify(data) !== JSON.stringify(allModels)) {
            setAllModels(data);
          }
        })
        .catch((error) => {
          console.error('Fetching data failed', error);
          setAllModels([]);
        });
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [allModels, backendCsrAddress]);

  const handleObjectSelection = (modelId) => {
    setSelectedObjects((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : prev.length < 2
          ? [...prev, modelId]
          : prev,
    );
  };

  const handleAiFunctionChange = (functionName) => {
    setAiFunctions((prev) => ({
      ...prev,
      [functionName]: !prev[functionName],
    }));
  };

  const cameraSettings = useMemo(
    () => ({
      position: [17.46, 65.26, 16.1],
      rotation: [-115.29, 48.02, 152.66],
      fov: 75,
      near: 0.05,
      far: 1000,
    }),
    [],
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top navigation */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600 leading-normal">
          TowerEye AI
          <span style={{ fontSize: '0.75em', verticalAlign: 'super' }}>
            ™
          </span>{' '}
        </h1>
        <Link to="/">
          <Tooltip title="Back to Home">
            <Button
              variant="outlined"
              startIcon={<Home />}
              aria-label="Back to Home"
            >
              Back to Home
            </Button>
          </Tooltip>
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Control panel */}
        <Box className="w-full lg:w-1/5 min-w-[250px] p-4 bg-white shadow-md overflow-auto">
          <h2 className="text-xl font-bold mb-4 text-sky-600 text-center">
            Control Panel
          </h2>

          {/* Object selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-sky-600">
              Select Objects (Max 2)
            </h3>
            <div className="flex items-center mb-2 text-sky-600">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search objects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mr-2 w-full"
                aria-label="Search objects"
              />
              <Tooltip title="Search (Enter)">
                <Button
                  size="small"
                  variant="outlined"
                  aria-label="Search objects"
                  style={{
                    minWidth: '40px',
                    minHeight: '40px',
                    padding: '8px',
                  }} // Adjust button size
                >
                  <Search style={{ fontSize: '1.5rem' }} />{' '}
                  {/* Adjust icon size */}
                </Button>
              </Tooltip>
            </div>
            <Box className="h-40 border rounded-md p-2 overflow-auto">
              {allModels.length === 0 ? (
                <div className="text-center text-gray-500">None</div>
              ) : (
                allModels
                  .filter(
                    (model) =>
                      model.name &&
                      model.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                  )
                  .map((model) => (
                    <div key={model.id} className="flex items-center py-1">
                      <Checkbox
                        checked={selectedObjects.includes(model.id)}
                        onChange={() => handleObjectSelection(model.id)}
                        aria-label={`Select ${model.name}`}
                      />
                      <label className="ml-2">{model.name}</label>
                    </div>
                  ))
              )}
            </Box>
          </div>

          {/* AI function selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-sky-600">
              AI Functions
            </h3>
            <div className="space-y-2">
              {Object.entries(aiFunctions).map(([func, isChecked]) => (
                <div key={func} className="flex items-center">
                  <Checkbox
                    checked={isChecked}
                    onChange={() => handleAiFunctionChange(func)}
                    aria-label={`Toggle ${func} function`}
                  />
                  <label className="ml-2 capitalize">{func}</label>
                </div>
              ))}
            </div>
          </div>
        </Box>

        {/* 3D rendering area */}
        <div className="flex-1 p-4 flex flex-col">
          <div
            className={`flex-1 relative grid gap-4 ${
              selectedObjects.length === 1
                ? 'grid-cols-1'
                : selectedObjects.length === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-1'
            }`}
          >
            {selectedObjects
              .map((id) => allModels.find((model) => model.id === id))
              .filter((object) => object !== undefined)
              .map((object, index) => (
                <div key={object.id} className="w-full h-full relative">
                  <CsrCanvas
                    ref={
                      selectedObjects.length === 1
                        ? cameraControlsRef1
                        : selectedObjects.length === 2
                          ? index === 0
                            ? cameraControlsRef1
                            : cameraControlsRef2
                          : null
                    }
                    splatUrl={getWebglModelUrl(object.id)}
                    delta={delta}
                    rotationDelta={rotationDelta}
                    modelPosition={[0, 0, 0]}
                    maxPanX={200}
                    maxPanY={200}
                    maxPanZ={200}
                    cameraSettings={cameraSettings}
                  />
                </div>
              ))}
            {selectedObjects.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Select an object to render
              </div>
            )}
          </div>
          {/* Camera control box */}
          {selectedObjects.length > 0 && (
            <Box className="bg-white p-4 rounded-lg shadow-md mt-4">
              <h3 className="text-lg font-semibold mb-4 text-sky-600">
                Camera Controls
              </h3>{' '}
              {/* Theme color */}
              <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
                {/* Move Controls */}
                <div className="flex flex-col">
                  <label
                    htmlFor="delta"
                    className="block text-sm font-medium text-slate-800"
                  >
                    Move Step
                  </label>
                  <Slider
                    id="delta"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={delta}
                    onChange={(e, value) => setDelta(value)}
                    className="mb-2"
                    style={{ color: 'rgb(2 132 199)' }} // Slider theme color
                  />
                  <p className="text-xs mt-1 text-slate-600">
                    Current Move Step: {delta.toFixed(1)}
                  </p>
                  {/* -X, -Y, -Z */}
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <Tooltip title="Move camera along -X axis (A)">
                      <Button
                        size="small"
                        variant="outlined"
                        style={{
                          color: 'rgb(2 132 199)',
                          borderColor: 'rgb(2 132 199)',
                          minWidth: '100px',
                        }} // Button theme
                        onClick={() =>
                          handleMove('x', -1, [
                            cameraControlsRef1,
                            cameraControlsRef2,
                          ])
                        }
                        aria-label="Move camera along -X axis (A)"
                      >
                        A (-X)
                      </Button>
                    </Tooltip>
                    <Tooltip title="Move camera along -Y axis (Q)">
                      <Button
                        size="small"
                        variant="outlined"
                        style={{
                          color: 'rgb(2 132 199)',
                          borderColor: 'rgb(2 132 199)',
                          minWidth: '100px',
                        }}
                        onClick={() =>
                          handleMove('y', -1, [
                            cameraControlsRef1,
                            cameraControlsRef2,
                          ])
                        }
                        aria-label="Move camera along -Y axis (Q)"
                      >
                        Q (-Y)
                      </Button>
                    </Tooltip>
                    <Tooltip title="Move camera along -Z axis (W)">
                      <Button
                        size="small"
                        variant="outlined"
                        style={{
                          color: 'rgb(2 132 199)',
                          borderColor: 'rgb(2 132 199)',
                          minWidth: '100px',
                        }}
                        onClick={() =>
                          handleMove('z', -1, [
                            cameraControlsRef1,
                            cameraControlsRef2,
                          ])
                        }
                        aria-label="Move camera along -Z axis (W)"
                      >
                        W (-Z)
                      </Button>
                    </Tooltip>
                  </div>
                  {/* +X, +Y, +Z */}
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    <Tooltip title="Move camera along +X axis (D)">
                      <Button
                        size="small"
                        variant="outlined"
                        style={{
                          color: 'rgb(2 132 199)',
                          borderColor: 'rgb(2 132 199)',
                          minWidth: '100px',
                        }}
                        onClick={() =>
                          handleMove('x', 1, [
                            cameraControlsRef1,
                            cameraControlsRef2,
                          ])
                        }
                        aria-label="Move camera along +X axis (D)"
                      >
                        D (+X)
                      </Button>
                    </Tooltip>
                    <Tooltip title="Move camera along +Y axis (E)">
                      <Button
                        size="small"
                        variant="outlined"
                        style={{
                          color: 'rgb(2 132 199)',
                          borderColor: 'rgb(2 132 199)',
                          minWidth: '100px',
                        }}
                        onClick={() =>
                          handleMove('y', 1, [
                            cameraControlsRef1,
                            cameraControlsRef2,
                          ])
                        }
                        aria-label="Move camera along +Y axis (E)"
                      >
                        E (+Y)
                      </Button>
                    </Tooltip>
                    <Tooltip title="Move camera along +Z axis (S)">
                      <Button
                        size="small"
                        variant="outlined"
                        style={{
                          color: 'rgb(2 132 199)',
                          borderColor: 'rgb(2 132 199)',
                          minWidth: '100px',
                        }}
                        onClick={() =>
                          handleMove('z', 1, [
                            cameraControlsRef1,
                            cameraControlsRef2,
                          ])
                        }
                        aria-label="Move camera along +Z axis (S)"
                      >
                        S (+Z)
                      </Button>
                    </Tooltip>
                  </div>
                </div>

                {/* Rotate Controls */}
                <div className="flex flex-col">
                  <label
                    htmlFor="rotationDelta"
                    className="block text-sm font-medium text-slate-800"
                  >
                    Rotate Step
                  </label>
                  <Slider
                    id="rotationDelta"
                    min={0.1}
                    max={1}
                    step={0.1}
                    value={rotationDelta}
                    onChange={(e, value) => setRotationDelta(value)}
                    className="mb-2"
                    style={{ color: 'rgb(2 132 199)' }} // Slider theme color
                  />
                  <p className="text-xs mt-1 text-slate-600">
                    Current Rotate Step: {rotationDelta.toFixed(1)}
                  </p>
                  {/* -Rot X, -Rot Y, -Rot Z */}
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <Tooltip title="Rotate camera around -X axis (K)">
                      <Button
                        size="small"
                        variant="outlined"
                        style={{
                          color: 'rgb(2 132 199)',
                          borderColor: 'rgb(2 132 199)',
                          minWidth: '100px',
                        }}
                        onClick={() =>
                          handleRotate('x', -1, [
                            cameraControlsRef1,
                            cameraControlsRef2,
                          ])
                        }
                        aria-label="Rotate camera around -X axis (K)"
                      >
                        K (-Rot X)
                      </Button>
                    </Tooltip>
                    <Tooltip title="Rotate camera around -Y axis (J)">
                      <Button
                        size="small"
                        variant="outlined"
                        style={{
                          color: 'rgb(2 132 199)',
                          borderColor: 'rgb(2 132 199)',
                          minWidth: '100px',
                        }}
                        onClick={() =>
                          handleRotate('y', -1, [
                            cameraControlsRef1,
                            cameraControlsRef2,
                          ])
                        }
                        aria-label="Rotate camera around -Y axis (J)"
                      >
                        J (-Rot Y)
                      </Button>
                    </Tooltip>
                    <Tooltip title="Rotate camera around -Z axis (U)">
                      <Button
                        size="small"
                        variant="outlined"
                        style={{
                          color: 'rgb(2 132 199)',
                          borderColor: 'rgb(2 132 199)',
                          minWidth: '100px',
                        }}
                        onClick={() =>
                          handleRotate('z', -1, [
                            cameraControlsRef1,
                            cameraControlsRef2,
                          ])
                        }
                        aria-label="Rotate camera around -Z axis (U)"
                      >
                        U (-Rot Z)
                      </Button>
                    </Tooltip>
                  </div>
                  {/* +Rot X, +Rot Y, +Rot Z */}
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    <Tooltip title="Rotate camera around +X axis (I)">
                      <Button
                        size="small"
                        variant="outlined"
                        style={{
                          color: 'rgb(2 132 199)',
                          borderColor: 'rgb(2 132 199)',
                          minWidth: '100px',
                        }}
                        onClick={() =>
                          handleRotate('x', 1, [
                            cameraControlsRef1,
                            cameraControlsRef2,
                          ])
                        }
                        aria-label="Rotate camera around +X axis (I)"
                      >
                        I (+Rot X)
                      </Button>
                    </Tooltip>
                    <Tooltip title="Rotate camera around +Y axis (L)">
                      <Button
                        size="small"
                        variant="outlined"
                        style={{
                          color: 'rgb(2 132 199)',
                          borderColor: 'rgb(2 132 199)',
                          minWidth: '100px',
                        }}
                        onClick={() =>
                          handleRotate('y', 1, [
                            cameraControlsRef1,
                            cameraControlsRef2,
                          ])
                        }
                        aria-label="Rotate camera around +Y axis (L)"
                      >
                        L (+Rot Y)
                      </Button>
                    </Tooltip>
                    <Tooltip title="Rotate camera around +Z axis (O)">
                      <Button
                        size="small"
                        variant="outlined"
                        style={{
                          color: 'rgb(2 132 199)',
                          borderColor: 'rgb(2 132 199)',
                          minWidth: '100px',
                        }}
                        onClick={() =>
                          handleRotate('z', 1, [
                            cameraControlsRef1,
                            cameraControlsRef2,
                          ])
                        }
                        aria-label="Rotate camera around +Z axis (O)"
                      >
                        O (+Rot Z)
                      </Button>
                    </Tooltip>
                  </div>
                </div>

                {/* Reset Camera Button */}
                <div className="flex flex-col justify-start">
                  <Tooltip title="Reset Camera (R)">
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: 'rgb(2 132 199)',
                        color: 'white',
                        minWidth: '100px',
                      }}
                      size="small"
                      onClick={handleResetCamera}
                      aria-label="Reset camera to initial position and rotation (R)"
                    >
                      Reset Camera
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}

export default RenderingPage;
