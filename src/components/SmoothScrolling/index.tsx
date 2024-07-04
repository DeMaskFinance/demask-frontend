"use client";
import { ReactLenis } from "lenis/react";

interface SmoothScrollingProps {
  children: React.ReactNode;
}

function SmoothScrolling({ children }: SmoothScrollingProps) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScrolling;
