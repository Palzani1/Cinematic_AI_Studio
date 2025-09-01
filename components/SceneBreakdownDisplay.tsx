import React from 'react';
import { Scene } from '../types';

interface SceneBreakdownDisplayProps {
  scenes: Scene[];
}

const SceneBreakdownDisplay: React.FC<SceneBreakdownDisplayProps> = ({ scenes }) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-700/50 space-y-6">
      <h3 className="text-2xl font-bold text-gray-200">Scene Breakdown</h3>
      <div className="space-y-4">
        {scenes.map((scene) => (
          <div key={scene.sceneNumber} className="bg-gray-800/60 border border-gray-700 p-4 rounded-lg shadow-md transition-all hover:border-sky-500/50 hover:bg-gray-800">
            <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
              <h4 className="font-bold text-gray-200 uppercase tracking-wider text-sm">{scene.location}</h4>
              <span className="text-xs font-mono bg-gray-900 text-sky-400 px-2 py-1 rounded">SCENE {scene.sceneNumber}</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">{scene.summary}</p>
            {scene.characters.length > 0 && (
              <div className="text-xs text-gray-400 border-t border-gray-700 pt-2">
                <span className="font-semibold">Characters:</span> {scene.characters.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SceneBreakdownDisplay;
