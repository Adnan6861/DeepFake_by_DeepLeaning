export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Researcher' | 'Supervisor' | 'Examiner';
  institution: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface FrameAnalysis {
  frameNumber: number;
  timestamp: string;
  fakeProbability: number; // 0.0 - 1.0
  isFake: boolean;
  boundingBox: { x: number; y: number; width: number; height: number };
  detectedArtifacts: string[];
  gradCamRegion: {
    cx: number;
    cy: number;
    radius: number;
    intensity: number;
    description: string;
  };
  sampleImage: string;
}

export interface AnalysisResult {
  id: string;
  fileName: string;
  fileSizeMb: number;
  fileType: string;
  analyzedAt: string;
  durationSeconds: number;
  totalFrames: number;
  detectedFaces: number;
  processingTimeSec: number;
  verdict: 'DEEPFAKE' | 'AUTHENTIC' | 'SUSPICIOUS';
  confidenceScore: number; // 0 - 100 percentage
  overallFakeProbability: number; // 0.0 - 1.0
  backboneUsed: string;
  faceDetectorUsed: string;
  frames: FrameAnalysis[];
  summaryNote: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}
