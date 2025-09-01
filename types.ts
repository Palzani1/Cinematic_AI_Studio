export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  // Other types of chunks can be added here if needed
}

export interface Scene {
  sceneNumber: number;
  location: string;
  characters: string[];
  summary: string;
}

// New type for a character profile that includes an image
export interface CharacterProfile {
  text: string;
  imageUrl: string;
}

// Type for a single image within a mood board
export interface MoodBoardImage {
  id: string;
  url: string;
  prompt: string;
}


// New types for the Library/Filing System
export interface SavedItem {
  id: string;
  name: string;
  createdAt: string;
}

export interface SavedStoryline extends SavedItem {
  content: string;
}

export interface SavedImageSet extends SavedItem {
  content: GeneratedImage[];
}

export interface SavedProfile extends SavedItem {
    content: CharacterProfile;
}

export interface SavedMoodBoard extends SavedItem {
  content: MoodBoardImage[];
  sourceStoryline: string; // Keep track of the source
}

/**
 * A structured error object for user-friendly display.
 */
export interface FriendlyError {
  title: string;
  technicalMessage: string;
  remedy: string; // Will use newline characters for steps
}