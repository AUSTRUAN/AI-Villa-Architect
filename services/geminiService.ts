
import { GoogleGenAI } from "@google/genai";
import { VillaConfig, Season } from "../types";

// Using Nano Banana (Gemini 2.5 Flash Image) as requested
const MODEL_NAME = 'gemini-2.5-flash-image';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a single villa image based on configuration.
 * We will call this multiple times to generate 4 variations.
 * @param config User configuration
 * @param variationIndex Index (0-3) to create distinct variations
 */
export const generateVillaImage = async (config: VillaConfig, variationIndex: number = 0): Promise<string> => {
  // Define distinct approaches for each variation to ensure diversity
  const approaches = [
    "Design Approach: Classic & Balanced. Focus on symmetry, standard proportions, and a formal presentation of the style.",
    "Design Approach: Creative & Asymmetrical. Experiment with unique volume distribution, dynamic rooflines, or bold structural elements while keeping the style.",
    "Design Approach: Nature-Integrated. Emphasize large windows, terraces, and how the building blends with lush landscaping. Open and airy feel.",
    "Design Approach: Material & Texture Focus. Highlight high-contrast materials, dramatic lighting, and intricate architectural details. A more luxury/artistic interpretation."
  ];

  const specificApproach = approaches[variationIndex % approaches.length];

  let prompt = `Design a realistic standalone villa. 
  Architecture Style: ${config.style}. 
  Number of floors: ${config.floors}. 
  Footprint Area: ${config.area} square meters. 
  View: Eye-level exterior architectural photography. 
  Lighting: Natural daylight. 
  Quality: High resolution, photorealistic, 8k.
  ${specificApproach}
  Ensure this design looks significantly different from a standard generic output.`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parts: any[] = [];

  if (config.referenceImage) {
    const cleanBase64 = config.referenceImage.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg', // Assuming standard image upload
        data: cleanBase64
      }
    });
    prompt += " Please use the attached image as a loose visual reference for the general vibe, but strictly apply the requested Architecture Style and the specific Design Approach described above. Do not just copy the image.";
  }

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts
      }
    });

    return extractImageFromResponse(response);
  } catch (error) {
    console.error("Error generating villa:", error);
    throw error;
  }
};

/**
 * Modifies an existing villa image to match a specific season.
 */
export const modifyVillaSeason = async (base64Image: string, season: Season): Promise<string> => {
  // Remove data:image/png;base64, prefix if present for the API call payload
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  const prompt = `Keep the architecture of the house exactly the same. Change the environment, weather, foliage, and lighting to look like ${season}. Photorealistic.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          { text: prompt }
        ]
      }
    });

    return extractImageFromResponse(response);
  } catch (error) {
    console.error("Error modifying season:", error);
    throw error;
  }
};

/**
 * Helper to extract base64 image from the response structure.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractImageFromResponse = (response: any): string => {
  if (!response.candidates || response.candidates.length === 0) {
    throw new Error("No candidates returned from Gemini");
  }

  const parts = response.candidates[0].content.parts;
  let base64Data = "";

  for (const part of parts) {
    if (part.inlineData) {
      base64Data = part.inlineData.data;
      break;
    }
  }

  if (!base64Data) {
    throw new Error("No image data found in response");
  }

  return `data:image/jpeg;base64,${base64Data}`;
};
