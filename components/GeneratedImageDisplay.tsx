import React from 'react';
import { GeneratedImage } from '../types';

interface GeneratedImageDisplayProps {
  image: GeneratedImage;
}

const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({ image }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <img
        src={image.url}
        alt={image.prompt}
        className="w-full h-auto object-cover rounded-md aspect-video"
      />
      <p className="mt-3 text-xs text-gray-400 italic truncate" title={image.prompt}>
        Prompt: {image.prompt}
      </p>
    </div>
  );
};

export default GeneratedImageDisplay;
