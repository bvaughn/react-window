import { useLayoutEffect, useRef, useState } from "react";

export default function useLocalStorage<Type>(
  key: string,
  defaultValue: Type
): [value: Type, setValue: (newValue: Type) => void] {
  const [value, setValue] = useState<Type>(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue != null) {
      return JSON.parse(storedValue) as Type;
    } else {
      return defaultValue;
    }
  });

  const committedValuesRef = useRef<{
    prevValue: string | null;
    value: string;
  }>({
    prevValue: null,
    value: JSON.stringify(value)
  });
  useLayoutEffect(() => {
    committedValuesRef.current.prevValue = committedValuesRef.current.value;
    committedValuesRef.current.value = JSON.stringify(value);
  });

  // Sync changes from local storage
  useLayoutEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (
        key === event.key &&
        event.newValue &&
        event.newValue !== JSON.stringify(value)
      ) {
        setValue(JSON.parse(event.newValue));
      }
    };

    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, [key, value]);

  // Sync changes to local storage
  useLayoutEffect(() => {
    window.dispatchEvent(
      new StorageEvent("storage", {
        key,
        newValue: committedValuesRef.current.value || "",
        oldValue: committedValuesRef.current.prevValue || ""
      })
    );

    localStorage.setItem(key, committedValuesRef.current.value);
  }, [key, value]);

  return [value, setValue];
}
