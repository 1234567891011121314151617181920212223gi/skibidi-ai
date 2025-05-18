export const getCharacterData = async (characterName) => {
  try {
    const characters = JSON.parse(localStorage.getItem('characters') || '[]');
    const character = characters.find(c => c.chatName === characterName);
    
    if (!character) {
      throw new Error('Character not found');
    }

    // Fetch the full character data from Cloudinary
    const response = await fetch(character.dataUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch character data');
    }

    const characterData = await response.json();
    return characterData;

  } catch (error) {
    console.error('Error fetching character:', error);
    throw error;
  }
};