
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeConversations = async (images: string[]): Promise<AnalysisResult> => {
  const ai = getAIClient();
  
  const imageParts = images.map(dataUrl => ({
    inlineData: {
      mimeType: "image/png",
      data: dataUrl.split(',')[1],
    },
  }));

  const prompt = `
    You are an expert in modern relationship psychology and behavioral attraction heuristics, specifically for Gen-Z dating culture.
    Analyze the provided screenshots of a chat conversation between a guy and a girl.
    
    CRITICAL ANALYSIS REQUIREMENTS:
    1. Perform extremely detailed OCR: track message sequencing, response timing (gaps between messages), message length balance (who is texting more?), and punctuation/emoji usage.
    2. Analyze sentiment shifts, humor markers, flirtation signals, mirroring behavior, and conversational reciprocity.
    3. Evaluate 'Texting Skills' for the guy: Look for confidence, calibration, wit, seduction, EQ, and avoidance of overinvestment/neediness.
    4. Estimate the 'Attraction Level' of the girl: Look for engagement, curiosity, warmth, teasing, and validation.
    
    The response MUST be a valid JSON object.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [...imageParts, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          attractionScore: { type: Type.NUMBER, description: "Attraction level from 0 to 10" },
          attractionFeedback: { type: Type.STRING, description: "Insightful paragraph about the girl's attraction" },
          textingSkillScore: { type: Type.NUMBER, description: "Guy's texting skill from 0 to 10" },
          textingSkillFeedback: { type: Type.STRING, description: "Feedback on the guy's performance" },
          topTips: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "3 short tips for improvement"
          },
        },
        required: ["attractionScore", "attractionFeedback", "textingSkillScore", "textingSkillFeedback", "topTips"]
      }
    }
  });

  return JSON.parse(response.text.trim()) as AnalysisResult;
};

export const editImageWithAI = async (imageDataUrl: string, prompt: string): Promise<string> => {
  const ai = getAIClient();
  const base64Data = imageDataUrl.split(',')[1];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/png',
          },
        },
        { text: prompt },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No image data returned from Gemini");
};
