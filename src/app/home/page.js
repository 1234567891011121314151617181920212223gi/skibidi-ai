"use client";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import { auth } from "@/lib/firebase";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HomePage() {
  const router = useRouter();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/');
      }
    });

    const fetchCharacters = async () => {
      try {
        const response = await fetch('/api/characters');
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch characters');
        }

        setCharacters(data.characters || []);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="fixed inset-0 bg-black -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient-xy"></div>
      </div>

      <main className="relative z-10 container mx-auto pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <section>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-8 text-center">
              Recent Bots
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {characters.map((character) => (
                <Link
                  key={character.name}
                  href={`/characters/${encodeURIComponent(character.name)}`}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 hover:transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
                >
                  <div className="aspect-video relative">
                    <Image
                      src={character.imageUrl}
                      alt={character.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {character.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {character.bio?.replace(/<[^>]*>/g, '')}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {character.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
