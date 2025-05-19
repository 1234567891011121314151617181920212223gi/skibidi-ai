"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiSettings, setApiSettings] = useState(null);
  const [apiType, setApiType] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(`/api/characters/${params.name}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch character');
        }

        console.log('Character data loaded:', data.character); // Debug log
        setCharacter(data.character);
        
        // Add initial message if it exists
        if (data.character.firstMessage) {
          setMessages([
            { 
              role: 'assistant',
              content: data.character.firstMessage,
              isInitial: true
            }
          ]);
        }

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

  useEffect(() => {
    try {
      const savedApiType = localStorage.getItem('activeApiType');
      const savedSettings = JSON.parse(localStorage.getItem('apiSettings'));
      
      if (savedApiType && savedSettings) {
        setApiType(savedApiType);
        setApiSettings(savedSettings);
      } else {
        setError('Please configure API settings first');
        // Optionally redirect to settings page
        // router.push('/api-settings');
      }
    } catch (error) {
      console.error('Error loading API settings:', error);
      setError('Failed to load API settings');
    }
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !apiSettings || !apiType || !character) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      let response;
      // Create detailed system prompt with all character context and custom prompt from settings
      const systemPrompt = `
You are roleplaying as ${character.name}. Here are your characteristics and guidelines:

# Character Details
Name: ${character.name}
Personality: ${character.personality || 'Not specified'}
Current Scenario: ${character.scenario || 'Not specified'}

# Background Information
${character.bio || ''}

# Example Dialogues
${character.exampleDialogs || 'No specific examples provided'}

# Important Instructions
- Stay in character at all times
- Match the personality traits described above
- Keep responses consistent with the scenario
- Use the example dialogues as a reference for tone and style
- Never acknowledge being an AI or break character
- Maintain the character's unique speech patterns and mannerisms

# Custom Instructions
${apiSettings.customPrompt || ''}`.trim();

      console.log('Debug - Full System Prompt:', {
        characterInfo: {
          name: character.name,
          personality: character.personality,
          scenario: character.scenario,
          bio: character.bio,
          exampleDialogs: character.exampleDialogs
        },
        customPrompt: apiSettings.customPrompt,
        fullPrompt: systemPrompt
      });

      const messageHistory = [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ];

      switch (apiType) {
        case 'claude':
          response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiSettings.apiKey,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: apiSettings.model,
              messages: messageHistory,
              max_tokens: 1000
            })
          });
          break;

        case 'openai':
          response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiSettings.apiKey}`
            },
            body: JSON.stringify({
              model: apiSettings.model,
              messages: messageHistory,
              max_tokens: 1000
            })
          });
          break;

        case 'custom':
          response = await fetch(apiSettings.apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(apiSettings.apiKey && { 'Authorization': `Bearer ${apiSettings.apiKey}` })
            },
            body: JSON.stringify({
              model: apiSettings.model,
              messages: messageHistory,
              max_tokens: 1000
            })
          });
          break;

        default:
          throw new Error('Unknown API type');
      }

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract message content based on API type
      const aiResponse = apiType === 'claude' 
        ? data.content[0].text
        : data.choices[0].message.content;

      // Add AI response to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatMessage = (content) => {
    return content.split('\n').map((text, i) => {
      const parts = text.split(/(\*[^*]+\*|\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="mb-2">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              // Bold text
              return (
                <span key={j} className="font-bold">
                  {part.slice(2, -2)}
                </span>
              );
            } else if (part.startsWith('*') && part.endsWith('*')) {
              // Italic/faded text
              return (
                <span key={j} className="text-gray-400 italic">
                  {part.slice(1, -1)}
                </span>
              );
            }
            return part;
          })}
        </p>
      );
    });
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
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-800 flex items-center space-x-4">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={character.imageUrl}
                    alt={character.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold text-white">{character.name}</h2>
              </div>

              {/* Messages Container */}
              <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-xl ${
                        message.role === 'user'
                          ? 'bg-purple-600/20 text-purple-100'
                          : message.isInitial
                          ? 'bg-gradient-to-r from-gray-800/70 to-purple-900/50 text-gray-100 border border-purple-500/20'
                          : 'bg-gray-800/50 text-gray-100'
                      }`}
                    >
                      {formatMessage(message.content)}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800/50 text-gray-100 p-4 rounded-xl flex space-x-2">
                      <span className="animate-bounce">●</span>
                      <span className="animate-bounce delay-100">●</span>
                      <span className="animate-bounce delay-200">●</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
                <div className="flex space-x-4">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (input.trim()) {
                          handleSendMessage(e);
                        }
                      }
                    }}
                    placeholder="Type your message... Use * for italic and ** for bold text. Press Shift + Enter for new line"
                    className="flex-1 bg-gray-800/50 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] max-h-[200px] resize-y"
                    style={{ 
                      height: '100px',
                      lineHeight: '1.5'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="h-fit bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </form>
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