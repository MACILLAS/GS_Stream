import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 또는 'next/link'를 사용하실 경우 변경하지 않으셔도 됩니다.
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
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

// 3D 렌더링 라이브러리를 위한 플레이스홀더
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

  const handleObjectSelection = (object) => {
    setSelectedObjects((prev) =>
      prev.includes(object)
        ? prev.filter((obj) => obj !== object)
        : prev.length < 2
        ? [...prev, object]
        : prev
    );
  };

  const handleAiFunctionChange = (functionName) => {
    setAiFunctions((prev) => ({
      ...prev,
      [functionName]: !prev[functionName],
    }));
  };

  const objects = Array.from({ length: 50 }, (_, i) => `Object ${i + 1}`);
  const filteredObjects = objects.filter((obj) =>
    obj.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 상단 네비게이션 */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Towereye AI</h1>
        <Link to="/">
          <Button variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Back to Landing Page
          </Button>
        </Link>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 컨트롤 패널 */}
        <div className="w-1/5 p-4 bg-white shadow-md overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Control Panel</h2>

          {/* 오브젝트 선택 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              Select Objects (Max 2)
            </h3>
            <div className="flex items-center mb-2">
              <Input
                type="text"
                placeholder="Search objects..."
                className="mr-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-40 border rounded-md p-2">
              {filteredObjects.map((object) => (
                <div key={object} className="flex items-center py-1">
                  <Checkbox
                    id={object}
                    checked={selectedObjects.includes(object)}
                    onChange={() => handleObjectSelection(object)}
                  />
                  <Label htmlFor={object} className="ml-2">
                    {object}
                  </Label>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* AI 기능 선택 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">AI Functions</h3>
            <div className="space-y-2">
              {Object.entries(aiFunctions).map(([func, isChecked]) => (
                <div key={func} className="flex items-center">
                  <Checkbox
                    id={func}
                    checked={isChecked}
                    onChange={() => handleAiFunctionChange(func)}
                  />
                  <Label htmlFor={func} className="ml-2 capitalize">
                    {func}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3D 렌더링 영역 */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1 relative flex gap-4">
            {selectedObjects.map((object) => (
              <div key={object} className="flex-1 relative">
                <ThreeDRenderer object={object} />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button size="icon" variant="secondary">
                    <PlusSquare className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary">
                    <MinusSquare className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {selectedObjects.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Select an object to render
              </div>
            )}
          </div>

          {/* 카메라 컨트롤 박스 */}
          {selectedObjects.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md mt-4">
              <h3 className="text-lg font-semibold mb-4">Camera Controls</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="moveStep">Move Step</Label>
                  <Slider
                    id="moveStep"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={moveStep}
                    onChange={(value) => setMoveStep(value)}
                    className="mb-2"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center">
                      <Button size="icon" variant="outline">
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <span className="text-xs mt-1">Y</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Button size="icon" variant="outline">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <span className="text-xs mt-1">X</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Button size="icon" variant="outline">
                        <MoveVertical className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <MoveHorizontal className="h-4 w-4" />
                      </Button>
                      <span className="text-xs mt-1">Z</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="rotateStep">Rotate Step</Label>
                  <Slider
                    id="rotateStep"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={rotateStep}
                    onChange={(value) => setRotateStep(value)}
                    className="mb-2"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center">
                      <Button size="icon" variant="outline">
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <span className="text-xs mt-1">X</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Button size="icon" variant="outline">
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <span className="text-xs mt-1">Y</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Button size="icon" variant="outline">
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <span className="text-xs mt-1">Z</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RenderingPage;
