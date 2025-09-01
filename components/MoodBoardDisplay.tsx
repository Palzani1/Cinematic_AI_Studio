import React from 'react';
import { MoodBoardImage } from '../types';
import Button from './Button';

const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;


interface MoodBoardDisplayProps {
  images: MoodBoardImage[];
  onSave: () => void;
  saveStatus: 'idle' | 'saved';
}

const MoodBoardDisplay: React.FC<MoodBoardDisplayProps> = ({ images, onSave, saveStatus }) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-700/50 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-200">Visual Mood Board</h3>
        {saveStatus === 'saved' ? (
            <Button size="sm" variant="success" icon={<CheckIcon />} disabled>Saved!</Button>
        ) : (
            <Button onClick={onSave} size="sm" variant="secondary" icon={<SaveIcon />}>Save to Library</Button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="bg-gray-800/60 rounded-lg overflow-hidden group">
            <img
              src={image.url}
              alt={image.prompt}
              title={image.prompt}
              className="w-full h-full object-cover aspect-square transform group-hover:scale-110 transition-transform duration-300 ease-in-out"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodBoardDisplay;