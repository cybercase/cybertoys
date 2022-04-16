export function createInstanceMapper<A extends object, B>(fn: (input: A) => B) {
  const cache = new WeakMap<A, B>();
  return function (input: A): B {
    let extension = cache.get(input);
    if (extension) {
      return extension;
    }
    extension = fn(input);
    cache.set(input, extension);
    return extension;
  };
}
