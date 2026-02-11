import React from 'react';
import { ArtStyle } from '../types';
import { Wand2 } from 'lucide-react';

const PRESET_STYLES: ArtStyle[] = [
  { id: 'cyberpunk', name: 'Cyberpunk', prompt: 'Turn this into a futuristic cyberpunk character with neon lights, high tech visor, rainy night city background, highly detailed digital art', icon: '🤖' },
  { id: 'oil', name: 'Oil Painting', prompt: 'Transform this into a classical oil painting in the style of Van Gogh, thick brush strokes, vibrant colors, expressive texture', icon: '🎨' },
  { id: 'pixel', name: 'Pixel Art', prompt: 'Convert this image into 16-bit retro pixel art, arcade game style, limited color palette, clean pixels', icon: '👾' },
  { id: 'anime', name: 'Anime', prompt: 'Turn this into a high quality anime character, Studio Ghibli style, vibrant colors, clean lines, beautiful lighting', icon: '🍜' },
  { id: 'sculpture', name: 'Marble Statue', prompt: 'Turn this into a classic greek marble statue, museum lighting, smooth stone texture, detailed carving', icon: '🗿' },
  { id: 'sketch', name: 'Pencil Sketch', prompt: 'Convert to a rough graphite pencil sketch on paper, charcoal textures, cross-hatching shading', icon: '✏️' },
  { id: 'clay', name: 'Claymation', prompt: 'Transform into a cute claymation figure, plasticine texture, stop-motion look, soft lighting', icon: '🧱' },
  { id: 'horror', name: 'Eldritch', prompt: 'Make it a dark eldritch horror art, lovecraftian, dark green and black tones, mysterious fog, scary', icon: '🐙' },
];

interface PromptSelectorProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const PromptSelector: React.FC<PromptSelectorProps> = ({ prompt, setPrompt, disabled }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Wand2 className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-semibold text-white">Choose a Style or Describe Custom</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PRESET_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => setPrompt(style.prompt)}
            disabled={disabled}
            className={`p-3 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] 
              ${prompt === style.prompt 
                ? 'border-secondary bg-secondary/20 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                : 'border-surface bg-surface/50 hover:border-primary/50 text-gray-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-2xl mb-1">{style.icon}</div>
            <div className="text-sm font-medium">{style.name}</div>
          </button>
        ))}
      </div>

      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe how you want to change the image..."
          disabled={disabled}
          className="w-full h-24 bg-surface/50 border border-surface rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-colors"
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-500">
          Be specific for best results
        </div>
      </div>
    </div>
  );
};