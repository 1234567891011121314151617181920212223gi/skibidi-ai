import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log('Checking Cloudinary credentials:', {
      hasCloudName: !!cloudName,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret
    });

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Missing Cloudinary credentials');
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`;
    const authorization = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    const searchResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authorization}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Search for images in both root and character-data folder
        expression: 'resource_type:image AND (folder="" OR folder:character-data)'
      })
    });

    console.log('Search URL:', url);
    console.log('Search Status:', searchResponse.status);

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('Cloudinary API Error:', {
        status: searchResponse.status,
        body: errorText
      });
      throw new Error(`Cloudinary API error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    console.log('Found resources:', searchData.resources?.length);

    const characters = searchData.resources.map(resource => ({
      name: resource.filename,  // Use filename instead of public_id
      imageUrl: resource.secure_url,
      bio: resource.context?.custom?.bio || '',
      tags: resource.tags || []
    }));

    return NextResponse.json({
      success: true,
      characters
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}