import React, { useState } from 'react';
import Button from './Button';

// Icons
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const StoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-sky-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-sky-400"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-sky-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const ConnectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-sky-400"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>;

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    icon: <StoryIcon />,
    title: "1. Generate a Storyline",
    description: "Start with a simple idea, theme, or character concept. The AI will craft a complete cinematic narrative for you.",
  },
  {
    icon: <UserIcon />,
    title: "2. Create a Character",
    description: "Describe a character, and the AI will generate a detailed profile, including their backstory, motivations, and even a unique portrait.",
  },
  {
    icon: <ImageIcon />,
    title: "3. Visualize a Scene",
    description: "Write a prompt describing any scene you can imagine, and the AI will generate a stunning, high-quality cinematic image.",
  },
  {
    icon: <ConnectIcon />,
    title: "The Creative Workflow",
    description: "The real power is in combining these tools! Use an excerpt from your storyline as an image prompt, and include your saved characters to ensure visual consistency across your scenes.",
  },
];


const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const currentStep = tutorialSteps[step];
  const isLastStep = step === tutorialSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setStep(prev => prev + 1);
    }
  };
  
  const handlePrev = () => {
     setStep(prev => Math.max(0, prev - 1));
  };


  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-gray-100">Welcome to Cinematic Studio AI!</h2>
          <Button onClick={onClose} variant="secondary" size="sm"><CloseIcon /></Button>
        </header>

        <main className="p-6 text-center">
            <div className="mb-4 flex justify-center">{currentStep.icon}</div>
            <h3 className="text-2xl font-bold text-sky-300 mb-3">{currentStep.title}</h3>
            <p className="text-gray-300 leading-relaxed">{currentStep.description}</p>
        </main>
        
        <footer className="p-4 mt-auto border-t border-gray-700 flex justify-between items-center">
            <div className="flex gap-1">
                {tutorialSteps.map((_, index) => (
                    <div key={index} className={`w-2 h-2 rounded-full ${step === index ? 'bg-sky-400' : 'bg-gray-600'}`}></div>
                ))}
            </div>
            <div className="flex gap-3">
                {step > 0 && <Button onClick={handlePrev} variant="secondary">Previous</Button>}
                <Button onClick={handleNext} variant="primary">
                    {isLastStep ? "Start Creating" : "Next"}
                </Button>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default TutorialModal;