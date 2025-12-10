import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

// Initialize the client. We will do this lazily when we have a key.
const getClient = () => {
  if (!genAI && process.env.API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return genAI;
};

export const generateClassroomMap = async (promptOverride?: string): Promise<string | null> => {
  try {
    // If we are in the browser environment with the specialized key selection
    if (window.aistudio && window.aistudio.openSelectKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await window.aistudio.openSelectKey();
        }
        // Re-initialize to pick up the injected key
        genAI = new GoogleGenAI({ apiKey: process.env.API_KEY }); 
    } else {
        // Fallback for dev environments without the specific window tool
        const client = getClient();
        if (!client) return null;
    }

    // Double check client existence
    if (!genAI) {
        if(process.env.API_KEY) {
             genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
        } else {
            console.warn("No API Key available");
            return null;
        }
    }

    const prompt = promptOverride || "A cute, top-down view of a kindergarten classroom map for a board game. Light wooden floor, a colorful rug in the center, simple toy blocks, bright lighting. Vector art style, clean, high contrast. No text.";

    // Using the image generation model
    const response = await genAI.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
              aspectRatio: "1:1",
              imageSize: "1K" // High quality for the board
          },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    
    return null;

  } catch (error) {
    console.error("Failed to generate map:", error);
    return null;
  }
};