
import { GoogleGenAI, Type } from "@google/genai";
import type { AppIdea } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeProjectContent(content: string): Promise<string> {
  const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following project files and provide a concise, one-paragraph summary of its purpose, overall architecture, and key functionalities. The project structure is represented by file paths and their contents below:\n\n${content}`,
      config: {
          temperature: 0.2,
          maxOutputTokens: 2048,
          thinkingConfig: { thinkingBudget: 0 }
      }
  });

  return result.text;
}

export async function generateAppIdeas(analysis: string): Promise<AppIdea[]> {
  const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following analysis of an existing application's code, generate 3 innovative and distinct new application ideas. For each idea, provide a catchy title, a short description (2-3 sentences), a list of 3-4 key features, and suggest a simple icon name from this list: 'lightbulb', 'rocket', 'code', 'chart', 'connect'. \n\nAnalysis:\n"${analysis}"`,
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.ARRAY,
              items: {
                  type: Type.OBJECT,
                  properties: {
                      title: {
                          type: Type.STRING,
                          description: 'The catchy name of the new application idea.'
                      },
                      description: {
                          type: Type.STRING,
                          description: 'A brief, engaging description of the app concept.'
                      },
                      features: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                          description: 'A list of key features for the application.'
                      },
                      icon: {
                          type: Type.STRING,
                          description: 'An icon name from the provided list.'
                      }
                  },
                  required: ['title', 'description', 'features', 'icon']
              }
          }
      }
  });
  
  const jsonText = result.text.trim();
  try {
      const ideas = JSON.parse(jsonText);
      return ideas as AppIdea[];
  } catch (e) {
      console.error("Failed to parse JSON response from Gemini:", jsonText);
      throw new Error("Received an invalid format for app ideas.");
  }
}
