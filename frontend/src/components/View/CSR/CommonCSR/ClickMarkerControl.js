import { useThree, useFrame } from '@react-three/fiber';
import { useCallback, useEffect } from 'react';
import { Vector2, Raycaster, Vector3 } from 'three';
import apiService from '../../../../services/apiService';

const ClickMarkerControl = ({ splatRef, markers, setMarkers }) => {
  const { camera, gl } = useThree();

  const fetchMarkers = useCallback(async () => {
    const annotations = await apiService.getAnnotations();
    const newMarkers = annotations.map((annotation) => ({
      id: annotation.id,
      position: new Vector3(
        annotation.position.x,
        annotation.position.y,
        annotation.position.z,
      ),
      metadata: annotation.metadata,
      label: annotation.label || annotation.metadata?.info || 'Untitled Marker',
    }));
    setMarkers(newMarkers);
  }, [setMarkers]);

  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  useFrame(() => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) => {
        const pos = new Vector3(
          marker.position.x,
          marker.position.y,
          marker.position.z,
        );
        const screenPosition = pos.project(camera);
        screenPosition.x =
          (screenPosition.x * 0.5 + 0.5) * gl.domElement.clientWidth;
        screenPosition.y =
          (screenPosition.y * -0.5 + 0.72) * gl.domElement.clientHeight;
        const visible = screenPosition.z < 1;
        return { ...marker, screenPosition, visible };
      }),
    );
  });

  const handleClick = useCallback(
    async (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      const mousePosition = new Vector2();
      mousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new Raycaster();
      raycaster.setFromCamera(mousePosition, camera);

      const splatMesh = splatRef.current;

      const splatCenters = splatMesh.geometry.attributes.center.array;
      const splatScales = splatMesh.geometry.attributes.scale.array;
      const splatColors = splatMesh.geometry.attributes.color.array;
      const splatsCount = splatCenters.length / 3;

      const modelMatrix = splatMesh.matrixWorld;
      let closestIntersection = null;
      let minDistance = Infinity;

      for (let i = 0; i < splatsCount; i++) {
        const position = new Vector3(
          splatCenters[i * 3],
          splatCenters[i * 3 + 1],
          splatCenters[i * 3 + 2],
        );

        position.applyMatrix4(modelMatrix);
        const scale = splatScales[i * 3];
        const opacity = splatColors[i * 4 + 3];

        const radius = scale;
        const distance = raycaster.ray.distanceToPoint(position);
        const cameraDistance = camera.position.distanceTo(position);

        if (
          cameraDistance + distance < minDistance &&
          distance < radius * 10 &&
          opacity > 0.02
        ) {
          minDistance = cameraDistance + distance;
          closestIntersection = position.clone();
        }
      }

      if (closestIntersection) {
        const distance = closestIntersection.distanceTo(raycaster.ray.origin);
        const markerPosition = new Vector3();
        raycaster.ray.at(distance, markerPosition);
        const screenPosition = markerPosition.clone().project(camera);
        screenPosition.x =
          (screenPosition.x * 0.5 + 0.5) * gl.domElement.clientWidth;
        screenPosition.y =
          (screenPosition.y * -0.5 + 0.5) * gl.domElement.clientHeight;

        const newMarkerData = {
          position: {
            x: markerPosition.x,
            y: markerPosition.y,
            z: markerPosition.z,
          },
          metadata: { info: 'Marker' },
          label: 'New Marker',
        };

        const createdMarker = await apiService.createAnnotation(newMarkerData);

        setMarkers((prev) => [
          ...prev,
          {
            id: createdMarker.id,
            position: markerPosition,
            metadata: createdMarker.metadata,
            label:
              createdMarker.label ||
              createdMarker.metadata?.info ||
              'Untitled Marker',
            screenPosition,
          },
        ]);
      }
    },
    [camera, gl, splatRef, setMarkers],
  );

  useEffect(() => {
    gl.domElement.addEventListener('click', handleClick);
    return () => {
      gl.domElement.removeEventListener('click', handleClick);
    };
  }, [gl, handleClick]);

  return null;
};
export default ClickMarkerControl;
