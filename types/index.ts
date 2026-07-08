export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  duration: string;
  points: string[];
}

export interface ProjectEntry {
  name: string;
  description: string;
  stars?: number;
  url?: string;
}

export interface CVData {
  personal: PersonalInfo;
  summary: string;
  experience: ExperienceEntry[];
  skills: string[];
  projects: ProjectEntry[];
}

export interface ChecklistItem {
  text: string;
  checked: boolean;
}

export interface ATSResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  checklist: ChecklistItem[];
  recommendations: string[];
}

export interface GenerationResponse {
  cv: CVData;
  ats: ATSResult;
}
