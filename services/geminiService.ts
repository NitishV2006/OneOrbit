
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from '../types';

// The API key is expected to be available in the environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const model = 'gemini-2.5-flash';

export const parseReflectionGoals = async (reflectionText: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `You are an assistant for a productivity app called OneOrbit. A user has written a weekly reflection. Your task is to extract up to 3 actionable goals for the upcoming week from their reflection. These goals should be concise and formatted as tasks.

User reflection:
"""
${reflectionText}
"""

Please identify the key goals and return them.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            goals: {
              type: Type.ARRAY,
              description: "A list of up to 3 actionable goals extracted from the reflection.",
              items: {
                type: Type.STRING,
                description: "A single, concise goal."
              }
            }
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    
    if (parsed && Array.isArray(parsed.goals)) {
        return parsed.goals;
    }

    return [];
  } catch (error) {
    console.error("Error parsing reflection goals with Gemini:", error);
    // Fallback to return empty array on error
    return [];
  }
};

export const analyzeTask = async (taskTitle: string): Promise<{ category: Task['category']; priority: Task['priority']; duration: number; } | null> => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `You are an intelligent task assistant for a productivity app called OneOrbit. A user has entered a task title. Your job is to analyze it and suggest a category, priority, and estimated duration in minutes.

Task Title: "${taskTitle}"

Analyze the task and provide the most logical suggestions based on the content. The duration should be a reasonable estimate in minutes.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "The category of the task.",
              enum: ['Study', 'Work', 'Personal', 'Fitness'],
            },
            priority: {
              type: Type.STRING,
              description: "The priority of the task.",
              enum: ['Low', 'Medium', 'High'],
            },
            duration: {
              type: Type.INTEGER,
              description: "The estimated duration of the task in minutes."
            }
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    
    if (parsed && parsed.category && parsed.priority && parsed.duration) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.error("Error analyzing task with Gemini:", error);
    return null;
  }
};
