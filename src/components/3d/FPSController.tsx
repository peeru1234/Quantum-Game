import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { soundFx } from '../../audio/SoundSystem';
import { keyboardManager } from '../../game/KeyboardManager';
import { interactionSystem } from '../../game/InteractionSystem';

export const FPSController: React.FC = () => {
  const { camera, gl } = useThree();
  const {
    gameStage,
    basisState,
    toggleBasis,
    setIsPointerLocked,
    objectiveIndex,
    advanceObjective,
    setHGateAngle,
    setIsEntangled,
    setInteractPrompt,
    snapshotData,
    takeSnapshot,
    restoreSnapshot,
    isEchoActive,
    setIsEchoActive,
    isFractureOpen,
    setIsFractureOpen,
    superpositionCollapsed,
    setSuperpositionCollapsed,
    toggleScanner,
    setIsWhatIfOpen,
    setIsSkillTreeOpen,
    triggerDash,
    cursorMode
  } = useGame();

  const position = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.6, 2));
  const rotation = useRef<{ yaw: number; pitch: number }>({ yaw: 0, pitch: 0 });
  const velocityY = useRef<number>(0);
  const isGrounded = useRef<boolean>(true);
  const footstepTimer = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const prevMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (gameStage !== 'PLAYING') return;

    camera.position.set(0, 1.6, 2);
    keyboardManager.init();

    // Subscribe to keyboard events via central KeyboardManager
    const unsubscribe = keyboardManager.subscribe((action, isPressed) => {
      if (gameStage !== 'PLAYING') return;

      if (isPressed) {
        if (action === 'Q') {
          toggleBasis();
        } else if (action === 'R') {
          if (!snapshotData) takeSnapshot();
          else restoreSnapshot();
        } else if (action === 'C') {
          setIsEchoActive(!isEchoActive);
          soundFx.playHologramClick();
        } else if (action === 'F') {
          setIsFractureOpen(!isFractureOpen);
          soundFx.playHologramClick();
        } else if (action === 'V') {
          setSuperpositionCollapsed(!superpositionCollapsed);
          soundFx.playHologramClick();
        } else if (action === 'G' || action === 'TAB') {
          toggleScanner();
        } else if (action === 'B') {
          triggerDash();
        } else if (action === 'T') {
          setIsWhatIfOpen(true);
        } else if (action === 'K') {
          setIsSkillTreeOpen(true);
        } else if (action === 'E') {
          // 1. Raycast 3D interaction system
          const handled = interactionSystem.triggerInteract();

          // 2. Fallback distance checks for objectives
          if (!handled) {
            const posZ = position.current.z;
            if (objectiveIndex === 0 && posZ > -8 && posZ < 2) {
              soundFx.playHologramClick();
              advanceObjective();
            } else if (objectiveIndex === 1 && posZ < -11 && basisState === 'X') {
              soundFx.playObjectiveComplete();
              advanceObjective();
            } else if (objectiveIndex === 2 && posZ < -14 && posZ > -18) {
              soundFx.playEntangleSound();
              setIsEntangled(true);
              advanceObjective();
            } else if (objectiveIndex === 3 && posZ < -22 && posZ > -26) {
              soundFx.playHologramClick();
              setHGateAngle((prev: number) => {
                const nextAngle = (prev + 45) % 360;
                if (nextAngle === 180 || nextAngle === 0) advanceObjective();
                return nextAngle;
              });
            } else if (objectiveIndex === 4 && posZ <= -26) {
              soundFx.playMissionStartExplosion();
              advanceObjective();
            }
          }
        }
      }
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!cursorMode && (document.pointerLockElement === gl.domElement || isDragging.current)) {
        const movementX = e.movementX !== undefined ? e.movementX : e.clientX - prevMouse.current.x;
        const movementY = e.movementY !== undefined ? e.movementY : e.clientY - prevMouse.current.y;

        rotation.current.yaw -= movementX * 0.003;
        rotation.current.pitch -= movementY * 0.003;

        // Clamp pitch (-85 deg to +85 deg)
        rotation.current.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotation.current.pitch));
      }
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (gameStage === 'PLAYING') {
        isDragging.current = true;
        prevMouse.current = { x: e.clientX, y: e.clientY };

        // Only lock pointer if user explicitly turned off Cursor Mode!
        if (!cursorMode) {
          try {
            if (gl.domElement.requestPointerLock) {
              gl.domElement.requestPointerLock();
            }
          } catch {
            // ignore pointer lock restriction
          }
        }
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleLockChange = () => {
      const locked = document.pointerLockElement === gl.domElement;
      setIsPointerLocked(locked);
    };

    window.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('pointerlockchange', handleLockChange);

    return () => {
      unsubscribe();
      window.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('pointerlockchange', handleLockChange);
    };
  }, [gameStage, camera, gl.domElement, toggleBasis, setIsPointerLocked, objectiveIndex, advanceObjective, basisState, setHGateAngle, setIsEntangled, snapshotData, takeSnapshot, restoreSnapshot, isEchoActive, setIsEchoActive, isFractureOpen, setIsFractureOpen, superpositionCollapsed, setSuperpositionCollapsed, toggleScanner, setIsWhatIfOpen, setIsSkillTreeOpen, triggerDash, cursorMode]);

  useFrame((_, delta) => {
    if (gameStage !== 'PLAYING') return;

    // Center-screen raycast update for 3D interactables
    const activeTarget = interactionSystem.update(camera);
    if (activeTarget) {
      setInteractPrompt(activeTarget.prompt);
    } else {
      setInteractPrompt(null);
    }

    // Apply Camera Rotation
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.x = rotation.current.pitch;
    euler.y = rotation.current.yaw;
    camera.quaternion.setFromEuler(euler);

    // Movement Vectors using KeyboardManager
    const speed = keyboardManager.isPressed('SHIFT') ? 6.5 : 4.0;
    const moveDir = new THREE.Vector3();

    if (keyboardManager.isPressed('W')) moveDir.z -= 1;
    if (keyboardManager.isPressed('S')) moveDir.z += 1;
    if (keyboardManager.isPressed('A')) moveDir.x -= 1;
    if (keyboardManager.isPressed('D')) moveDir.x += 1;

    moveDir.normalize();
    moveDir.applyEuler(new THREE.Euler(0, rotation.current.yaw, 0));

    // Footstep audio on movement
    if (moveDir.length() > 0 && isGrounded.current) {
      footstepTimer.current += delta;
      if (footstepTimer.current > 0.4) {
        soundFx.playFootstep();
        footstepTimer.current = 0;
      }
    }

    // Update horizontal position with collision checks
    const nextZ = position.current.z + moveDir.z * speed * delta;
    const nextX = position.current.x + moveDir.x * speed * delta;

    // Wall collision bounds (X: -5.8 to +5.8)
    if (Math.abs(nextX) < 5.8) {
      position.current.x = nextX;
    }

    // Phase Barrier Collision at Z = -12 in Z-basis!
    const isPassingPhaseBarrier = position.current.z > -11.5 && nextZ <= -12.0;
    if (isPassingPhaseBarrier && basisState === 'Z') {
      position.current.z = -11.4;
    } else if (nextZ > -48.0 && nextZ < 4.0) {
      position.current.z = nextZ;
    }

    // Jump Physics using KeyboardManager
    if (keyboardManager.isPressed('SPACE') && isGrounded.current) {
      velocityY.current = 4.5;
      isGrounded.current = false;
    }

    // Gravity
    velocityY.current -= 12.0 * delta;
    position.current.y += velocityY.current * delta;

    // Ground Floor Plane Collision at Y = 1.6
    if (position.current.y <= 1.6) {
      position.current.y = 1.6;
      velocityY.current = 0;
      isGrounded.current = true;
    }

    camera.position.copy(position.current);
  });

  return null;
};
