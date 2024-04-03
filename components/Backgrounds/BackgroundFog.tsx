import { useState, useRef, useEffect } from "react";
import FOG from "vanta/dist/vanta.fog.min";
import * as THREE from "three";

interface BackgroundHaloProps {
  children: React.ReactNode;
}

export default function BackgroundHalo({ children }: BackgroundHaloProps) {
  const [vantaEffect, setVantaEffect] = useState<any>(0);

  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        FOG({
          THREE,
          el: vantaRef.current!,
          highlightColor: 0xebe4ff,
          midtoneColor: 0xd2b4ff,
          lowlightColor: 0x7112ff,
          baseColor: 0xffffff,
          speed: 3.0,
          zoom: 0.6,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} className="w-full h-full overflow-hidden">
      {children}
    </div>
  );
}
