import React, { useState } from 'react';
import TextEditDialog from './TextEditDialog';
import apiService from '../../../../services/apiService';

const MarkerComponent = ({
  markers,
  handleUpdateMarker,
  handleDeleteMarker,
}) => {
  const [editMarkerId, setEditMarkerId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [hoverIndex, setHoverIndex] = useState(null);

  const handleEditMarker = (marker) => {
    setEditMarkerId(marker.id);
    setEditLabel(marker.label || marker.metadata?.info || 'Untitled Marker');
  };

  const handleSaveEdit = async () => {
    if (editMarkerId !== null) {
      const markerToUpdate = markers.find((m) => m.id === editMarkerId);
      if (markerToUpdate) {
        const updatedMarker = {
          ...markerToUpdate,
          label: editLabel,
          position: {
            x: markerToUpdate.position.x,
            y: markerToUpdate.position.y,
            z: markerToUpdate.position.z,
          },
          metadata: {
            ...markerToUpdate.metadata,
            info: editLabel,
          },
        };

        try {
          await apiService.updateAnnotation(editMarkerId, updatedMarker);
          handleUpdateMarker(editMarkerId, updatedMarker);
        } catch (error) {
          console.error('Failed to update marker:', error);
        }
      }
    }
    setEditMarkerId(null);
    setEditLabel('');
  };

  const onDeleteMarker = async (markerId) => {
    try {
      await apiService.deleteAnnotation(markerId);
      handleDeleteMarker(markerId);
    } catch (error) {
      console.error('Failed to delete marker:', error);
    }
  };

  return (
    <>
      {markers.map(
        (marker, index) =>
          marker.visible && (
            <div
              key={marker.id}
              style={{
                position: 'absolute',
                left: `${marker.screenPosition.x}px`,
                top: `${marker.screenPosition.y}px`,
                zIndex: 100,
              }}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div
                className="marker-circle"
                style={{
                  backgroundColor: 'red',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '-100%',
                  left: '10px',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: '5px',
                  borderRadius: '3px',
                  color: 'white',
                  width: 'max-content',
                  display: 'flex',
                  alignItems: 'center',
                  lineHeight: '1',
                  opacity: hoverIndex === index ? 1 : 0,
                  transition: 'opacity 0.5s',
                  pointerEvents: hoverIndex === index ? 'auto' : 'none',
                }}
              >
                {marker.label || marker.metadata?.info || `Marker ${index + 1}`}
                <img
                  src="/icons/edit.svg"
                  alt="Edit"
                  onClick={() => handleEditMarker(marker)}
                  style={{ cursor: 'pointer', marginLeft: '5px' }}
                />
                <img
                  src="/icons/delete.svg"
                  alt="Delete"
                  onClick={() => onDeleteMarker(marker.id)}
                  style={{ cursor: 'pointer', marginLeft: '5px' }}
                />
              </div>
            </div>
          ),
      )}
      {editMarkerId !== null && (
        <TextEditDialog
          label={editLabel}
          onChange={(e) => setEditLabel(e.target.value)}
          onSave={handleSaveEdit}
          onCancel={() => setEditMarkerId(null)}
        />
      )}
    </>
  );
};

export default MarkerComponent;
