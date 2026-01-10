"use client";

import { useEffect, useInsertionEffect, useState } from "react";

type PerformanceEntry = {
  hadRecentInput: boolean;
  sources: unknown[];
  value: number;
};

export function LayoutShiftDetecter() {
  const [state, setState] = useState<number | null>(null);

  useInsertionEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as PerformanceEntry[]) {
        if (!entry.hadRecentInput) {
          setState(entry.value);
        }
      }
    });

    observer.observe({ type: "layout-shift", buffered: true });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setState((prevState) => (prevState === null ? 0 : prevState));
    }, 250);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  switch (state) {
    case null: {
      return (
        <div className="text-xs text-slate-500">Measuring layout shift ...</div>
      );
    }
    case 0: {
      return <div className="text-xs text-green-400">✅ No layout shift</div>;
    }
    default: {
      return (
        <div className="text-xs text-red-400">
          ❌ Layout shift detected: {state}
        </div>
      );
    }
  }
}
