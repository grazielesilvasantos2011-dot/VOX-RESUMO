export interface TranscriptionSegment {
  speaker: string;
  timestamp: string;
  text: string;
}

export interface AIResponseData {
  title: string;
  language: string;
  topics: string[];
  summary_short: string;
  summary_detailed: string;
  key_points: string[];
  transcript: TranscriptionSegment[];
}

export interface Project {
  id: string;
  name: string;
  type: 'meeting' | 'class' | 'podcast' | 'interview' | 'other';
  createdAt: string;
  status: 'processing' | 'completed' | 'error';
  originalFileName: string;
  durationSeconds?: number; // Added to store the duration in seconds
  data?: AIResponseData;
}

export enum PlanType {
  PAY_PER_FILE = 'PAY_PER_FILE',
  MONTHLY = 'MONTHLY',
  LIFETIME = 'LIFETIME',
}

export type UserPlanType = 'free' | 'pro' | 'unauthenticated';

export interface PricingTier {
  title: string;
  price: string;
  period?: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}

// New interface for daily usage tracking
export interface DailyUsageEntry {
  projectId: string; // Link to the project
  taskType: Project['type'];
  durationSeconds: number;
  timestamp: string; // ISO string
}