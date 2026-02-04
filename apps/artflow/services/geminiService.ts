import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedImage, EtsyMetadata } from "../types";
import { recordUsage } from "./usageStore";
import { DEFAULT_IMAGE_MODEL } from "../config/models";

export const getApiKey = () => {
  const apiKey =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("session_gemini_api_key") ||
        window.localStorage.getItem("local_gemini_api_key")
      : null;
  if (!apiKey) {
    throw new Error("Missing API key. Please paste your key to continue.");
  }
  return apiKey;
};

const getClient = () => {
  return new GoogleGenAI({ apiKey: getApiKey() });
};

export const MOCKUP_SCENARIOS = [
  "Place this exact artwork inside a simple black frame on a clean, solid white background.",
  "Place this exact artwork inside a black frame hanging on a wall behind a stylish couch in a modern, bright living room.",
  "Show this exact artwork printed on a large canvas leaning on the floor in front of a wooden table in a minimalist studio.",
  "Place this exact artwork on a wall. Add a warm desk lamp on the side, creating soft shadows and cozy light decor around the frame."
];

export const generateArtImage = async (
  prompt: string,
  referenceImage?: GeneratedImage | null,
  model: string = DEFAULT_IMAGE_MODEL
): Promise<GeneratedImage> => {
  const ai = getClient();
  const modelId = model.trim() || DEFAULT_IMAGE_MODEL;
  const parts: any[] = [];
  if (referenceImage) {
    parts.push({
      inlineData: {
        mimeType: referenceImage.mimeType,
        data: referenceImage.base64
      }
    });
  }
  parts.push({ text: `Generate a single image. ${prompt}` });

  const response = await ai.models.generateContent({
    model: modelId,
    contents: [{ role: "user", parts }],
    config: {
      responseModalities: ["Image"]
    }
  });
  recordUsage(modelId, response.usageMetadata);

  const firstCandidate = response.candidates?.[0];
  const part = firstCandidate?.content?.parts?.find(p => p.inlineData);
  if (!part || !part.inlineData) throw new Error("No image generated.");

  return {
    base64: part.inlineData.data,
    mimeType: part.inlineData.mimeType || 'image/png'
  };
};

export const generateThumbnailImages = async (baseImage: GeneratedImage): Promise<GeneratedImage[]> => {
  const ai = getClient();
  const results: GeneratedImage[] = [];

  for (const scenario of MOCKUP_SCENARIOS) {
    const response = await ai.models.generateContent({
      model: DEFAULT_IMAGE_MODEL,
      contents: [{
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: baseImage.mimeType,
              data: baseImage.base64
            }
          },
          { text: `Generate a single image. ${scenario}` }
        ]
      }],
      config: {
        responseModalities: ["Image"]
      }
    });
    recordUsage(DEFAULT_IMAGE_MODEL, response.usageMetadata);

    const firstCandidate = response.candidates?.[0];
    const part = firstCandidate?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData) {
      results.push({
        base64: part.inlineData.data,
        mimeType: part.inlineData.mimeType || 'image/png'
      });
    }
  }

  return results;
};

export const generateEtsyMetadata = async (image: GeneratedImage, originalPrompt: string): Promise<EtsyMetadata> => {
  const ai = getClient();
  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      tags: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["title", "description", "tags"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: image.mimeType, data: image.base64 } },
        { text: `Based on this image and the original prompt "${originalPrompt}", generate Etsy listing metadata.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });
  recordUsage("gemini-3-flash-preview", response.usageMetadata);

  const text = response.text;
  if (!text) throw new Error("No metadata generated");
  return JSON.parse(text) as EtsyMetadata;
};
