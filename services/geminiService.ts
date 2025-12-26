import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeUrl = async (url: string): Promise<GeminiAnalysisResult> => {
  try {
    const model = "gemini-3-flash-preview";
    
    const prompt = `Analyze this URL string: "${url}". 
    I need you to categorize it, generate 3 relevant tags, and a very short 5-word summary of what this website likely contains based on the domain and path.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 relevant tags for the link"
            },
            summary: {
              type: Type.STRING,
              description: "A short 5-word summary"
            },
            category: {
              type: Type.STRING,
              description: "General category (e.g. Social, Tech, Shopping)"
            }
          },
          required: ["tags", "summary", "category"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as GeminiAnalysisResult;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Return fallback data if AI fails
    return {
      tags: ["Link"],
      summary: "External Website",
      category: "General"
    };
  }
};