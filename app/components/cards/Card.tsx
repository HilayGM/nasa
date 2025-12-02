'use client';

import { useRef } from 'react';

import styles from './cards.module.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Maximize2, Play } from 'lucide-react';

interface NasaData {
  url: string;
  title: string;
  explanation: string;
  media_type?: string;
  copyright?: string;
  date?: string;
}

interface CardProps {
  data: NasaData;
  index: number;
}

export default function Card({ data, index }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { 
        opacity: 0, 
        y: 50 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        delay: index * 0.2,
        ease: 'power3.out' 
      }
    );
  }, { scope: cardRef });

  return (
    <div ref={cardRef} className={styles.card}>
      <div ref={contentRef} className={styles.content}>
        {data.date && (
          <span className={styles.date}>{data.date}</span>
        )}
        <h3 className={styles.title}>{data.title}</h3>
        <p className={styles.description}>{data.explanation}</p>
      </div>
      
      <div ref={mediaRef} className={styles.mediaContainer}>
        <button className={styles.iconButton} aria-label="Expand">
          <Maximize2 size={20} />
        </button>
        
        {data.media_type === 'image' ? (
          <img 
            src={data.url} 
            alt={data.title} 
            className={styles.media}
            loading="lazy"
          />
        ) : (
          <div className={styles.videoPlaceholder}>
            <Play size={48} style={{ marginBottom: '1rem' }} />
            <span>VIDEO</span>
          </div>
        )}
      </div>
    </div>
  );
}
