'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from '../../page.module.css';

export default function Hero() {
  const titleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!titleRef.current || !textRef.current) return;
    
    // Animación para el título
    gsap.to(titleRef.current.querySelectorAll('.title-char'), {
      y: 0,
      opacity: 1,
      duration: 0.05,
      stagger: 0.05,
      ease: 'power2.out',
      delay: 0.5
    });
    
    // Animación para el texto
    gsap.to(textRef.current.querySelectorAll('.text-char'), {
      y: 0,
      opacity: 1,
      duration: 0.03,
      stagger: 0.02,
      ease: 'power2.out',
      delay: 1.5,
      onComplete: () => {
        // Efecto de brillo al terminar
        gsap.to([titleRef.current, textRef.current], {
          textShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
          duration: 1.5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut'
        });
      }
    });
  }, []);

  return (
    <section className={`${styles.section} ${styles.hero}`}>
      <div className={styles.content}>
        <h1 ref={titleRef} className={styles.heroTitle}>
          {"Astronomy Picture ".split('').map((char, i) => (
            <span key={i} className="title-char" style={{ display: 'inline-block', opacity: 0, transform: 'translateY(20px)' }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
        <p ref={textRef} className={styles.heroText}>
          {"Descubre la imagen del día proporcionada por la NASA.".split('').map((char, i) => (
            <span key={i} className="text-char" style={{ display: 'inline-block', opacity: 0, transform: 'translateY(20px)' }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
