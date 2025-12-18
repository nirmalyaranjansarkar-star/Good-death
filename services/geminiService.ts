import { GoogleGenAI } from "@google/genai";
import { GroundingMetadata, LocationCoords } from "../types";

const SYSTEM_INSTRUCTION = `You are a compassionate, knowledgeable, and calm end-of-life planning assistant for "Good Death" (gooddeath.in). 
Your goal is to help users navigate death, dying, grief, and estate planning with dignity and clarity.
You provide accurate information about legal requirements (wills, advance directives), funeral planning, and emotional support.

Context:
- You are representing the "Good Death" organization.
- Since the domain is .in, prioritize Indian legal context (e.g., Living Wills in India, Indian Succession Act) if the user asks about laws, but remain adaptable to global users if they specify another location.
- Promote the concept of a "Good Death" — one that is planned, peaceful, and consistent with the person's values.

Tone Guidelines:
- Be empathetic but not overly sentimental.
- Be clear, practical, and direct.
- When users ask about locations (hospices, funeral homes, attorneys), you MUST use the googleMaps tool to provide real locations.
- When users ask about laws, recent medical news, or cultural practices, you MUST use the googleSearch tool to provide up-to-date facts.
- Always respect the user's cultural and religious context if provided.

If you use Google Maps or Search, the client application will render the sources automatically, so you can reference them naturally in the text.`;

export class GeminiService {
  private ai: GoogleGenAI;
  private modelId = 'gemini-2.5-flash';

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateResponse(
    prompt: string, 
    history: { role: 'user' | 'model'; parts: { text: string }[] }[],
    userLocation?: LocationCoords
  ): Promise<{ text: string; groundingMetadata?: GroundingMetadata }> {
    try {
      // Configure tools based on the prompt context, or just enable both for the model to choose.
      // For this app, we enable both Search and Maps to ensure comprehensive assistance.
      const tools: any[] = [
        { googleSearch: {} },
        { googleMaps: {} }
      ];

      const toolConfig: any = {};
      
      // If we have the user's location, pass it to the retrieval config for better Maps results
      if (userLocation) {
        toolConfig.retrievalConfig = {
          latLng: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          }
        };
      }

      const contents = [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ];

      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: contents as any, // Cast to any to avoid strict type conflicts with simple history structure
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: tools,
          toolConfig: Object.keys(toolConfig).length > 0 ? toolConfig : undefined,
          // We do NOT set responseMimeType to JSON because we want natural text with grounding
        },
      });

      const candidate = response.candidates?.[0];
      const text = candidate?.content?.parts?.map(p => p.text).join('') || "I'm sorry, I couldn't generate a response at this moment.";
      
      // Extract grounding metadata if it exists
      const groundingMetadata = candidate?.groundingMetadata as GroundingMetadata | undefined;

      return { text, groundingMetadata };

    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();