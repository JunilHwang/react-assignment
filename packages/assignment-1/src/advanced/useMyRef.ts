import { useState } from "react";

export function useMyRef<T>(initValue: T | null) {
  const [ref] = useState<{ current: typeof initValue}>({ current: initValue });
  return ref
}
