"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PersonaPage() {
  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('');

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="fixed inset-0 bg-black -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient-xy"></div>
      </div>

      <main className="flex-grow container mx-auto px-4 pt-20 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-8">
            Persona Management
          </h1>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your name"
              />
              <p className="mt-2 text-sm text-gray-400">
                This name will be used by the AI when chatting with you
              </p>
            </div>

            <div>
              <label htmlFor="personality" className="block text-sm font-medium text-gray-300 mb-2">
                Your Personality
              </label>
              <textarea
                id="personality"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Describe your personality, interests, and traits..."
              />
              <p className="mt-2 text-sm text-gray-400">
                The AI will use this information to better understand and interact with you during roleplay
              </p>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}