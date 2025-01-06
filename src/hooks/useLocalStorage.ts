// Based on https://github.com/juliencrn/usehooks-ts/blob/master/lib/src/useLocalStorage/useLocalStorage.ts

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLiveRef } from './useLiveRef'

type SetValue<T> = Dispatch<SetStateAction<T>>

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, SetValue<T>] {
  const readValue = () => readLocalStorageItem(key, initialValue)

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue)
  const storedValueRef = useLiveRef(storedValue)

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue: SetValue<T> = useCallback(
    (value) => {
      // Prevent build error "window is undefined" but keeps working
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key “${key}” even though environment is not a client`,
        )
      }

      try {
        // Allow value to be a function so we have the same API as useState
        const newValue =
          value instanceof Function ? value(storedValueRef.current) : value

        if (newValue == null) {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, JSON.stringify(newValue))
        }

        // Save state
        setStoredValue(newValue)

        // We dispatch a custom event so every useLocalStorage hook are notified
        window.dispatchEvent(new StorageEvent('local-storage', { key }))
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  )

  useEffect(() => {
    setStoredValue(readValue())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return useMemo(() => [storedValue, setValue], [setValue, storedValue])
}

// MARK: – Helpers

// Get from local storage then
// parse stored json or return initialValue
export function readLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue
  }

  try {
    const item = localStorage.getItem(key)
    return item ? (parseJSON(item) as T) : defaultValue
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error)
    return defaultValue
  }
}

// A wrapper for "JSON.parse()"" to support "undefined" value
function parseJSON<T>(value: string | null): T | undefined {
  try {
    return value === 'undefined' ? undefined : JSON.parse(value ?? '')
  } catch {
    console.warn('parsing error on', { value })
    return undefined
  }
}
