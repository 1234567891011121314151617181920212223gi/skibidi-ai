export const uploadToCloudinary = async (file, formData) => {
  const uploadData = new FormData();
  uploadData.append('file', file);
  uploadData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  
  // Format name for public_id
  const formattedName = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  uploadData.append('public_id', formattedName);

  // Helper function to clean only HTML and preserve readable text
  const cleanText = (text, maxLength = 950) => {
    if (!text) return '';
    
    let cleaned = text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/{{char}}/g, '') // Remove template tags
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();
    
    // Only encode the pipe character since it's used as a delimiter
    cleaned = cleaned.replace(/\|/g, '_');
    
    return cleaned.substring(0, maxLength);
  };

  // Format context data with preserved text
  const contextStr = [
    `name=${formData.name || ''}`,
    `bio=${cleanText(formData.bio)}`,
    `scenario=${cleanText(formData.scenario)}`,
    `personality=${cleanText(formData.personality)}`,
    `first_message=${cleanText(formData.firstMessage)}`,
    `example_dialogs=${cleanText(formData.exampleDialogs)}`
  ].join('|');

  // Add context as a string of pipe-separated key=value pairs
  uploadData.append('context', contextStr);
  
  // Add tags as comma-separated string
  if (formData.tags?.length > 0) {
    uploadData.append('tags', formData.tags.join(','));
  }

  try {
    console.log('Uploading to Cloudinary...'); // Debug log
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: uploadData
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload error details:', errorText);
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const saveCharacterData = async (characterData) => {
  // Upload character data as JSON metadata
  const jsonStr = JSON.stringify(characterData);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const dataFile = new File([blob], 'character-data.json');

  const formData = new FormData();
  formData.append('file', dataFile);
  formData.append('upload_preset', 'testingPreset');
  formData.append('folder', 'character-data');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/db67mmqu0/raw/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) throw new Error('Failed to save character data');
    return await response.json();
  } catch (error) {
    console.error('Save error:', error);
    throw error;
  }
};