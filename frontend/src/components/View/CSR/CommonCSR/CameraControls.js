// src/components/CommonCSR/CameraControls.js
import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CameraControls = forwardRef(
  (
    {
      keysPressed,
      delta,
      rotationDelta,
      maxPanX,
      maxPanY,
      maxPanZ,
      setCameraPose,
      initialPosition,
      initialRotation,
    },
    ref,
  ) => {
    const { camera } = useThree();

    // 초기 위치 및 회전 설정
    useEffect(() => {
      camera.position.set(...initialPosition);
      camera.rotation.set(
        THREE.MathUtils.degToRad(initialRotation.x),
        THREE.MathUtils.degToRad(initialRotation.y),
        THREE.MathUtils.degToRad(initialRotation.z),
      );
      camera.quaternion.setFromEuler(camera.rotation);
      camera.quaternion.normalize();
    }, [camera, initialPosition, initialRotation]);

    // 부모 컴포넌트에 move, rotate, resetCamera 함수를 노출
    useImperativeHandle(ref, () => ({
      move: (axis, direction) => {
        const step = delta;
        if (axis === 'x') {
          camera.position.x += step * direction;
        }
        if (axis === 'y') {
          camera.position.y += step * direction;
        }
        if (axis === 'z') {
          camera.position.z += step * direction;
        }
        // 위치 제한
        camera.position.x = THREE.MathUtils.clamp(
          camera.position.x,
          -maxPanX,
          maxPanX,
        );
        camera.position.y = THREE.MathUtils.clamp(
          camera.position.y,
          -maxPanY,
          maxPanY,
        );
        camera.position.z = THREE.MathUtils.clamp(
          camera.position.z,
          -maxPanZ,
          maxPanZ,
        );
        // 포즈 업데이트
        setCameraPose({
          position: camera.position.clone(),
          rotation: {
            x: THREE.MathUtils.radToDeg(camera.rotation.x),
            y: THREE.MathUtils.radToDeg(camera.rotation.y),
            z: THREE.MathUtils.radToDeg(camera.rotation.z),
          },
        });
      },
      rotate: (axis, direction) => {
        const step = rotationDelta * 0.1;
        const rotationAngle = step * direction;
        const quaternion = new THREE.Quaternion();
        if (axis === 'x') {
          quaternion.setFromAxisAngle(
            new THREE.Vector3(1, 0, 0),
            rotationAngle,
          );
        } else if (axis === 'y') {
          quaternion.setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            rotationAngle,
          );
        } else if (axis === 'z') {
          quaternion.setFromAxisAngle(
            new THREE.Vector3(0, 0, 1),
            rotationAngle,
          );
        }
        camera.quaternion.multiplyQuaternions(quaternion, camera.quaternion);
        camera.quaternion.normalize();
        // 포즈 업데이트
        setCameraPose({
          position: camera.position.clone(),
          rotation: {
            x: THREE.MathUtils.radToDeg(camera.rotation.x),
            y: THREE.MathUtils.radToDeg(camera.rotation.y),
            z: THREE.MathUtils.radToDeg(camera.rotation.z),
          },
        });
      },
      resetCamera: () => {
        camera.position.set(...initialPosition);
        camera.rotation.set(
          THREE.MathUtils.degToRad(initialRotation.x),
          THREE.MathUtils.degToRad(initialRotation.y),
          THREE.MathUtils.degToRad(initialRotation.z),
        );
        camera.quaternion.setFromEuler(camera.rotation);
        camera.quaternion.normalize();
        // 포즈 업데이트
        setCameraPose({
          position: camera.position.clone(),
          rotation: {
            x: THREE.MathUtils.radToDeg(camera.rotation.x),
            y: THREE.MathUtils.radToDeg(camera.rotation.y),
            z: THREE.MathUtils.radToDeg(camera.rotation.z),
          },
        });
      },
    }));

    useFrame(() => {
      // 기존 키 입력에 따른 카메라 이동 및 회전 로직
      if (!keysPressed) return;

      const prevCameraPosition = camera.position.clone();
      const prevCameraQuaternion = camera.quaternion.clone();

      // 효과적인 회전 델타 계산
      const effectiveRotationDelta = delta * rotationDelta * 0.1;

      // 키 입력에 따른 카메라 이동
      if (keysPressed['KeyQ']) {
        camera.translateY(-delta); // 아래로 이동
      }
      if (keysPressed['KeyE']) {
        camera.translateY(delta); // 위로 이동
      }
      if (keysPressed['KeyA']) {
        camera.translateX(-delta); // 왼쪽으로 이동
      }
      if (keysPressed['KeyD']) {
        camera.translateX(delta); // 오른쪽으로 이동
      }
      if (keysPressed['KeyW']) {
        camera.translateZ(-delta); // 앞으로 이동
      }
      if (keysPressed['KeyS']) {
        camera.translateZ(delta); // 뒤로 이동
      }

      // 키 입력에 따른 카메라 회전
      const localXAxis = new THREE.Vector3(1, 0, 0)
        .applyQuaternion(camera.quaternion)
        .normalize();
      const localYAxis = new THREE.Vector3(0, 1, 0)
        .applyQuaternion(camera.quaternion)
        .normalize();
      const localZAxis = new THREE.Vector3(0, 0, 1)
        .applyQuaternion(camera.quaternion)
        .normalize();

      // Roll
      if (keysPressed['KeyU']) {
        console.log('KeyU pressed - Rolling Left');
        const rollQuaternion = new THREE.Quaternion().setFromAxisAngle(
          localZAxis,
          effectiveRotationDelta,
        );
        camera.quaternion.multiplyQuaternions(
          rollQuaternion,
          camera.quaternion,
        );
      }
      if (keysPressed['KeyO']) {
        console.log('KeyO pressed - Rolling Right');
        const rollQuaternion = new THREE.Quaternion().setFromAxisAngle(
          localZAxis,
          -effectiveRotationDelta,
        );
        camera.quaternion.multiplyQuaternions(
          rollQuaternion,
          camera.quaternion,
        );
      }

      // Yaw
      if (keysPressed['KeyJ']) {
        console.log('KeyJ pressed - Yaw Left');
        const yawQuaternion = new THREE.Quaternion().setFromAxisAngle(
          localYAxis,
          effectiveRotationDelta,
        );
        camera.quaternion.multiplyQuaternions(yawQuaternion, camera.quaternion);
      }
      if (keysPressed['KeyL']) {
        console.log('KeyL pressed - Yaw Right');
        const yawQuaternion = new THREE.Quaternion().setFromAxisAngle(
          localYAxis,
          -effectiveRotationDelta,
        );
        camera.quaternion.multiplyQuaternions(yawQuaternion, camera.quaternion);
      }

      // Pitch
      if (keysPressed['KeyK']) {
        console.log('KeyK pressed - Pitch Down');
        const pitchQuaternion = new THREE.Quaternion().setFromAxisAngle(
          localXAxis,
          -effectiveRotationDelta,
        );
        camera.quaternion.multiplyQuaternions(
          pitchQuaternion,
          camera.quaternion,
        );
      }
      if (keysPressed['KeyI']) {
        console.log('KeyI pressed - Pitch Up');
        const pitchQuaternion = new THREE.Quaternion().setFromAxisAngle(
          localXAxis,
          effectiveRotationDelta,
        );
        camera.quaternion.multiplyQuaternions(
          pitchQuaternion,
          camera.quaternion,
        );
      }

      // 쿼터니언 정규화
      camera.quaternion.normalize();

      // 카메라 위치 제한
      camera.position.x = THREE.MathUtils.clamp(
        camera.position.x,
        -maxPanX,
        maxPanX,
      );
      camera.position.y = THREE.MathUtils.clamp(
        camera.position.y,
        -maxPanY,
        maxPanY,
      );
      camera.position.z = THREE.MathUtils.clamp(
        camera.position.z,
        -maxPanZ,
        maxPanZ,
      );

      // 제한된 경우 이전 상태로 복원
      const isClamped =
        camera.position.x === -maxPanX ||
        camera.position.x === maxPanX ||
        camera.position.y === -maxPanY ||
        camera.position.y === maxPanY ||
        camera.position.z === -maxPanZ ||
        camera.position.z === maxPanZ;

      if (isClamped) {
        camera.position.copy(prevCameraPosition);
        camera.quaternion.copy(prevCameraQuaternion);
      }

      // 포즈 데이터 업데이트
      const poseData = {
        position: camera.position.clone(),
        rotation: {
          x: THREE.MathUtils.radToDeg(camera.rotation.x),
          y: THREE.MathUtils.radToDeg(camera.rotation.y),
          z: THREE.MathUtils.radToDeg(camera.rotation.z),
        },
      };
      if (setCameraPose) {
        setCameraPose(poseData);
      }
    });

    return null;
  },
);

export default CameraControls;
