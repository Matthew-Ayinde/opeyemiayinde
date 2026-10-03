// Tiny signal so sections can wait for the preloader before animating in.
type Callback = () => void;

let done = false;
const listeners = new Set<Callback>();

export function onIntroDone(cb: Callback) {
  if (done) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
}
