'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './TubesBackground.module.css';

interface TubesBackgroundProps {
  children: React.ReactNode;
}

function TubesBackgroundClient({ children }: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorAppRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // --- LÓGICA DE COLORES ---
  const generateRandomColors = useCallback((count: number) => {
    return Array.from({ length: count }, () => 
      "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    );
  }, []);

  const handleClick = useCallback(() => {
    if (!cursorAppRef.current?.tubes) return;

    const newColors = generateRandomColors(3);
    const newLights = generateRandomColors(4);

    cursorAppRef.current.tubes.setColors(newColors);
    cursorAppRef.current.tubes.setLightsColors(newLights);
  }, [generateRandomColors]);

  // --- LÓGICA DE INICIALIZACIÓN (THREE.JS + TURBOPACK FIX) ---
  useEffect(() => {
    let isMounted = true;

    const initCursor = async () => {
      if (cursorAppRef.current) return;

      try {
        // Truco para evitar que Turbopack rompa la importación
        const externalImport = new Function('url', 'return import(url)');
        const module = await externalImport("https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js");
        const TubesCursor = module.default || module;

        if (!isMounted || !canvasRef.current) return;

        cursorAppRef.current = new TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#f967fb", "#53bc28", "#695d85"],
            lights: {
              intensity: 200,
              colors: ["#83f36e", "#fe8a2e", "#ff000a", "#60aed5"]
            }
          }
        });

        setIsLoaded(true);

      } catch (error: any) {
        console.error("Error al inicializar el cursor:", error);
        if (isMounted) setLoadError(error.message);
      }
    };

    // Timeout para asegurar que el DOM esté listo
    const timeoutId = setTimeout(() => initCursor(), 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div 
      className={styles.container}
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef} 
        className={styles.canvas}
      />

      <div className={styles.content}>
        {children}
      </div>

      {!isLoaded && !loadError && (
        <div className={styles.loadingIndicator}>
          Loading 3D...
        </div>
      )}
    </div>
  );
}

// This component will only render on the client side
export default function TubesBackground({ children }: TubesBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={styles.placeholder} />;
  }

  return <TubesBackgroundClient>{children}</TubesBackgroundClient>;
}