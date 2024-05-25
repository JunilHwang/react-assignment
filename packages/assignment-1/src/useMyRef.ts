export function useMyRef<T>(initValue: T | null) {
  return { current: initValue }
}
