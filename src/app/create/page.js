"use client";
import Navbar from '@/components/Navbar';
import { useEffect, useState } from "react";
import { auth, storage, db } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import RichTextEditor from '@/components/RichTextEditor';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { uploadImage } from '@/utils/upload';
import { cloudinaryConfig } from '@/lib/cloudinary';
import { uploadToCloudinary, saveCharacterData } from '@/utils/cloudinary';

export default function CreatePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: '',          
    chatName: '',      
    bio: '',           
    tags: [],
    personality: '',
    scenario: '',
    firstMessage: '',
    exampleDialogs: ''
  });
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const characterTags = [
    'Male', 'Female',
    'Magic', 'Sci-Fi', 'Fantasy',
    'Enemies to Lovers', 'Friends to Lovers',
    'Demi-Human', 'Villain', 'Hero'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('File must be JPEG, PNG, GIF, or WebP');
        return;
      }

      setSelectedImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage || !formData.name || !formData.chatName) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const result = await uploadToCloudinary(selectedImage, formData);
      
      if (result.secure_url) {
        alert('Character created successfully!');
        // Navigate back to home page
        router.push('/');
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create character");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-8">
            Create a Character
          </h1>

          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-800">
            <div className="space-y-6">
              {/* Image Upload Area */}
              <div className="relative">
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
                  {previewUrl ? (
                    <div className="relative w-full aspect-square">
                      <Image
                        src={previewUrl}
                        alt="Character preview"
                        fill
                        className="object-contain rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setPreviewUrl(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                          />
                        </svg>
                      </div>
                      <div className="text-gray-400">
                        <label htmlFor="image-upload" className="cursor-pointer hover:text-purple-500 transition-colors">
                          Click to upload
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <p>or drag and drop</p>
                        <p className="text-sm">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Character Form */}
              <div className="space-y-6 mt-8">
                <div>
                  <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                    Character Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Provide a unique name for your character"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 border border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="chatName" className="block text-white text-sm font-medium mb-2">
                    Character Chat Name <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="chatName"
                    name="chatName"
                    value={formData.chatName}
                    onChange={handleInputChange}
                    placeholder="Nickname for chats and LLM interactions"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 border border-gray-600"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-white text-sm font-medium mb-2">
                    Character Bio
                  </label>
                  <RichTextEditor
                    content={formData.bio}
                    onChange={(newContent) => {
                      setFormData(prev => ({
                        ...prev,
                        bio: newContent
                      }));
                    }}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="tags" className="block text-white text-sm font-medium mb-2">
                    Character Tags
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsTagsOpen(!isTagsOpen)}  
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 text-left text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 border border-gray-600 flex justify-between items-center"
                  >
                    <span className="flex flex-wrap gap-1">
                      {formData.tags.length > 0 ? (
                        formData.tags.map(tag => (
                          <span 
                            key={tag}
                            className="bg-purple-500/30 px-2 py-0.5 rounded-md text-sm"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">Select tags...</span>
                      )}
                    </span>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${isTagsOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isTagsOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2 space-y-1">
                        {characterTags.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                              formData.tags.includes(tag)
                                ? 'bg-purple-500/30 text-white'
                                : 'text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            <span className="flex items-center">
                              <span className={`w-4 h-4 mr-2 border rounded ${
                                formData.tags.includes(tag)
                                  ? 'bg-purple-500 border-purple-500'
                                  : 'border-gray-500'
                              }`}>
                                {formData.tags.includes(tag) && (
                                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24">
                                    <path
                                      fill="currentColor"
                                      d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
                                    />
                                  </svg>
                                )}
                              </span>
                              {tag}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h3 className="text-yellow-500 font-semibold mb-2">Guidelines</h3>
                <p className="text-gray-400 text-sm">
                  Please make sure your image/character does not violate our guidelines:
                </p>
                <ul className="text-gray-400 text-sm list-disc list-inside mt-2 space-y-1">
                  <li>No explicit or inappropriate content</li>
                  <li>No copyrighted material without permission</li>
                  <li>No hate speech or offensive imagery</li>
                  <li>Maximum file size: 10MB</li>
                </ul>
                <p className="text-yellow-500/80 text-sm mt-2">
                  Images that violate these guidelines will be removed.
                </p>
              </div>

              <div className="space-y-6 mt-8">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  Configuration
                </h2>
                
                <div>
                  <label htmlFor="personality" className="block text-white text-sm font-medium mb-2">
                    Personality
                  </label>
                  <textarea
                    id="personality"
                    name="personality"
                    value={formData.personality}
                    onChange={handleInputChange}
                    placeholder="Describe the character's persona here. This will help define how the character interacts with others."
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 border border-gray-600 resize-none"
                  />
                </div>
              
                <div>
                  <label htmlFor="scenario" className="block text-white text-sm font-medium mb-2">
                    Scenario
                  </label>
                  <textarea
                    id="scenario"
                    name="scenario"
                    value={formData.scenario}
                    onChange={handleInputChange}
                    placeholder="The current circumstances and context of the conversation and the characters."
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 border border-gray-600 resize-none"
                  />
                </div>
              
                <div>
                  <label htmlFor="firstMessage" className="block text-white text-sm font-medium mb-2">
                    Initial Message (First Message)
                  </label>
                  <textarea
                    id="firstMessage"
                    name="firstMessage"
                    value={formData.firstMessage}
                    onChange={handleInputChange}
                    placeholder="The first message from your character. Make it engaging and lengthy to encourage longer interactions."
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 border border-gray-600 resize-none"
                  />
                </div>
              
                <div>
                  <label htmlFor="exampleDialogs" className="block text-white text-sm font-medium mb-2">
                    Example Dialogs
                  </label>
                  <textarea
                    id="exampleDialogs"
                    name="exampleDialogs"
                    value={formData.exampleDialogs}
                    onChange={handleInputChange}
                    placeholder="Provide example conversations to help define your character's speaking style and responses. This section is very important for teaching your characters how they should speak."
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 border border-gray-600 resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !user}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg 
                  hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                  focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Character'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}