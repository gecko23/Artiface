import React, { useState, useRef } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { fileToBase64, resizeImage } from '../utils/imageUtils';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  selectedImage: string | null;
  onClear: () => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  selectedImage,
  onClear,
  disabled
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const resized = await resizeImage(base64);
      onImageSelected(resized);
    } catch (err) {
      console.error("Error processing file", err);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  if (selectedImage) {
    return (
      <div className="relative group w-full h-64 md:h-96 rounded-2xl overflow-hidden border-2 border-primary/50 bg-black">
        <img 
          src={selectedImage} 
          alt="Selected" 
          className="w-full h-full object-contain" 
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={onClear}
            disabled={disabled}
            className="p-3 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-transform hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">Original</div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative w-full h-64 md:h-96 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4
        ${isDragging 
          ? 'border-secondary bg-secondary/10' 
          : 'border-surface bg-surface/50 hover:border-primary/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="flex flex-col items-center text-center p-6 gap-4">
        <div className="p-4 rounded-full bg-surface shadow-lg">
          <Upload className={`w-8 h-8 ${isDragging ? 'text-secondary' : 'text-primary'}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Upload your photo</h3>
          <p className="text-sm text-gray-400 mt-1">Drag & drop or click to browse</p>
        </div>
        
        <div className="flex gap-3 mt-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-colors border border-primary/50"
          >
            Choose File
          </button>
          
          <button 
            onClick={() => cameraInputRef.current?.click()}
            disabled={disabled}
            className="px-4 py-2 bg-secondary/20 hover:bg-secondary/30 text-secondary rounded-lg text-sm font-medium transition-colors border border-secondary/50 flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Camera
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="user"
        className="hidden"
      />
    </div>
  );
};