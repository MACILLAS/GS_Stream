import React from 'react';

const ControlButtons = ({
  handleResetCamera,
  delta,
  setDelta,
  rotationDelta,
  setRotationDelta,
}) => {
  const handleDeltaChange = (event) => {
    setDelta(parseFloat(event.target.value));
  };

  const handleRotationDeltaChange = (event) => {
    setRotationDelta(parseFloat(event.target.value));
  };

  return (
    <div
      className="controls"
      style={{
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={
            handleResetCamera || (() => console.log('Reset not available'))
          } // 방어 로직 추가
        >
          Reset Camera
        </button>{' '}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label>
          Movement Speed (delta): {delta.toFixed(1)}
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={delta}
            onChange={handleDeltaChange}
          />
        </label>
        <label>
          Rotation Speed (rotationDelta): {rotationDelta.toFixed(1)}
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={rotationDelta}
            onChange={handleRotationDeltaChange}
          />
        </label>
      </div>
    </div>
  );
};

export default ControlButtons;
