import React from 'react';
import { keyActions } from './KeyActions';

const KeyDisplay = ({ keysPressed }) => {
  // 현재 눌려진 키들 필터링
  const pressedKeys = Object.keys(keysPressed).filter(
    (key) => keysPressed[key],
  );

  return (
    <div className="absolute top-0 left-0 p-1 bg-white bg-opacity-75 rounded z-10 max-w-xs">
      <h3 className="text-sm font-semibold mb-1">Keys Pressed:</h3>
      {pressedKeys.length === 0 ? (
        <p className="text-xs">No keys pressed.</p>
      ) : (
        <ul className="list-none p-0 m-0">
          {pressedKeys.map((key) => (
            <li key={key} className="mb-1 text-xs">
              <strong>{key}</strong>: {keyActions[key] || 'Unknown action'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default KeyDisplay;
