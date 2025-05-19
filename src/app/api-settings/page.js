"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ApiSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('claude');
  const [claudeSettings, setClaudeSettings] = useState({
    model: '',
    apiKey: '',
    customPrompt: ''
  });
  const [openaiSettings, setOpenaiSettings] = useState({
    model: '',
    apiKey: '',
    customPrompt: ''
  });
  const [customSettings, setCustomSettings] = useState({
    model: '',
    apiUrl: '',
    apiKey: '',
    customPrompt: ''
  });
  const [error, setError] = useState('');
  const [activeApiType, setActiveApiType] = useState('claude'); // Default to claude without localStorage

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // Load active API type
    const savedApiType = localStorage.getItem('activeApiType');
    if (savedApiType) {
      setActiveApiType(savedApiType);
      setActiveTab(savedApiType);
    }

    // Load saved settings
    try {
      const savedSettings = localStorage.getItem('apiSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        switch (savedApiType) {
          case 'claude':
            setClaudeSettings(settings);
            break;
          case 'openai':
            setOpenaiSettings(settings);
            break;
          case 'custom':
            setCustomSettings(settings);
            break;
        }
      }
    } catch (error) {
      console.error('Error loading saved settings:', error);
    }
  }, []); // Run once on component mount

  const tabs = [
    { id: 'claude', label: 'Claude' },
    { id: 'openai', label: 'OpenAI' },
    { id: 'custom', label: 'Custom' }
  ];

  const handleClaudeChange = (field, value) => {
    setClaudeSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenAIChange = (field, value) => {
    setOpenaiSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomChange = (field, value) => {
    setCustomSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePresetClick = (model) => {
    setClaudeSettings(prev => ({
      ...prev,
      model
    }));
  };

  const handleOpenAIPresetClick = (model) => {
    setOpenaiSettings(prev => ({
      ...prev,
      model
    }));
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setError(''); // Clear any previous errors
  };

  const handleSaveClaudeSettings = () => {
    setError('');
    if (!claudeSettings.model.trim()) {
      setError('Model is required');
      return;
    }
    if (!claudeSettings.apiKey.trim()) {
      setError('Claude API Key is required');
      return;
    }
    if (!claudeSettings.customPrompt.trim()) {
      setError('Custom prompt is required');
      return;
    }

    try {
      localStorage.setItem('activeApiType', 'claude');
      localStorage.setItem('apiSettings', JSON.stringify(claudeSettings));
      alert('Claude settings saved successfully!');
    } catch (error) {
      setError('Failed to save settings');
      console.error('Save error:', error);
    }
  };

  const handleSaveOpenAISettings = () => {
    setError('');
    if (!openaiSettings.model.trim()) {
      setError('Model is required');
      return;
    }
    if (!openaiSettings.apiKey.trim()) {
      setError('OpenAI API Key is required');
      return;
    }
    if (!openaiSettings.customPrompt.trim()) {
      setError('Custom prompt is required');
      return;
    }

    try {
      localStorage.setItem('activeApiType', 'openai');
      localStorage.setItem('apiSettings', JSON.stringify(openaiSettings));
      alert('OpenAI settings saved successfully!');
    } catch (error) {
      setError('Failed to save settings');
      console.error('Save error:', error);
    }
  };

  const handleSaveCustomSettings = () => {
    setError('');
    if (!customSettings.model.trim()) {
      setError('Model is required');
      return;
    }
    if (!customSettings.apiUrl.trim()) {
      setError('API URL is required');
      return;
    }
    if (!customSettings.apiKey.trim()) {
      setError('API Key is required');
      return;
    }
    if (!customSettings.customPrompt.trim()) {
      setError('Custom prompt is required');
      return;
    }

    try {
      localStorage.setItem('activeApiType', 'custom');
      localStorage.setItem('apiSettings', JSON.stringify(customSettings));
      alert('Custom settings saved successfully!');
    } catch (error) {
      setError('Failed to save settings');
      console.error('Save error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="fixed inset-0 bg-black -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient-xy"></div>
      </div>

      <main className="relative z-10 container mx-auto pt-20 pb-16 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-8">
            API Settings
          </h1>

          {/* Tabs */}
          <div className="border-b border-gray-800 mb-8">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    py-4 px-1 relative
                    ${activeTab === tab.id ? 'text-purple-500' : 'text-gray-400 hover:text-gray-300'}
                  `}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            {activeTab === 'claude' && (
              <div className="space-y-6">
                {/* Model Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    value={claudeSettings.model}
                    onChange={(e) => handleClaudeChange('model', e.target.value)}
                    className="w-full bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                    placeholder="Enter model name"
                  />
                </div>

                {/* Presets */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Presets
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {['claude-3-5-sonnet-20240260', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'].map((model) => (
                      <button
                        key={model}
                        onClick={() => handlePresetClick(model)}
                        className="px-4 py-2 text-sm text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        {model.includes('3-5-sonnet') ? '3.5 Sonnet' :
                         model.includes('haiku') ? '3 Haiku' :
                         model.includes('3-sonnet') ? '3 Sonnet' :
                         model.includes('opus') ? '3 Opus' : model}
                      </button>
                    ))}
                  </div>
                </div>

                {/* API Key Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Claude Key
                  </label>
                  <input
                    type="password"
                    value={claudeSettings.apiKey}
                    onChange={(e) => handleClaudeChange('apiKey', e.target.value)}
                    className="w-full bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                    placeholder="sk-XXXXXXXXXXXXXXXXXXXX"
                  />
                </div>

                {/* Custom Prompt Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Prompt
                  </label>
                  <textarea
                    value={claudeSettings.customPrompt}
                    onChange={(e) => handleClaudeChange('customPrompt', e.target.value)}
                    className="w-full h-32 bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 resize-none"
                    placeholder="Enter your custom prompt"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-red-500 text-sm">
                    {error}
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveClaudeSettings}
                    className="px-6 py-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'openai' && (
              <div className="space-y-6">
                {/* Model Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    value={openaiSettings.model}
                    onChange={(e) => handleOpenAIChange('model', e.target.value)}
                    className="w-full bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                    placeholder="Enter model name"
                  />
                </div>

                {/* Presets */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Presets
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-2024-04-09', 'gpt-4-turbo', 'gpt-4-1106-preview', 'gpt-4-32k', 'gpt-4o'].map((model) => (
                      <button
                        key={model}
                        onClick={() => handleOpenAIPresetClick(model)}
                        className="px-4 py-2 text-sm text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        {model === 'gpt-3.5-turbo' ? 'GPT-3.5 Turbo' :
                         model === 'gpt-4' ? 'GPT-4' :
                         model === 'gpt-4-turbo-2024-04-09' ? 'GPT-4 Turbo 2024-04-09' :
                         model === 'gpt-4-turbo' ? 'GPT-4 Turbo' :
                         model === 'gpt-4-1106-preview' ? 'GPT-4 1106 Preview' :
                         model === 'gpt-4-32k' ? 'GPT-4-32k' :
                         model === 'gpt-4o' ? 'GPT-4o' : model}
                      </button>
                    ))}
                  </div>
                </div>

                {/* API Key Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    OpenAI Key
                  </label>
                  <input
                    type="password"
                    value={openaiSettings.apiKey}
                    onChange={(e) => handleOpenAIChange('apiKey', e.target.value)}
                    className="w-full bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                    placeholder="sk-XXXXXXXXXXXXXXXXXXXX"
                  />
                </div>

                {/* Custom Prompt Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Prompt
                  </label>
                  <textarea
                    value={openaiSettings.customPrompt}
                    onChange={(e) => handleOpenAIChange('customPrompt', e.target.value)}
                    className="w-full h-32 bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 resize-none"
                    placeholder="Enter your custom prompt"
                  />
                </div>

                {/* OpenAI Information */}
                <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-300 space-y-4">
                    <span className="block">
                      Sign up at <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">platform.openai.com</a> and 
                      get this at <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">account/api-keys</a>. 
                      This key is only stored locally in your device and never sent to server.
                    </span>
                    <span className="block mt-4 text-yellow-400">
                      OpenAI is NOT FREE. They will give you $5 for trial (~500 messages), after that you need to pay OpenAI to use their API.
                    </span>
                    <span className="block mt-4">
                      If you see an error about quota or billing, it means you used up OpenAI free $5 credit. Go to 
                      <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 ml-1">account/billing</a> to 
                      update your billing information.
                    </span>
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-red-500 text-sm">
                    {error}
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveOpenAISettings}
                    className="px-6 py-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'custom' && (
              <div className="space-y-6">
                {/* Model Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    value={customSettings.model}
                    onChange={(e) => handleCustomChange('model', e.target.value)}
                    className="w-full bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                    placeholder="Enter model name"
                  />
                </div>

                {/* API URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API URL
                  </label>
                  <input
                    type="text"
                    value={customSettings.apiUrl}
                    onChange={(e) => handleCustomChange('apiUrl', e.target.value)}
                    className="w-full bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                    placeholder="Enter API URL"
                  />
                  <p className="mt-2 text-yellow-500 text-sm">
                    Warning: If you change this URL you must refresh the page before it will work.
                  </p>
                  <p className="mt-2 text-yellow-500 text-sm">
                    Warning: SkibidiAI has no affiliation with any proxies. Your IP and chat log might be logged depending on the proxy you use. Please ensure you trust the proxy service.
                  </p>
                </div>

                {/* API Key Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={customSettings.apiKey}
                    onChange={(e) => handleCustomChange('apiKey', e.target.value)}
                    className="w-full bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                    placeholder="sk-XXXXXXXXXXXXXXXXXXXX"
                  />
                  <p className="mt-2 text-gray-300 text-sm">
                    Key of the reverse proxy. Leave this empty if you don&apos;t know what it is.
                    <br />
                    <span className="text-red-400">DO NOT put your OpenAI API key here.</span>
                  </p>
                </div>

                {/* Custom Prompt Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Prompt
                  </label>
                  <textarea
                    value={customSettings.customPrompt}
                    onChange={(e) => handleCustomChange('customPrompt', e.target.value)}
                    className="w-full h-32 bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 resize-none"
                    placeholder="Enter your custom prompt"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-red-500 text-sm">
                    {error}
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveCustomSettings}
                    className="px-6 py-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer className="mt-auto" />
    </div>
  );
}