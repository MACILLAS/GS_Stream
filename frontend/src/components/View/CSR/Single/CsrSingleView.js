// src/components/View/CSR/Single/CsrSingleView.js
import React, { useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
} from '@mui/material';

import WelcomeMessage from 'components/View/Common/WelcomeMessage';
import ViewTitle from 'components/View/Common/ViewTitle';
import CsrCanvas from './CsrCanvas';
import ControlButtons from './ControlButtons';

import { SINGLE_VIEW_SETTINGS } from './CsrSingleViewSettings';
import apiService from '../../../../services/apiService';

const CsrSingleView = () => {
  const location = useLocation();
  const { modelUrl } = location.state || {};

  const controlsRef = useRef(null);

  // Managing state for delta and rotationDelta using initial constants
  const [delta, setDelta] = useState(SINGLE_VIEW_SETTINGS.delta);
  const [rotationDelta, setRotationDelta] = useState(
    SINGLE_VIEW_SETTINGS.rotationDelta,
  );

  const [markers, setMarkers] = useState([]);
  const handleUpdateMarker = (markerId, newMarker) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === markerId ? { ...marker, ...newMarker } : marker,
      ),
    );
  };

  const handleDeleteMarker = async (markerId) => {
    await apiService.deleteAnnotation(markerId);
    setMarkers((prevMarkers) =>
      prevMarkers.filter((marker) => marker.id !== markerId),
    );
  };

  // Pass the resetCamera handler to CsrCanvas
  const handleResetCamera = useCallback(() => {
    console.log('handleResetCamera called');
    if (controlsRef.current) {
      controlsRef.current.position.set(
        ...SINGLE_VIEW_SETTINGS.cameraSettings.position,
      ); // Reset to the initial position
      controlsRef.current.quaternion.set(0, 0, 0, 1); // Reset rotation (identity quaternion)
      controlsRef.current.lookAt(new THREE.Vector3(0, 0, 0)); // Set to look at the origin
    }
  }, [controlsRef]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {' '}
      {/* Style for the entire container */}
      <Card sx={{ padding: 4, boxShadow: 3, borderRadius: 2 }}>
        {' '}
        {/* Wrap the entire layout with Card (added for modern design) */}
        <CardContent>
          <ViewTitle /> {/* Title component */}
          <WelcomeMessage /> {/* Welcome message component */}
          <Divider sx={{ my: 4 }} /> {/* Section divider */}
          {/* WebGL Canvas section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            {' '}
            {/* Box wrapping the WebGL Canvas (style improvement) */}
            {/* <Typography variant="h6" align="center" gutterBottom>
              WebGL Single View
            </Typography> */}
            <CsrCanvas
              controlsRef={controlsRef}
              delta={delta}
              rotationDelta={rotationDelta}
              handleResetCamera={handleResetCamera}
              splatUrl={modelUrl}
              modelPosition={SINGLE_VIEW_SETTINGS.modelPosition}
              maxPanX={SINGLE_VIEW_SETTINGS.maxPanX}
              maxPanY={SINGLE_VIEW_SETTINGS.maxPanY}
              maxPanZ={SINGLE_VIEW_SETTINGS.maxPanZ}
              cameraSettings={SINGLE_VIEW_SETTINGS.cameraSettings}
              markers={markers}
              setMarkers={setMarkers}
              handleUpdateMarker={handleUpdateMarker}
              handleDeleteMarker={handleDeleteMarker}
            />
          </Box>
          <Divider sx={{ my: 4 }} /> {/* Section divider */}
          {/* Control Buttons section */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            {' '}
            {/* Box to center align the buttons (style improvement) */}
            <ControlButtons
              handleResetCamera={handleResetCamera}
              controlsRef={controlsRef}
              delta={delta}
              setDelta={setDelta}
              rotationDelta={rotationDelta}
              setRotationDelta={setRotationDelta}
            />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CsrSingleView;
