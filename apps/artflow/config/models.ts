export const DEFAULT_VIDEO_PROMPT =
  "video of a watercolour drawing timelapse with asian male hand. the art itself should not move. only the hand showing the colouring process.";

export const DEFAULT_IMAGE_MODEL = "gemini-2.5-flash-image";

export const VIDEO_MODEL_ID = "veo-3.1-fast-generate-preview";

export const IMAGE_MODEL_PRESETS = [
  { id: DEFAULT_IMAGE_MODEL, label: "Nano Banana" },
  { id: "gemini-3-pro-image-preview", label: "Nano Banana Pro (Gemini 3)" }
];

export const MODEL_PRICING_PER_1M = {
  "gemini-2.5-flash-image": { input: 0.3, output: 30.0, outputLabel: "image tokens" },
  "gemini-3-pro-image-preview": { input: 2.0, output: 120.0, outputLabel: "image tokens" },
  "gemini-3-flash-preview": { input: 0.5, output: 3.0, outputLabel: "tokens" }
} as const;
