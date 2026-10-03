import * as THREE from 'three';

export interface Interactable {
  id: string;
  position: THREE.Vector3;
  interactionDistance: number;
  prompt: string;
  onInteract: () => void;
  mesh?: THREE.Object3D;
}

class InteractionSystem {
  private interactables: Map<string, Interactable> = new Map();
  private raycaster = new THREE.Raycaster();
  private activeTarget: Interactable | null = null;

  public register(interactable: Interactable) {
    this.interactables.set(interactable.id, interactable);
  }

  public unregister(id: string) {
    this.interactables.delete(id);
  }

  public update(camera: THREE.Camera): Interactable | null {
    if (this.interactables.size === 0) {
      this.activeTarget = null;
      return null;
    }

    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    this.raycaster.set(camera.position, direction);

    let closest: Interactable | null = null;
    let minDistance = Infinity;

    const cameraPos = camera.position;

    this.interactables.forEach((item) => {
      // Calculate distance between camera and object
      const dist = cameraPos.distanceTo(item.position);
      if (dist <= item.interactionDistance) {
        // Raycast angle check: check angle between camera forward vector and vector to object
        const toObject = item.position.clone().sub(cameraPos).normalize();
        const dot = direction.dot(toObject);
        
        // If player is looking closely towards the object (dot product > 0.85)
        if (dot > 0.85 && dist < minDistance) {
          minDistance = dist;
          closest = item;
        }
      }
    });

    this.activeTarget = closest;
    return closest;
  }

  public getActiveTarget(): Interactable | null {
    return this.activeTarget;
  }

  public triggerInteract(): boolean {
    if (this.activeTarget) {
      this.activeTarget.onInteract();
      return true;
    }
    return false;
  }

  public clear() {
    this.interactables.clear();
    this.activeTarget = null;
  }
}

export const interactionSystem = new InteractionSystem();
