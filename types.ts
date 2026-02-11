export interface ArtStyle {
  id: string;
  name: string;
  prompt: string;
  icon: string;
}

export interface GeneratedResult {
  imageUrl: string;
  promptUsed: string;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GenerationError {
  message: string;
  details?: string;
}