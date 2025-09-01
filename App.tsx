import React, { useState, useCallback, useEffect } from 'react';
import { generateStoryline, generateImageFromPrompt, generateSceneBreakdown, generateCharacterProfile, extractAppearance, generateMoodBoard } from './services/geminiService';
import { parseApiError } from './services/errorService';
import { GeneratedImage, Scene, SavedStoryline, SavedImageSet, SavedProfile, CharacterProfile, FriendlyError, MoodBoardImage, SavedMoodBoard } from './types';
import { STORYLINE_STYLES } from './constants';
import Button from './components/Button';
import TextArea from './components/TextArea';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import GeneratedImageDisplay from './components/GeneratedImageDisplay';
import SectionCard from './components/SectionCard';
import SceneBreakdownDisplay from './components/SceneBreakdownDisplay';
import LibraryModal from './components/LibraryModal';
import TutorialModal from './components/TutorialModal';
import MoodBoardDisplay from './components/MoodBoardDisplay';

// Icons
const StoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const LibraryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const BreakdownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.5-15h15a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25-2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 014.5 4.5z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const MoodBoardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6A1.125 1.125 0 012.25 11.25v-4.125zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.375 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" /></svg>;

const App: React.FC = () => {
  // Generation State
  const [storylineQuery, setStorylineQuery] = useState<string>('');
  const [storylineStyle, setStorylineStyle] = useState<string>('cinematic');
  const [generatedStoryline, setGeneratedStoryline] = useState<string | null>(null);
  const [isStorylineLoading, setIsStorylineLoading] = useState<boolean>(false);
  const [storylineError, setStorylineError] = useState<FriendlyError | null>(null);

  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<FriendlyError | null>(null);

  const [sceneBreakdown, setSceneBreakdown] = useState<Scene[] | null>(null);
  const [isBreakdownLoading, setIsBreakdownLoading] = useState<boolean>(false);
  const [breakdownError, setBreakdownError] = useState<FriendlyError | null>(null);

  const [characterQuery, setCharacterQuery] = useState<string>('');
  const [generatedCharacterProfile, setGeneratedCharacterProfile] = useState<CharacterProfile | null>(null);
  const [isCharacterLoading, setIsCharacterLoading] = useState<boolean>(false);
  const [characterError, setCharacterError] = useState<FriendlyError | null>(null);

  const [moodBoard, setMoodBoard] = useState<MoodBoardImage[] | null>(null);
  const [isMoodBoardLoading, setIsMoodBoardLoading] = useState<boolean>(false);
  const [moodBoardError, setMoodBoardError] = useState<FriendlyError | null>(null);


  // Library/Storage State
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [savedStorylines, setSavedStorylines] = useState<SavedStoryline[]>([]);
  const [savedImageSets, setSavedImageSets] = useState<SavedImageSet[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [savedMoodBoards, setSavedMoodBoards] = useState<SavedMoodBoard[]>([]);
  
  // Tutorial State
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);

  // Save feedback state
  const [storylineSaveStatus, setStorylineSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [imagesSaveStatus, setImagesSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [profileSaveStatus, setProfileSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [moodBoardSaveStatus, setMoodBoardSaveStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    try {
      const storylines = localStorage.getItem('cinematicStudio_storylines');
      if (storylines) setSavedStorylines(JSON.parse(storylines));

      const imageSets = localStorage.getItem('cinematicStudio_imageSets');
      if (imageSets) setSavedImageSets(JSON.parse(imageSets));

      const profiles = localStorage.getItem('cinematicStudio_profiles');
      if (profiles) setSavedProfiles(JSON.parse(profiles));
      
      const moodBoards = localStorage.getItem('cinematicStudio_moodBoards');
      if (moodBoards) setSavedMoodBoards(JSON.parse(moodBoards));

      const tutorialSeen = localStorage.getItem('cinematicStudio_tutorialSeen');
      if (!tutorialSeen) {
        setIsTutorialOpen(true);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  const handleGenerateStoryline = useCallback(async () => {
    if (!storylineQuery.trim()) {
      setStorylineError({ title: "Input Required", remedy: "Please enter a concept, theme, or character idea into the text area before generating a storyline.", technicalMessage: "User input was empty."});
      return;
    }
    setIsStorylineLoading(true);
    setStorylineError(null);
    setGeneratedStoryline(null);
    setSceneBreakdown(null);
    setBreakdownError(null);
    setMoodBoard(null);
    setMoodBoardError(null);
    try {
      const styleInstruction = STORYLINE_STYLES[storylineStyle]?.instruction || STORYLINE_STYLES['cinematic'].instruction;
      const storyline = await generateStoryline(storylineQuery, styleInstruction);
      setGeneratedStoryline(storyline);
    } catch (err) {
      setStorylineError(parseApiError(err));
    } finally {
      setIsStorylineLoading(false);
    }
  }, [storylineQuery, storylineStyle]);

  const handleGenerateCharacterProfile = useCallback(async () => {
    if (!characterQuery.trim()) {
      setCharacterError({ title: "Input Required", remedy: "Please enter a concept for the character you want to generate.", technicalMessage: "User input was empty."});
      return;
    }
    setIsCharacterLoading(true);
    setCharacterError(null);
    setGeneratedCharacterProfile(null);
    try {
      const profile = await generateCharacterProfile(characterQuery);
      setGeneratedCharacterProfile(profile);
    } catch (err) {
      setCharacterError(parseApiError(err));
    } finally {
      setIsCharacterLoading(false);
    }
  }, [characterQuery]);

  const handleGenerateImage = useCallback(async () => {
    if (!imagePrompt.trim()) {
      setImageError({ title: "Input Required", remedy: "Please describe the scene you want to visualize in the text area.", technicalMessage: "User input was empty."});
      return;
    }

    let finalPrompt = imagePrompt;
    const characterTags = imagePrompt.match(/\[CHARACTER: (.*?)\]/g);

    if (characterTags) {
        characterTags.forEach(tag => {
            const characterName = tag.replace('[CHARACTER: ', '').replace(']', '').trim();
            const profile = savedProfiles.find(p => p.name === characterName);
            if (profile) {
                const appearance = extractAppearance(profile.content.text);
                const replacementText = `(A character described as: ${appearance})`;
                finalPrompt = finalPrompt.replace(tag, replacementText);
            }
        });
    }

    setIsImageLoading(true);
    setImageError(null);
    try {
      const imageUrl = await generateImageFromPrompt(finalPrompt);
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: imagePrompt, // Store original prompt for clarity
      };
      setGeneratedImages(prevImages => [newImage, ...prevImages].slice(0, 5));
    } catch (err) {
      setImageError(parseApiError(err));
    } finally {
      setIsImageLoading(false);
    }
  }, [imagePrompt, savedProfiles]);

  const handleUseStorylineForPrompt = useCallback(() => {
    if (generatedStoryline) {
      const storylineExcerpt = generatedStoryline.length > 200 
        ? generatedStoryline.substring(0, 200) + "..." 
        : generatedStoryline;
      setImagePrompt(`A cinematic scene based on: ${storylineExcerpt}`);
    }
  }, [generatedStoryline]);

  const handleClearImagePrompt = useCallback(() => {
    setImagePrompt('');
  }, []);

  const handleGenerateSceneBreakdown = useCallback(async () => {
    if (!generatedStoryline) return;
    setIsBreakdownLoading(true);
    setBreakdownError(null);
    setSceneBreakdown(null);
    try {
      const scenes = await generateSceneBreakdown(generatedStoryline);
      setSceneBreakdown(scenes);
    } catch (err) {
      setBreakdownError(parseApiError(err));
    } finally {
      setIsBreakdownLoading(false);
    }
  }, [generatedStoryline]);

  const handleGenerateMoodBoard = useCallback(async () => {
    if (!generatedStoryline) return;
    setIsMoodBoardLoading(true);
    setMoodBoardError(null);
    setMoodBoard(null);
    try {
      const images = await generateMoodBoard(generatedStoryline);
      setMoodBoard(images);
    } catch (err) {
      setMoodBoardError(parseApiError(err));
    } finally {
      setIsMoodBoardLoading(false);
    }
  }, [generatedStoryline]);

  // --- Library Handlers ---
  const handleSaveStoryline = useCallback(() => {
    if (!generatedStoryline) return;
    const name = window.prompt("Enter a name for this storyline:", `Storyline - ${new Date().toLocaleString()}`);
    if (name) {
      const newSavedStoryline: SavedStoryline = {
        id: Date.now().toString(),
        name,
        createdAt: new Date().toISOString(),
        content: generatedStoryline,
      };
      setSavedStorylines(prev => {
        const updated = [newSavedStoryline, ...prev];
        localStorage.setItem('cinematicStudio_storylines', JSON.stringify(updated));
        return updated;
      });
      setStorylineSaveStatus('saved');
      setTimeout(() => setStorylineSaveStatus('idle'), 2000);
    }
  }, [generatedStoryline]);

  const handleSaveImages = useCallback(() => {
    if (generatedImages.length === 0) return;
    const name = window.prompt("Enter a name for this image set:", `Images - ${new Date().toLocaleString()}`);
    if (name) {
      const newSavedImageSet: SavedImageSet = {
        id: Date.now().toString(),
        name,
        createdAt: new Date().toISOString(),
        content: generatedImages,
      };
      setSavedImageSets(prev => {
        const updated = [newSavedImageSet, ...prev];
        localStorage.setItem('cinematicStudio_imageSets', JSON.stringify(updated));
        return updated;
      });
      setImagesSaveStatus('saved');
      setTimeout(() => setImagesSaveStatus('idle'), 2000);
    }
  }, [generatedImages]);

  const handleSaveProfile = useCallback(() => {
    if (!generatedCharacterProfile) return;
    const name = window.prompt("Enter a name for this profile:", `Profile - ${new Date().toLocaleString()}`);
    if (name) {
      const newSavedProfile: SavedProfile = {
        id: Date.now().toString(),
        name,
        createdAt: new Date().toISOString(),
        content: generatedCharacterProfile,
      };
      setSavedProfiles(prev => {
        const updated = [newSavedProfile, ...prev];
        localStorage.setItem('cinematicStudio_profiles', JSON.stringify(updated));
        return updated;
      });
      setProfileSaveStatus('saved');
      setTimeout(() => setProfileSaveStatus('idle'), 2000);
    }
  }, [generatedCharacterProfile]);

  const handleSaveMoodBoard = useCallback(() => {
    if (!moodBoard || !generatedStoryline) return;
    const name = window.prompt("Enter a name for this mood board:", `Mood Board - ${new Date().toLocaleString()}`);
    if (name) {
      const newSavedMoodBoard: SavedMoodBoard = {
        id: Date.now().toString(),
        name,
        createdAt: new Date().toISOString(),
        content: moodBoard,
        sourceStoryline: generatedStoryline.substring(0, 100) + '...',
      };
      setSavedMoodBoards(prev => {
        const updated = [newSavedMoodBoard, ...prev];
        localStorage.setItem('cinematicStudio_moodBoards', JSON.stringify(updated));
        return updated;
      });
      setMoodBoardSaveStatus('saved');
      setTimeout(() => setMoodBoardSaveStatus('idle'), 2000);
    }
  }, [moodBoard, generatedStoryline]);

  const confirmOverwrite = () => {
    return window.confirm("Loading this will overwrite your current unsaved work. Are you sure?");
  };

  const handleLoadStoryline = useCallback((storyline: SavedStoryline) => {
    if (generatedStoryline && !confirmOverwrite()) return;
    setGeneratedStoryline(storyline.content);
    setStorylineQuery(`Loaded: ${storyline.name}`);
    setSceneBreakdown(null);
    setMoodBoard(null);
    setIsLibraryOpen(false);
  }, [generatedStoryline]);

  const handleLoadImageSet = useCallback((imageSet: SavedImageSet) => {
    if (generatedImages.length > 0 && !confirmOverwrite()) return;
    setGeneratedImages(imageSet.content);
    setImagePrompt(`Loaded: ${imageSet.name}`);
    setIsLibraryOpen(false);
  }, [generatedImages.length]);

  const handleLoadProfile = useCallback((profile: SavedProfile) => {
    if (generatedCharacterProfile && !confirmOverwrite()) return;
    setGeneratedCharacterProfile(profile.content);
    setCharacterQuery(`Loaded: ${profile.name}`);
    setIsLibraryOpen(false);
  }, [generatedCharacterProfile]);
  
  const handleLoadMoodBoard = useCallback((moodBoardToLoad: SavedMoodBoard) => {
    if (moodBoard && !confirmOverwrite()) return;
    setMoodBoard(moodBoardToLoad.content);
    setIsLibraryOpen(false);
  }, [moodBoard]);


  const handleDeleteStoryline = useCallback((id: string) => {
    if (!window.confirm("Are you sure you want to delete this storyline?")) return;
    setSavedStorylines(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('cinematicStudio_storylines', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleDeleteImageSet = useCallback((id: string) => {
    if (!window.confirm("Are you sure you want to delete this image set?")) return;
    setSavedImageSets(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('cinematicStudio_imageSets', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleDeleteProfile = useCallback((id: string) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;
    setSavedProfiles(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('cinematicStudio_profiles', JSON.stringify(updated));
      return updated;
    });
  }, []);
  
  const handleDeleteMoodBoard = useCallback((id: string) => {
    if (!window.confirm("Are you sure you want to delete this mood board?")) return;
    setSavedMoodBoards(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('cinematicStudio_moodBoards', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleClearAllData = useCallback(() => {
    if (window.confirm("Are you sure you want to delete ALL saved data from the Library? This action cannot be undone.")) {
      localStorage.removeItem('cinematicStudio_storylines');
      localStorage.removeItem('cinematicStudio_imageSets');
      localStorage.removeItem('cinematicStudio_profiles');
      localStorage.removeItem('cinematicStudio_moodBoards');
      setSavedStorylines([]);
      setSavedImageSets([]);
      setSavedProfiles([]);
      setSavedMoodBoards([]);
    }
  }, []);
  
  const handleCloseTutorial = () => {
    localStorage.setItem('cinematicStudio_tutorialSeen', 'true');
    setIsTutorialOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-gray-100 p-4 md:p-8 selection:bg-sky-500 selection:text-white">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-500">
              Cinematic Studio AI
            </span>
          </h1>
          <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
            Craft compelling narratives and visualize stunning scenes with the power of AI.
          </p>
        </header>

        <main className="container mx-auto max-w-5xl space-y-12">
          <div className="flex justify-center">
              <Button onClick={() => setIsLibraryOpen(true)} variant="primary" size="lg" icon={<LibraryIcon />}>
                Open Library
              </Button>
          </div>

          {/* Storyline Generation Section */}
          <SectionCard title="Storyline Generator" icon={<StoryIcon />}>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Select a Style:</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STORYLINE_STYLES).map(([key, style]) => (
                    <button
                      key={key}
                      onClick={() => setStorylineStyle(key)}
                      className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors duration-150 ease-in-out ${
                        storylineStyle === key
                          ? 'bg-sky-500 text-white shadow-md'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>
              <TextArea
                label="Enter your concept, theme, or character idea:"
                value={storylineQuery}
                onChange={(e) => setStorylineQuery(e.target.value)}
                placeholder="e.g., A lone astronaut discovers an ancient signal on a distant moon."
                rows={4}
                disabled={isStorylineLoading}
              />
              <Button
                onClick={handleGenerateStoryline}
                isLoading={isStorylineLoading}
                disabled={isStorylineLoading || !storylineQuery.trim()}
                className="w-full md:w-auto"
              >
                {isStorylineLoading ? 'Crafting Story...' : 'Generate Cinematic Storyline'}
              </Button>
              
              {storylineError && <ErrorMessage error={storylineError} />}
              
              {isStorylineLoading && !generatedStoryline && (
                <div className="pt-4">
                  <LoadingSpinner />
                  <p className="text-center text-sky-400 mt-2">Generating your epic tale...</p>
                </div>
              )}

              {generatedStoryline && (
                <div className="mt-6 p-6 bg-gray-800/50 border border-gray-700 rounded-lg shadow-inner">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold text-sky-300">Generated Storyline:</h3>
                    {storylineSaveStatus === 'saved' ? (
                      <Button size="sm" variant="success" icon={<CheckIcon />} disabled>Saved!</Button>
                    ) : (
                      <Button onClick={handleSaveStoryline} size="sm" variant="secondary" icon={<SaveIcon />}>Save to Library</Button>
                    )}
                  </div>
                  <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed font-sans bg-transparent border-none p-0">
                    {generatedStoryline}
                  </pre>

                  <div className="mt-6 pt-6 border-t border-gray-700/50 flex flex-wrap justify-center gap-4">
                    <Button 
                      onClick={handleGenerateSceneBreakdown} 
                      isLoading={isBreakdownLoading}
                      disabled={isBreakdownLoading}
                      variant="secondary" 
                      icon={<BreakdownIcon />}
                    >
                      {isBreakdownLoading ? 'Analyzing...' : 'Breakdown into Scenes'}
                    </Button>
                     <Button 
                      onClick={handleGenerateMoodBoard} 
                      isLoading={isMoodBoardLoading}
                      disabled={isMoodBoardLoading}
                      variant="secondary" 
                      icon={<MoodBoardIcon />}
                    >
                      {isMoodBoardLoading ? 'Curating...' : 'Generate Mood Board'}
                    </Button>
                  </div>
                  
                  {breakdownError && <div className="mt-4"><ErrorMessage error={breakdownError} /></div>}
                  {moodBoardError && <div className="mt-4"><ErrorMessage error={moodBoardError} /></div>}

                  {isBreakdownLoading && (
                    <div className="pt-6">
                      <LoadingSpinner />
                      <p className="text-center text-sky-400 mt-2">Breaking down the narrative...</p>
                    </div>
                  )}

                  {isMoodBoardLoading && (
                    <div className="pt-6">
                      <LoadingSpinner />
                      <p className="text-center text-sky-400 mt-2">Generating visual concepts...</p>
                    </div>
                  )}
                  
                  {moodBoard && <MoodBoardDisplay images={moodBoard} onSave={handleSaveMoodBoard} saveStatus={moodBoardSaveStatus} />}
                  {sceneBreakdown && <SceneBreakdownDisplay scenes={sceneBreakdown} />}
                </div>
              )}
            </div>
          </SectionCard>

          {/* Character Profile Generation Section */}
          <SectionCard title="Character Profile Generator" icon={<UserIcon />}>
            <div className="space-y-6">
              <TextArea
                label="Enter a character concept:"
                value={characterQuery}
                onChange={(e) => setCharacterQuery(e.target.value)}
                placeholder="e.g., A grizzled space detective haunted by a past case."
                rows={3}
                disabled={isCharacterLoading}
              />
              <Button
                onClick={handleGenerateCharacterProfile}
                isLoading={isCharacterLoading}
                disabled={isCharacterLoading || !characterQuery.trim()}
                className="w-full md:w-auto"
              >
                {isCharacterLoading ? 'Developing Character...' : 'Generate Profile'}
              </Button>
              
              {characterError && <ErrorMessage error={characterError} />}
              
              {isCharacterLoading && !generatedCharacterProfile && (
                  <div className="pt-4">
                    <LoadingSpinner />
                    <p className="text-center text-sky-400 mt-2">Fleshing out your character...</p>
                  </div>
              )}

              {generatedCharacterProfile && (
                <div className="mt-6 p-6 bg-gray-800/50 border border-gray-700 rounded-lg shadow-inner">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-sky-300">Generated Character Profile:</h3>
                     {profileSaveStatus === 'saved' ? (
                      <Button size="sm" variant="success" icon={<CheckIcon />} disabled>Saved!</Button>
                    ) : (
                      <Button onClick={handleSaveProfile} size="sm" variant="secondary" icon={<SaveIcon />}>Save to Library</Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 items-start">
                    <div className="w-full aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden">
                        <img 
                            src={generatedCharacterProfile.imageUrl} 
                            alt="Generated character portrait" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed font-sans bg-transparent border-none p-0 max-h-[400px] overflow-y-auto">
                        {generatedCharacterProfile.text}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>


          {/* Image Generation Section */}
          <SectionCard title="Cinematic Image Generator" icon={<ImageIcon />}>
            <div className="space-y-6">
              <TextArea
                label="Describe the scene you want to visualize:"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="e.g., A futuristic cityscape at dusk, neon lights reflecting on wet streets, a lone figure in a trench coat."
                rows={3}
                disabled={isImageLoading}
              />
               {savedProfiles.length > 0 && (
                <div className="pt-2">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Use a Saved Character:</h4>
                    <div className="flex flex-wrap gap-2">
                        {savedProfiles.map(p => (
                            <button 
                                key={p.id}
                                onClick={() => setImagePrompt(prev => `${prev} [CHARACTER: ${p.name}] `)}
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-1 px-3 rounded-full transition-transform hover:scale-105"
                                title={`Click to add ${p.name} to your prompt`}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleGenerateImage}
                  isLoading={isImageLoading}
                  disabled={isImageLoading || !imagePrompt.trim()}
                  className="w-full sm:w-auto flex-grow"
                >
                  {isImageLoading ? 'Visualizing Scene...' : 'Generate Cinematic Image'}
                </Button>
                {generatedStoryline && (
                  <Button
                    onClick={handleUseStorylineForPrompt}
                    variant="secondary"
                    disabled={isImageLoading}
                    className="w-full sm:w-auto"
                  >
                    Use Storyline Excerpt
                  </Button>
                )}
                {generatedImages.length > 0 && imagePrompt && (
                  <Button
                    onClick={handleClearImagePrompt}
                    variant="secondary"
                    className="w-full sm:w-auto"
                    title="Clear the image prompt"
                  >
                    Clear Prompt
                  </Button>
                )}
              </div>

              {imageError && <ErrorMessage error={imageError} />}
              
              {isImageLoading && generatedImages.length === 0 && (
                <div className="pt-4">
                  <LoadingSpinner />
                  <p className="text-center text-sky-400 mt-2">Conjuring your visual masterpiece...</p>
                </div>
              )}

              {generatedImages.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-sky-300">Generated Images:</h3>
                     {imagesSaveStatus === 'saved' ? (
                      <Button size="sm" variant="success" icon={<CheckIcon />} disabled>Saved!</Button>
                    ) : (
                      <Button onClick={handleSaveImages} size="sm" variant="secondary" icon={<SaveIcon />}>Save to Library</Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generatedImages.map((img) => (
                      <GeneratedImageDisplay key={img.id} image={img} />
                    ))}
                  </div>
                </div>
              )}
              {isImageLoading && generatedImages.length > 0 && (
                <div className="pt-4">
                  <LoadingSpinner />
                  <p className="text-center text-sky-400 mt-2">Adding new image...</p>
                </div>
              )}
            </div>
          </SectionCard>
        </main>

        <footer className="text-center py-12 mt-16 text-gray-500 text-sm">
          <p>Powered By Gemini and Cinematic Studio AI &copy; 2025</p>
        </footer>
      </div>
      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        storylines={savedStorylines}
        imageSets={savedImageSets}
        profiles={savedProfiles}
        moodBoards={savedMoodBoards}
        onLoadStoryline={handleLoadStoryline}
        onLoadImageSet={handleLoadImageSet}
        onLoadProfile={handleLoadProfile}
        onLoadMoodBoard={handleLoadMoodBoard}
        onDeleteStoryline={handleDeleteStoryline}
        onDeleteImageSet={handleDeleteImageSet}
        onDeleteProfile={handleDeleteProfile}
        onDeleteMoodBoard={handleDeleteMoodBoard}
        onClearAll={handleClearAllData}
      />
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={handleCloseTutorial}
      />
    </>
  );
};

export default App;