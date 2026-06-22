type Listener = () => void;

const changeListeners = new Set<Listener>();
const outboxListeners = new Set<Listener>();

export function onChange(cb: Listener) {
  changeListeners.add(cb);
  return () => changeListeners.delete(cb);
}
export function emitChange() {
  changeListeners.forEach((cb) => cb());
}

export function onOutbox(cb: Listener) {
  outboxListeners.add(cb);
  return () => outboxListeners.delete(cb);
}
export function emitOutbox() {
  outboxListeners.forEach((cb) => cb());
}