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

export function debounce<T extends Function>(func: T, timeout = 300): T {
  let timer: ReturnType<typeof setTimeout>;
  const debouncedFn = (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
  return debouncedFn as any as T;
}

export type PropOf<A> = A extends React.ComponentType<infer P> ? P : never;
