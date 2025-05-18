import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const characterName = decodeURIComponent(params.name)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');

    console.log('Searching for character:', characterName);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload/${characterName}`;
    const authorization = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${authorization}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Cloudinary Error Status:', response.status);
      const errorText = await response.text();
      console.error('Cloudinary Error:', errorText);
      throw new Error('Failed to fetch character');
    }

    const resource = await response.json();
    console.log('Raw Cloudinary Response:', resource);

    // Get the context values from the metadata
    const contextMetadata = resource.context?.custom || {};
    console.log('Context Metadata:', contextMetadata);

    // Clean up bio text by removing HTML tags
    const cleanBio = contextMetadata.bio?.replace(/<\/?[^>]+(>|$)/g, '') || '';

    // Use original character name format from form data
    const originalName = contextMetadata.name || characterName;

    const character = {
      name: contextMetadata.originalName || characterName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '), // Fallback to formatted URL name
      urlName: characterName, // Keep URL-friendly version
      imageUrl: resource.secure_url,
      bio: cleanBio,
      scenario: contextMetadata.scenario || '',
      personality: contextMetadata.personality || '',
      firstMessage: contextMetadata.first_message || '',
      exampleDialogs: contextMetadata.example_dialogs || '',
      tags: resource.tags || []
    };

    console.log('Final Character Data:', character);

    return NextResponse.json({
      success: true,
      character
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false, 
      error: error.message
    }, { status: 500 });
  }
}