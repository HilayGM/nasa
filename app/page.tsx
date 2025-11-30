'use client'

import TubesBackground from "./components/fondo/page";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface NasaData {
  url: string;
  title: string;
  explanation: string;
  media_type?: string;
  copyright?: string;
  date?: string;
}

export default function Home() {
  const [nasaData, setNasaData] = useState<NasaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Referencias para las animaciones
  const heroTitle = useRef<HTMLHeadingElement>(null);
  const heroText = useRef<HTMLParagraphElement>(null);
  const apodDateRef = useRef<HTMLSpanElement>(null);
  const apodTitleRef = useRef<HTMLHeadingElement>(null);
  const mediaWrapperRef = useRef<HTMLDivElement>(null);
  const apodContentRef = useRef<HTMLDivElement>(null);
  
  // Función para dividir texto en letras y spans
  const splitText = (text: string, className: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className={`${className}-char`} style={{ display: 'inline-block', opacity: 0, transform: 'translateY(20px)' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };
  
  // Referencias para los contenedores de texto
  const titleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // Animaciones con GSAP
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

  // Animaciones para APOD cuando los datos están listos
  useGSAP(() => {
    if (!nasaData) return;

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
  }, [nasaData]);

  useEffect(() => {
    const fetchNasaData = async () => {
      try {
        const api_key = "dOIhJeUwmzfU4dq90uGfYZMF00ZzfbJpjOJGLn41";
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${api_key}&count=3`
        );
        
        if (!response.ok) {
          throw new Error('Error al obtener los datos de la NASA');
        }
        
        const data = await response.json();
        setNasaData(data[0]); // Tomamos el primer elemento del array
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNasaData();
  }, []);

  return (
    <div className={styles.page}>
      <TubesBackground>{null}</TubesBackground>
      
      <main className={styles.main}>
        {/* Sección Hero */}
        <section className={`${styles.section} ${styles.hero}`}>
          <div className={styles.content}>
            <h1 ref={titleRef} className={styles.heroTitle}>
              {"NASA Astronomy Picture ".split('').map((char, i) => (
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

        {/* Sección de Imagen del Día */}
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Cargando datos de la NASA...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>Error: {error}</p>
          </div>
        ) : nasaData && (
          <section id="apod" className={styles.apodSection}>
            <div className={styles.apodGrid}>
              <div className={styles.apodHeader}>
                {nasaData.date && (
                  <span className={styles.apodDate} ref={apodDateRef}>
                    {new Date(nasaData.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                )}
                <h2 className={styles.apodTitle} ref={apodTitleRef}>
                  {nasaData.title}
                </h2>
              </div>
              
              <div className={styles.mediaWrapper} ref={mediaWrapperRef}>
                {nasaData.media_type === 'image' ? (
                  <div className={styles.imageContainer}>
                    <img
                      src={nasaData.url}
                      alt={nasaData.title}
                      className={styles.media}
                      loading="lazy"
                    />
                  </div>
                ) : nasaData.media_type === 'video' ? (
                  <div className={styles.videoContainer}>
                    <iframe
                      src={nasaData.url}
                      title={nasaData.title}
                      className={styles.media}
                      allowFullScreen
                    />
                  </div>
                ) : null}
              </div>
              
              <div className={styles.apodContent} ref={apodContentRef}>
                <div className={styles.apodExplanation}>
                  {nasaData.explanation.split('\n\n').map((paragraph, i) => (
                    <p key={i} className={styles.paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                {nasaData.copyright && (
                  <div className={styles.credit}>
                    <span className={styles.creditLabel}>Crédito: </span>
                    <span className={styles.creditName}>{nasaData.copyright}</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} NASA. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
