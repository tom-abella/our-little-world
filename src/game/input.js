const KEYS = new Set();

export const input = {
  keys: KEYS,
  interact: false,
};

export function setKey(code, down) {
  if (down) KEYS.add(code);
  else KEYS.delete(code);
}

export function clearKeys() {
  KEYS.clear();
}

export function pressInteract() {
  input.interact = true;
}

export function consumeInteract() {
  const pressed = input.interact;
  input.interact = false;
  return pressed;
}

export function moveVector() {
  const left = KEYS.has("ArrowLeft") || KEYS.has("KeyA");
  const right = KEYS.has("ArrowRight") || KEYS.has("KeyD");
  const up = KEYS.has("ArrowUp") || KEYS.has("KeyW");
  const down = KEYS.has("ArrowDown") || KEYS.has("KeyS");
  let dx = (right ? 1 : 0) - (left ? 1 : 0);
  let dy = (down ? 1 : 0) - (up ? 1 : 0);
  if (dx && dy) {
    const inv = Math.SQRT1_2;
    dx *= inv;
    dy *= inv;
  }
  return { dx, dy };
}
