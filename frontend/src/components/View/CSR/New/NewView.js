import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Checkbox, TextField, Slider, Box } from '@mui/material';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  RotateCcw,
  MoveHorizontal,
  MoveVertical,
  Maximize2,
  MinusSquare,
  PlusSquare,
  Search,
  Home,
} from 'lucide-react';

// Placeholder for the 3D rendering library
const ThreeDRenderer = ({ object }) => (
  <div className="bg-gray-800 rounded-lg w-full h-full flex items-center justify-center text-white">
    <p>3D Rendering of {object}</p>
  </div>
);

function RenderingPage() {
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [aiFunctions, setAiFunctions] = useState({
    measurement: false,
    annotation: false,
    segmentation: false,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [moveStep, setMoveStep] = useState(1);
  const [rotateStep, setRotateStep] = useState(1);
  const [allModels, setAllModels] = useState([]);

  const backendCsrAddress = process.env.REACT_APP_CSR_BACKEND_URL;

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch(backendCsrAddress + '/api/models/splat/list')
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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top navigation */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Towereye AI</h1>
        <Link to="/">
          <Button variant="outlined" startIcon={<Home />}>
            Back to Landing Page
          </Button>
        </Link>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Control panel */}
        <Box className="w-1/5 p-4 bg-white shadow-md" overflow="auto">
          <h2 className="text-xl font-bold mb-4">Control Panel</h2>

          {/* Object selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              Select Objects (Max 2)
            </h3>
            <div className="flex items-center mb-2">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search objects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button size="small" variant="outlined">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Box className="h-40 border rounded-md p-2" overflow="auto">
              {allModels.length === 0 ? (
                <div className="text-center text-gray-500">None</div>
              ) : (
                allModels
                  .filter(
                    (model) =>
                      model.name && // Ensure model has a name property
                      model.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                  )
                  .map((model) => (
                    <div key={model.id} className="flex items-center py-1">
                      <Checkbox
                        checked={selectedObjects.includes(model.id)}
                        onChange={() => handleObjectSelection(model.id)}
                      />
                      <label className="ml-2">{model.name}</label>
                    </div>
                  ))
              )}
            </Box>
          </div>

          {/* AI function selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">AI Functions</h3>
            <div className="space-y-2">
              {Object.entries(aiFunctions).map(([func, isChecked]) => (
                <div key={func} className="flex items-center">
                  <Checkbox
                    checked={isChecked}
                    onChange={() => handleAiFunctionChange(func)}
                  />
                  <label className="ml-2 capitalize">{func}</label>
                </div>
              ))}
            </div>
          </div>
        </Box>

        {/* 3D rendering area */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1 relative flex gap-4">
            {selectedObjects
              .map((id) => allModels.find((model) => model.id === id))
              .filter((object) => object !== undefined)
              .map((object) => (
                <div key={object.id} className="flex-1 relative">
                  <ThreeDRenderer object={object.name} />
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
              <h3 className="text-lg font-semibold mb-4">Camera Controls</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="moveStep">Move Step</label>
                  <Slider
                    id="moveStep"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={moveStep}
                    onChange={(e, value) => setMoveStep(value)}
                    className="mb-2"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center">
                      <Button size="small" variant="outlined">
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button size="small" variant="outlined">
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <span className="text-xs mt-1">Y</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Button size="small" variant="outlined">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button size="small" variant="outlined">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <span className="text-xs mt-1">X</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Button size="small" variant="outlined">
                        <MoveVertical className="h-4 w-4" />
                      </Button>
                      <Button size="small" variant="outlined">
                        <MoveHorizontal className="h-4 w-4" />
                      </Button>
                      <span className="text-xs mt-1">Z</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="rotateStep">Rotate Step</label>
                  <Slider
                    id="rotateStep"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={rotateStep}
                    onChange={(e, value) => setRotateStep(value)}
                    className="mb-2"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center">
                      <Button size="small" variant="outlined">
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <Button size="small" variant="outlined">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <span className="text-xs mt-1">X</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Button size="small" variant="outlined">
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <Button size="small" variant="outlined">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <span className="text-xs mt-1">Y</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Button size="small" variant="outlined">
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <Button size="small" variant="outlined">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <span className="text-xs mt-1">Z</span>
                    </div>
                  </div>
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
