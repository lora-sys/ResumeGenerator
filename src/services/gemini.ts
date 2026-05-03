import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateResumeContent(userInput: string, currentData?: ResumeData): Promise<ResumeData> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      You are a professional resume writer. Based on the user's input, extract and refine their professional information into a structured format.
      If info is missing, use sensible placeholders or leave blank.
      
      User Input: "${userInput}"
      ${currentData ? `Current Data: ${JSON.stringify(currentData)}` : ''}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          personalInfo: {
            type: Type.OBJECT,
            properties: {
              fullName: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              location: { type: Type.STRING },
              website: { type: Type.STRING },
              linkedin: { type: Type.STRING },
              github: { type: Type.STRING },
            },
            required: ["fullName", "email", "phone", "location"],
          },
          summary: { type: Type.STRING },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                position: { type: Type.STRING },
                location: { type: Type.STRING },
                duration: { type: Type.STRING },
                description: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                institution: { type: Type.STRING },
                degree: { type: Type.STRING },
                location: { type: Type.STRING },
                duration: { type: Type.STRING },
                description: { type: Type.STRING },
              },
            },
          },
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                items: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
          },
          projects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                link: { type: Type.STRING },
              },
            },
          },
        },
      },
    },
  });

  return JSON.parse(response.text);
}

export async function generateLaTeXCode(data: ResumeData, templateId: string, language: 'zh' | 'en' = 'en'): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Generate high-quality, professional LaTeX source code for a ${language === 'zh' ? 'Chinese' : 'English'} resume.
      
      Data: ${JSON.stringify(data)}
      Template Style: "${templateId}"
      Target Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}

      CRITICAL REQUIREMENTS:
      1. TRANSLATION: If the source data is not in the target language (${language}), TRANSLATE all content (job titles, descriptions, skills) into ${language === 'zh' ? 'Chinese' : 'English'} while maintaining professional terminology.
      2. COMPILATION: The code MUST be compatible with XeLaTeX.
      3. TYPESETTING:
         ${language === 'zh' ? `
         - Add \\usepackage{xeCJK}
         - Set font: \\setCJKmainfont{Noto Serif CJK SC} or similar.
         - Use professional Chinese section titles (e.g., 工作经历, 教育背景, 个人项目).
         ` : `
         - Use professional English fonts: \\usepackage{charter} or \\usepackage{libertine}.
         - Standard English headings (Experience, Education, Projects).
         `}
      4. PHOTO: If data.personalInfo.photo exists, include it in the header using \\usepackage{graphicx}.
      5. LAYOUT: Use 'geometry' for margins and 'titlesec' for clean headings with horizontal rules.
      6. OUTPUT: Return ONLY the raw LaTeX code starting with \\documentclass. No markdown wrappers.
    `,
  });

  return response.text.replace(/```latex\n?|```/g, '').trim();
}
