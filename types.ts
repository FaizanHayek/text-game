
export interface ChatScreenshot {
  id: string;
  dataUrl: string;
  file: File;
}

export interface AnalysisResult {
  attractionScore: number;
  attractionFeedback: string;
  textingSkillScore: number;
  textingSkillFeedback: string;
  topTips: string[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  EDITING_IMAGE = 'EDITING_IMAGE',
  RESULTS = 'RESULTS'
}
