import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

type SetValue<T> = Dispatch<SetStateAction<T>>;

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // Read local storage value or fall back to the initial value
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // State to store the current value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Save value to state and local storage
  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        const newValue = value instanceof Function ? value(storedValue) : value;

        if (newValue == null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(newValue));
        }

        setStoredValue(newValue);
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Sync state with local storage on key or initial value change
  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  return [storedValue, setValue];
}
