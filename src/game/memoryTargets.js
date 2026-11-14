export function memoryTarget(memory, map) {
  const landmark = memory.landmark && map.props.find((prop) => prop.type === memory.landmark);
  if (!landmark) {
    return {
      kind: "memory", memory, x: memory.x, y: memory.y,
      promptY: memory.y - 48, label: "Remember", radius: 64,
    };
  }

  return {
    kind: "memory", memory, landmark,
    x: landmark.x + landmark.w / 2,
    y: landmark.y + landmark.h / 2,
    promptY: Math.max(28, landmark.y - 8),
    label: "Remember", radius: 55,
  };
}

export function targetDistance(target, x, y) {
  if (!target.landmark) return Math.hypot(x - target.x, y - target.y);
  const { x: left, y: top, w, h } = target.landmark;
  const nearestX = Math.max(left, Math.min(left + w, x));
  const nearestY = Math.max(top, Math.min(top + h, y));
  return Math.hypot(x - nearestX, y - nearestY);
}
