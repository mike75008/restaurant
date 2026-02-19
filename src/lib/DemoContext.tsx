"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type DemoData = { name: string; address?: string; city?: string } | null;

const DemoContext = createContext<{
  demo: DemoData;
  setDemo: (d: DemoData) => void;
}>({ demo: null, setDemo: () => {} });

export function DemoProvider({
  recordId,
  children,
}: {
  recordId: string;
  children: ReactNode;
}) {
  const [demo, setDemoState] = useState<DemoData>(null);

  const setDemo = useCallback((d: DemoData) => {
    setDemoState(d);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/demo/${recordId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          setDemoState({
            name: data.name,
            address: data.address,
            city: data.city,
          });
          document.title = `${data.name} | Proposition`;
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [recordId]);

  return (
    <DemoContext.Provider value={{ demo, setDemo }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  return useContext(DemoContext).demo;
}
