export type KeyAction = 'W' | 'A' | 'S' | 'D' | 'SHIFT' | 'SPACE' | 'E' | 'Q' | 'R' | 'C' | 'F' | 'V' | 'G' | 'B' | 'T' | 'K' | 'TAB' | 'ESC';

type KeyListener = (action: KeyAction, isPressed: boolean) => void;

class KeyboardManager {
  private keys: Map<string, boolean> = new Map();
  private actionListeners: Set<KeyListener> = new Set();
  private initialized = false;

  private keyMap: Record<string, KeyAction> = {
    KeyW: 'W',
    ArrowUp: 'W',
    KeyS: 'S',
    ArrowDown: 'S',
    KeyA: 'A',
    ArrowLeft: 'A',
    KeyD: 'D',
    ArrowRight: 'D',
    ShiftLeft: 'SHIFT',
    ShiftRight: 'SHIFT',
    Space: 'SPACE',
    KeyE: 'E',
    KeyQ: 'Q',
    KeyR: 'R',
    KeyC: 'C',
    KeyF: 'F',
    KeyV: 'V',
    KeyG: 'G',
    KeyB: 'B',
    KeyT: 'T',
    KeyK: 'K',
    Tab: 'TAB',
    Escape: 'ESC'
  };

  public init() {
    if (this.initialized) return;
    this.initialized = true;

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  public destroy() {
    if (!this.initialized) return;
    this.initialized = false;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.actionListeners.clear();
    this.keys.clear();
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    const action = this.keyMap[e.code];
    if (action) {
      if (action === 'TAB') e.preventDefault(); // Prevent focus loss
      if (!this.keys.get(action)) {
        this.keys.set(action, true);
        this.notifyListeners(action, true);
      }
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    const action = this.keyMap[e.code];
    if (action) {
      this.keys.set(action, false);
      this.notifyListeners(action, false);
    }
  };

  public isPressed(action: KeyAction): boolean {
    return !!this.keys.get(action);
  }

  public subscribe(listener: KeyListener): () => void {
    this.actionListeners.add(listener);
    return () => {
      this.actionListeners.delete(listener);
    };
  }

  private notifyListeners(action: KeyAction, isPressed: boolean) {
    this.actionListeners.forEach((listener) => listener(action, isPressed));
  }
}

export const keyboardManager = new KeyboardManager();
