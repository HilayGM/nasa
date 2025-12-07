'use client';

import { useEffect, useRef } from 'react';
import styles from './cards.module.css';
import Card from './Card';
import { createSwapy } from 'swapy';

interface NasaData {
  url: string;
  title: string;
  explanation: string;
  media_type?: string;
  copyright?: string;
  date?: string;
}

interface CardsProps {
  data: NasaData[];
}

export default function Cards({ data }: CardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const swapy = createSwapy(containerRef.current, {
        animation: 'dynamic'
      });

      swapy.onSwap((event) => {
        console.log('swap', event);
      });

      return () => {
        swapy.destroy();
      };
    }
  }, []);

  if (!data || data.length === 0) return null;

  return (
    <div className={styles.cardsContainer} ref={containerRef}>
      {data.map((item, index) => (
        <div 
          key={index} 
          className={styles.slot}
          data-swapy-slot={index}
        >
          <div 
            className={styles.item}
            data-swapy-item={index}
          >
            <Card data={item} index={index} />
          </div>
        </div>
      ))}
    </div>
  );
}

