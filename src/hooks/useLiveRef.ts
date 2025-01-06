// Based on https://github.com/ariakit/ariakit/blob/main/packages/ariakit-react-core/src/utils/hooks.ts#LL66C1-L80C2

import { useLayoutEffect, useRef } from 'react'

/**
 * Creates a `React.RefObject` that is constantly updated with the incoming
 * value.
 * @example
 * function Component({ prop }) {
 *   const propRef = useLiveRef(prop);
 * }
 */
export function useLiveRef<T>(value: T) {
  const ref = useRef(value)
  useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}
