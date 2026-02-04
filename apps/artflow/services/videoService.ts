import { GoogleGenAI } from "@google/genai";
import { GeneratedImage } from "../types";
import { getApiKey } from "./geminiService";
import { VIDEO_MODEL_ID } from "../config/models";

export const generateVeoVideo = async (
  prompt: string,
  image: GeneratedImage,
  model: string = VIDEO_MODEL_ID
): Promise<{ videoUri: string; videoBlob: Blob }> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  let operation = await ai.models.generateVideos({
    model,
    prompt,
    image: { imageBytes: image.base64, mimeType: image.mimeType },
    config: { numberOfVideos: 1, resolution: "720p", aspectRatio: "9:16" }
  });

  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error("No video URI returned.");
  }

  const resp = await fetch(`${downloadLink}&key=${getApiKey()}`);
  const blob = await resp.blob();
  const uri = URL.createObjectURL(blob);
  return { videoUri: uri, videoBlob: blob };
};
