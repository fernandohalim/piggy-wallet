"use client";
import { useEffect, useRef, useState } from "react";
import { onChange } from "./events";

export function useLiveQuery<T>(query: () => Promise<T>, deps: unknown[] = []): T | undefined {
  const [data, setData] = useState<T>();
  const queryRef = useRef(query);

  useEffect(() => { queryRef.current = query; });

  useEffect(() => {
    let active = true;
    const run = () =>
      queryRef.current()
        .then((r) => { if (active) setData(r); })
        .catch((err) => console.error("[useLiveQuery] query failed:", err));
    run();
    const unsub = onChange(run);
    return () => { active = false; unsub(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return data;
}