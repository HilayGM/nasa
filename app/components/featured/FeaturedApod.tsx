'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from '../../page.module.css';

interface NasaData {
  url: string;
  title: string;
  explanation: string;
  media_type?: string;
  copyright?: string;
  date?: string;
}

interface FeaturedApodProps {
  data: NasaData;
}

export default function FeaturedApod({ data }: FeaturedApodProps) {
  const apodDateRef = useRef<HTMLSpanElement>(null);
  const apodTitleRef = useRef<HTMLHeadingElement>(null);
  const mediaWrapperRef = useRef<HTMLDivElement>(null);
  const apodContentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!data) return;

    if (apodDateRef.current) {
      gsap.fromTo(apodDateRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }
      );
    }

    if (apodTitleRef.current) {
      gsap.fromTo(apodTitleRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.3 }
      );
    }

    if (mediaWrapperRef.current) {
      gsap.fromTo(mediaWrapperRef.current, 
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.4 }
      );
    }

    if (apodContentRef.current) {
      gsap.fromTo(apodContentRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.6 }
      );
    }
  }, [data]);

  if (!data) return null;

  return (
    <section id="apod" className={styles.apodSection}>
      <div className={styles.apodGrid}>
        <div className={styles.apodHeader}>
          {data.date && (
            <span className={styles.apodDate} ref={apodDateRef}>
              {new Date(data.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          )}
          <h2 className={styles.apodTitle} ref={apodTitleRef}>
            {data.title}
          </h2>
        </div>
        
        <div className={styles.mediaWrapper} ref={mediaWrapperRef}>
          {data.media_type === 'image' ? (
            <div className={styles.imageContainer}>
              <img
                src={data.url}
                alt={data.title}
                className={styles.media}
                loading="lazy"
              />
            </div>
          ) : data.media_type === 'video' ? (
            <div className={styles.videoContainer}>
              <iframe
                src={data.url}
                title={data.title}
                className={styles.media}
                allowFullScreen
              />
            </div>
          ) : null}
        </div>
        
        <div className={styles.apodContent} ref={apodContentRef}>
          <div className={styles.apodExplanation}>
            {data.explanation.split('\n\n').map((paragraph, i) => (
              <p key={i} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
          
          {data.copyright && (
            <div className={styles.credit}>
              <span className={styles.creditLabel}>Crédito: </span>
              <span className={styles.creditName}>{data.copyright}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
