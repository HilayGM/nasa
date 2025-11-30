'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface NasaData {
  url: string;
  title: string;
  explanation: string;
  media_type?: string;
}

export default function datos() {
  const [nasaData, setNasaData] = useState<NasaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNasaData = async () => {
      try {
        const api_key = "dOIhJeUwmzfU4dq90uGfYZMF00ZzfbJpjOJGLn41";
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${api_key}`
        );
        
        if (!response.ok) {
          throw new Error('Error al obtener los datos de la NASA');
        }
        
        const data = await response.json();
        setNasaData({
          url: data.url,
          title: data.title,
          explanation: data.explanation,
          media_type: data.media_type
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNasaData();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!nasaData) return null;

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <h1 className="text-3xl font-bold text-center p-6 bg-blue-900 text-white">
          Imagen del Día de la NASA
        </h1>
        
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">{nasaData.title}</h2>
          
          {nasaData.media_type === 'image' ? (
            <div className="relative w-full h-96 mb-4">
              <img
                src={nasaData.url}
                alt={nasaData.title}
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 75vw"
              />
            </div>
          ) : (
            <div className="aspect-video mb-4">
              <iframe
                src={nasaData.url}
                title={nasaData.title}
                className="w-full h-full rounded-lg"
                allowFullScreen
              />
            </div>
          )}
          
          <div className="prose max-w-none">
            <p className="text-gray-700">{nasaData.explanation}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
