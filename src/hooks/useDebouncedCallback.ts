import * as React from "react"

/**
 * Returns a stable wrapper around `fn` that delays invoking it until `delayMs` has passed
 * without another call. Used to keep free-typing inputs from committing to the (immer-cloned,
 * full-tree-re-rendering) resume store on every keystroke - the input itself stays instant
 * since it's just local/uncontrolled state; only the expensive global update is delayed.
 */
export function useDebouncedCallback<Args extends unknown[]>(fn: (...args: Args) => void, delayMs: number) {
  const fnRef = React.useRef(fn)
  fnRef.current = fn
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return React.useCallback(
    (...args: Args) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => fnRef.current(...args), delayMs)
    },
    [delayMs]
  )
}
