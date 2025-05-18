"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function CharacterPage() {
  const params = useParams();
  const router = useRouter();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(`/api/characters/${params.name}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch character');
        }

        console.log('Character data:', data.character); // Add this line
        setCharacter(data.character);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.name) {
      fetchCharacter();
    }
  }, [params.name]);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

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
        ) : character ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="aspect-square relative rounded-xl overflow-hidden">
                <Image
                  src={character.imageUrl}
                  alt={character.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                {character.name}
              </h1>
              <div className="flex flex-wrap gap-2">
                {character.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-purple-500/20 text-purple-300 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300">{character.bio}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Scenario Dropdown */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('scenario')}
                  className="w-full px-6 py-4 flex justify-between items-center text-white hover:bg-gray-800/50"
                >
                  <span className="text-xl font-semibold">Scenario</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform ${
                      activeSection === 'scenario' ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {activeSection === 'scenario' && (
                  <div className="px-6 py-4 border-t border-gray-800">
                    <p className="text-gray-300">{character.scenario || 'No scenario available.'}</p>
                  </div>
                )}
              </div>

              {/* Personality Dropdown */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('personality')}
                  className="w-full px-6 py-4 flex justify-between items-center text-white hover:bg-gray-800/50"
                >
                  <span className="text-xl font-semibold">Personality</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform ${
                      activeSection === 'personality' ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {activeSection === 'personality' && (
                  <div className="px-6 py-4 border-t border-gray-800">
                    <p className="text-gray-300">{character.personality || 'No personality details available.'}</p>
                  </div>
                )}
              </div>

              {/* Initial Message Dropdown */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('firstMessage')}
                  className="w-full px-6 py-4 flex justify-between items-center text-white hover:bg-gray-800/50"
                >
                  <span className="text-xl font-semibold">Initial Message</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform ${
                      activeSection === 'firstMessage' ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {activeSection === 'firstMessage' && (
                  <div className="px-6 py-4 border-t border-gray-800">
                    <p className="text-gray-300">{character.firstMessage || 'No initial message available.'}</p>
                  </div>
                )}
              </div>

              {/* Example Dialogs Dropdown */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('exampleDialogs')}
                  className="w-full px-6 py-4 flex justify-between items-center text-white hover:bg-gray-800/50"
                >
                  <span className="text-xl font-semibold">Example Dialogs</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform ${
                      activeSection === 'exampleDialogs' ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {activeSection === 'exampleDialogs' && (
                  <div className="px-6 py-4 border-t border-gray-800">
                    <p className="text-gray-300">{character.exampleDialogs || 'No example dialogs available.'}</p>
                  </div>
                )}
              </div>

              {/* Enigmatic Chat Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => router.push(`/chat/${encodeURIComponent(character.name.toLowerCase().replace(/[^a-z0-9]/g, '-'))}`)}
                  className="group relative w-52 py-4 px-6 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-purple-200 font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none border border-purple-500/30 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 overflow-hidden backdrop-blur-sm"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 transform translate-x-full group-hover:translate-x-[-150%] transition-transform duration-700 bg-gradient-to-r from-transparent via-purple-300/20 to-transparent skew-x-12"></div>
                  
                  {/* Ambient glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-purple-500/10"></div>
                  
                  <span className="relative flex items-center justify-center space-x-3">
                    {/* Chat icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    
                    <span className="text-sm tracking-wider font-semibold">Start Chat</span>
                    
                    {/* Arrow */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400">Character not found</div>
        )}
      </main>

      <Footer />
    </div>
  );
}