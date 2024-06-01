import { shallowEquals } from "../basic/basic.js";

export const memo1 = (() => {
  const cache = new WeakMap();
  return (fn) => {
    const cached = cache.get(fn);
    if (cached) {
      return cached;
    }
    const result = fn();
    cache.set(fn, result);
    return result;
  }
})();

export const memo2 = (() => {
  const cache = new WeakMap();
  const dependenciesCache = new WeakMap();
  return (fn, dependencies) => {
    const cached = cache.get(fn);
    const cachedDependencies = dependenciesCache.get(fn);
    if (cached && shallowEquals(dependencies, cachedDependencies)) {
      return cached;
    }
    const result = fn();
    cache.set(fn, result);
    dependenciesCache.set(fn, dependencies);
    return result;
  }
})();
