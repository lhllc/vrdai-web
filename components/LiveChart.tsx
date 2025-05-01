"use client";
import { useEffect, useRef } from "react";

export default function LiveChart({ symbol }: { symbol: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!symbol || !ref.current) return;
    ref.current.innerHTML = "";
    // @ts-ignore
    new window.TradingView.widget({
      autosize: true,
      symbol,
      interval: "D",
      container_id: ref.current!,
      theme: "dark",
      style: "1",
      locale: "en"
    });
  }, [symbol]);
  return <div ref={ref} className="h-64 w-full" />;
}
