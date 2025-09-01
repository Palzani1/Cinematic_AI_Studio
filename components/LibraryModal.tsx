import React, { useState, useMemo } from 'react';
import { SavedStoryline, SavedImageSet, SavedProfile, SavedItem, SavedMoodBoard } from '../types';
import Button from './Button';

// Icons
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const LoadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const SortAscIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" /></svg>;
const SortDescIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25.75L17.25 9m0 0L21 12.75M17.25 9v12" /></svg>;


type Tab = 'storylines' | 'imageSets' | 'profiles' | 'moodBoards';
type SortKey = 'name' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  storylines: SavedStoryline[];
  imageSets: SavedImageSet[];
  profiles: SavedProfile[];
  moodBoards: SavedMoodBoard[];
  onLoadStoryline: (storyline: SavedStoryline) => void;
  onLoadImageSet: (imageSet: SavedImageSet) => void;
  onLoadProfile: (profile: SavedProfile) => void;
  onLoadMoodBoard: (moodBoard: SavedMoodBoard) => void;
  onDeleteStoryline: (id: string) => void;
  onDeleteImageSet: (id: string) => void;
  onDeleteProfile: (id: string) => void;
  onDeleteMoodBoard: (id: string) => void;
  onClearAll: () => void;
}

const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen, onClose, storylines, imageSets, profiles, moodBoards,
  onLoadStoryline, onLoadImageSet, onLoadProfile, onLoadMoodBoard,
  onDeleteStoryline, onDeleteImageSet, onDeleteProfile, onDeleteMoodBoard, onClearAll
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('storylines');
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortAndFilter = <T extends SavedItem>(items: T[]): T[] => {
    return items
      .sort((a, b) => {
        let comparison = 0;
        if (sortKey === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else { // createdAt
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      })
      .filter(item => item.name.toLowerCase().includes(filter.toLowerCase()));
  };
  
  const sortedAndFilteredStorylines = useMemo(() => sortAndFilter(storylines), [storylines, filter, sortKey, sortDirection]);
  const sortedAndFilteredImageSets = useMemo(() => sortAndFilter(imageSets), [imageSets, filter, sortKey, sortDirection]);
  const sortedAndFilteredProfiles = useMemo(() => sortAndFilter(profiles), [profiles, filter, sortKey, sortDirection]);
  const sortedAndFilteredMoodBoards = useMemo(() => sortAndFilter(moodBoards), [moodBoards, filter, sortKey, sortDirection]);

  const hasData = storylines.length > 0 || imageSets.length > 0 || profiles.length > 0 || moodBoards.length > 0;

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'storylines':
        return sortedAndFilteredStorylines.length > 0 ? (
          sortedAndFilteredStorylines.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
              <div>
                <p className="font-semibold text-gray-200">{item.name}</p>
                <p className="text-xs text-gray-400">Saved on {new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => onLoadStoryline(item)} size="sm" variant="primary" icon={<LoadIcon />} title="Load" />
                <Button onClick={() => onDeleteStoryline(item.id)} size="sm" variant="danger" icon={<DeleteIcon />} title="Delete" />
              </div>
            </div>
          ))
        ) : <p className="text-center text-gray-500 italic">No storylines found.</p>;
      
      case 'imageSets':
        return sortedAndFilteredImageSets.length > 0 ? (
          sortedAndFilteredImageSets.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
              <div>
                <p className="font-semibold text-gray-200">{item.name}</p>
                <p className="text-xs text-gray-400">Saved on {new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => onLoadImageSet(item)} size="sm" variant="primary" icon={<LoadIcon />} title="Load" />
                <Button onClick={() => onDeleteImageSet(item.id)} size="sm" variant="danger" icon={<DeleteIcon />} title="Delete" />
              </div>
            </div>
          ))
        ) : <p className="text-center text-gray-500 italic">No image sets found.</p>;

      case 'profiles':
        return sortedAndFilteredProfiles.length > 0 ? (
            sortedAndFilteredProfiles.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg gap-4">
              <img 
                src={item.content.imageUrl} 
                alt={item.name}
                className="w-16 h-20 object-cover rounded-md flex-shrink-0 bg-gray-700"
              />
              <div className="flex-grow min-w-0">
                <p className="font-semibold text-gray-200 truncate" title={item.name}>{item.name}</p>
                <p className="text-xs text-gray-400">Saved on {new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button onClick={() => onLoadProfile(item)} size="sm" variant="primary" icon={<LoadIcon />} title="Load" />
                <Button onClick={() => onDeleteProfile(item.id)} size="sm" variant="danger" icon={<DeleteIcon />} title="Delete" />
              </div>
            </div>
          ))
        ) : <p className="text-center text-gray-500 italic">No profiles found.</p>;
      case 'moodBoards':
        return sortedAndFilteredMoodBoards.length > 0 ? (
            sortedAndFilteredMoodBoards.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg gap-4">
               <img 
                src={item.content[0]?.url} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md flex-shrink-0 bg-gray-700"
              />
              <div className="flex-grow min-w-0">
                <p className="font-semibold text-gray-200 truncate" title={item.name}>{item.name}</p>
                <p className="text-xs text-gray-400">Saved on {new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button onClick={() => onLoadMoodBoard(item)} size="sm" variant="primary" icon={<LoadIcon />} title="Load" />
                <Button onClick={() => onDeleteMoodBoard(item.id)} size="sm" variant="danger" icon={<DeleteIcon />} title="Delete" />
              </div>
            </div>
          ))
        ) : <p className="text-center text-gray-500 italic">No mood boards found.</p>;
      default:
        return null;
    }
  };

  const SortButton = ({ value, label }: { value: SortKey, label: string }) => (
    <button
      onClick={() => setSortKey(value)}
      className={`px-3 py-1 text-xs rounded-md ${sortKey === value ? 'bg-sky-600 text-white font-semibold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
    >
      {label}
    </button>
  );

  const DirectionButton = ({ value, children }: { value: SortDirection, children: React.ReactNode }) => (
     <button
      onClick={() => setSortDirection(value)}
      className={`px-2 py-1 rounded-md ${sortDirection === value ? 'bg-sky-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-gray-100">Library</h2>
          <Button onClick={onClose} variant="secondary" size="sm"><CloseIcon /></Button>
        </header>

        <div className="p-4 border-b border-gray-700">
            <div className="flex border-b border-gray-600 mb-4 overflow-x-auto">
              <button onClick={() => {setActiveTab('storylines'); setFilter('');}} className={`px-4 py-2 text-sm font-semibold shrink-0 ${activeTab === 'storylines' ? 'border-b-2 border-sky-400 text-sky-400' : 'text-gray-400 hover:text-white'}`}>Storylines ({storylines.length})</button>
              <button onClick={() => {setActiveTab('moodBoards'); setFilter('');}} className={`px-4 py-2 text-sm font-semibold shrink-0 ${activeTab === 'moodBoards' ? 'border-b-2 border-sky-400 text-sky-400' : 'text-gray-400 hover:text-white'}`}>Mood Boards ({moodBoards.length})</button>
              <button onClick={() => {setActiveTab('imageSets'); setFilter('');}} className={`px-4 py-2 text-sm font-semibold shrink-0 ${activeTab === 'imageSets' ? 'border-b-2 border-sky-400 text-sky-400' : 'text-gray-400 hover:text-white'}`}>Image Sets ({imageSets.length})</button>
              <button onClick={() => {setActiveTab('profiles'); setFilter('');}} className={`px-4 py-2 text-sm font-semibold shrink-0 ${activeTab === 'profiles' ? 'border-b-2 border-sky-400 text-sky-400' : 'text-gray-400 hover:text-white'}`}>Profiles ({profiles.length})</button>
            </div>
            <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter by name..."
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-sky-500"
            />
            <div className="flex justify-between items-center mt-3 text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium">Sort by:</span>
                    <SortButton value="createdAt" label="Date" />
                    <SortButton value="name" label="Name" />
                </div>
                 <div className="flex items-center gap-2">
                    <DirectionButton value="asc">
                        {sortKey === 'name' ? 'A-Z' : 'Oldest'}
                    </DirectionButton>
                     <DirectionButton value="desc">
                        {sortKey === 'name' ? 'Z-A' : 'Newest'}
                    </DirectionButton>
                </div>
            </div>
        </div>

        <main className="p-4 overflow-y-auto space-y-3">
          {renderTabContent()}
        </main>
        
        <footer className="p-4 mt-auto border-t border-gray-700">
            <Button onClick={onClearAll} variant="danger" size="sm" disabled={!hasData}>
                Clear All Library Data
            </Button>
        </footer>
      </div>
    </div>
  );
};

export default LibraryModal;