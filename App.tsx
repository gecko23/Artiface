import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptSelector } from './components/PromptSelector';
import { generateArtFromImage } from './services/geminiService';
import { AppState, GenerationError } from './types';
import { Loader2, Download, RefreshCcw, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<GenerationError | null>(null);

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;

    setAppState(AppState.GENERATING);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateArtFromImage(selectedImage, prompt);
      setGeneratedImage(result);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      setAppState(AppState.ERROR);
      setError({ message: err.message || 'Something went wrong during generation.' });
    }
  };

  const reset = () => {
    setAppState(AppState.IDLE);
    setGeneratedImage(null);
    setError(null);
    // Keep the selected image for easy retry with different prompt
  };

  const fullReset = () => {
    reset();
    setSelectedImage(null);
    setPrompt('');
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-secondary/30">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Intro Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-secondary mb-4">
            Digitize Your Reality
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Upload a selfie or photo and use Gemini AI to transform it into incredible digital art.
            From Cyberpunk to Classical Oil Painting.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Controls */}
          <div className="space-y-8">
            <div className="bg-surface/30 backdrop-blur-sm p-6 rounded-3xl border border-surface/50 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-bold border border-primary/50">1</span>
                Input Image
              </h2>
              <ImageUploader
                selectedImage={selectedImage}
                onImageSelected={(img) => {
                  setSelectedImage(img);
                  setAppState(AppState.IDLE);
                  setGeneratedImage(null);
                }}
                onClear={fullReset}
                disabled={appState === AppState.GENERATING}
              />
            </div>

            <div className="bg-surface/30 backdrop-blur-sm p-6 rounded-3xl border border-surface/50 shadow-xl">
               <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/20 text-secondary text-sm font-bold border border-secondary/50">2</span>
                Style Prompt
              </h2>
              <PromptSelector 
                prompt={prompt} 
                setPrompt={setPrompt} 
                disabled={appState === AppState.GENERATING}
              />

              <button
                onClick={handleGenerate}
                disabled={!selectedImage || !prompt || appState === AppState.GENERATING}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                  ${!selectedImage || !prompt 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:scale-[1.01] active:scale-[0.99] text-white'
                  }`}
              >
                {appState === AppState.GENERATING ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Transforming...
                  </>
                ) : (
                  <>
                    <span className="text-xl">✨</span> Generate Art
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="relative">
             <div className="bg-surface/30 backdrop-blur-sm p-6 rounded-3xl border border-surface/50 shadow-xl min-h-[500px] flex flex-col">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400 text-sm font-bold border border-green-500/50">3</span>
                  Result
                </h2>
                
                <div className="flex-1 flex items-center justify-center bg-black/40 rounded-2xl border-2 border-dashed border-surface overflow-hidden relative group">
                  
                  {appState === AppState.IDLE && !generatedImage && (
                    <div className="text-center text-gray-500 p-8">
                      <div className="text-6xl mb-4 grayscale opacity-30">🎨</div>
                      <p>Your masterpiece will appear here</p>
                    </div>
                  )}

                  {appState === AppState.GENERATING && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">AI</div>
                      </div>
                      <p className="mt-4 text-primary font-medium animate-pulse">Dreaming up pixels...</p>
                    </div>
                  )}

                  {appState === AppState.ERROR && (
                    <div className="text-center p-8 max-w-md">
                      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2">Generation Failed</h3>
                      <p className="text-red-300 text-sm mb-6">{error?.message}</p>
                      <button 
                        onClick={handleGenerate}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {generatedImage && (
                    <div className="relative w-full h-full min-h-[400px]">
                      <img 
                        src={generatedImage} 
                        alt="Generated Art" 
                        className="w-full h-full object-contain animate-[fadeIn_0.5s_ease-out]" 
                      />
                      
                      {/* Overlay Actions */}
                      <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a 
                          href={generatedImage} 
                          download={`artiface-${Date.now()}.png`}
                          className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors shadow-lg flex items-center gap-2 px-6 font-medium"
                        >
                          <Download className="w-5 h-5" />
                          Save
                        </a>
                         <button 
                          onClick={reset}
                          className="p-3 bg-white/10 text-white backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-colors shadow-lg"
                          title="Generate New"
                        >
                          <RefreshCcw className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;