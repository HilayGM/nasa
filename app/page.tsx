'use client'

import TubesBackground from "./components/fondo/page";
import styles from "./page.module.css";
import { useEffect, useState } from 'react';

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
      <TubesBackground />
      
      <main className={styles.main}>
        {/* Sección Hero */}
        <section className={`${styles.section} ${styles.hero}`}>
          <div className={styles.content}>
            <h1>NASA Astronomy Picture of the Day</h1>
            <p>Descubre la imagen astronómica del día proporcionada por la NASA.</p>
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
          <section id="apod" className={styles.section}>
            <div className={styles.apodContainer}>
              <h2>{nasaData.title}</h2>
              {nasaData.copyright && (
                <p className={styles.copyright}>© {nasaData.copyright}</p>
              )}
              {nasaData.date && (
                <p className={styles.date}>
                  {new Date(nasaData.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
              
              <div className={styles.mediaContainer}>
                {nasaData.media_type === 'image' ? (
                  <div className={styles.imageWrapper}>
                    <img
                      src={nasaData.url}
                      alt={nasaData.title}
                      className={styles.media}
                      loading="lazy"
                    />
                  </div>
                ) : nasaData.media_type === 'video' ? (
                  <div className={styles.videoWrapper}>
                    <iframe
                      src={nasaData.url}
                      title={nasaData.title}
                      className={styles.media}
                      allowFullScreen
                    />
                  </div>
                ) : null}
              </div>
              
              <div className={styles.explanation}>
                <p>{nasaData.explanation}</p>
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
