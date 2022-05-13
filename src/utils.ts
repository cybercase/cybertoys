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

export function humanFileSize(size: number): string {
  // https://stackoverflow.com/a/20732091
  let i = Math.floor(Math.log(size) / Math.log(1024));
  size = size / Math.pow(1024, i);
  return size.toFixed(2) + " " + ["B", "kB", "MB", "GB", "TB"][i];
}

export function debugEnabled() {
  return process.env.NODE_ENV === "development";
}

export function getPublicPathFor(script: string) {
  return `${process.env.PUBLIC_URL}/${script}`;
}
