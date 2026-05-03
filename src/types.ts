/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    photo?: string; // Base64 or URL
  };
  summary: string;
  experience: {
    company: string;
    position: string;
    location: string;
    duration: string;
    description: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    location: string;
    duration: string;
    description?: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
}

export type TemplateId = 'modern' | 'classic' | 'minimalist';

export interface AppState {
  step: 'landing' | 'gathering' | 'editing';
  resumeData: ResumeData;
  selectedTemplate: TemplateId;
}

export const INITIAL_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
};
