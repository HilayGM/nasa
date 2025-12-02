'use client'

import TubesBackground from "./components/fondo/page";
import styles from "./page.module.css";
import { useEffect, useState } from 'react';
import Cards from "./components/cards/Cards";
import Hero from "./components/hero/Hero";
import FeaturedApod from "./components/featured/FeaturedApod";

interface NasaData {
  url: string;
  title: string;
  explanation: string;
  media_type?: string;
  copyright?: string;
  date?: string;
}

export default function Home() {
  const [nasaData, setNasaData] = useState<NasaData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNasaData = async () => {
      try {
        const api_key = "dOIhJeUwmzfU4dq90uGfYZMF00ZzfbJpjOJGLn41";
        // Fetch 5 items (1 for main + 4 for grid)
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${api_key}&count=5`
        );
        
        if (!response.ok) {
          throw new Error('Error al obtener los datos de la NASA');
        }
        
        const data = await response.json();
        setNasaData(data); 
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNasaData();
  }, []);

  // Separa el primer item para el destacado y el resto para las cards
  const featuredApod = nasaData.length > 0 ? nasaData[0] : null;
  const gridData = nasaData.length > 1 ? nasaData.slice(1) : [];

  return (
    <div className={styles.page}>
      <TubesBackground>{null}</TubesBackground>
      
      <main className={styles.main}>
        <Hero />

        {/* Sección de Imagen del Día (Destacada) */}
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Cargando datos de la NASA...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>Error: {error}</p>
          </div>
        ) : featuredApod && (
          <>
            <FeaturedApod data={featuredApod} />

            {/* Sección de Cards (Grid) */}
            <section className={styles.apodSection}>
               <Cards data={gridData} />
            </section>
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} NASA. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
