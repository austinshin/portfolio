export interface GeneratedImage {
  base64: string;
  mimeType: string;
}

export interface EtsyMetadata {
  title: string;
  description: string;
  tags: string[];
  price?: string;
  quantity?: number;
}

export interface EtsyConfig {
  shopId: string;
  apiKey: string;
  accessToken: string;
  shopName?: string;
}

export interface ProjectHistoryItem {
  id: string;
  timestamp: number;
  originalPrompt: string;
  referenceImage?: GeneratedImage | null;
  referenceImageId?: string | null;
  image?: GeneratedImage;
  imageId?: string | null;
  videoUri: string | null;
  videoPrompt: string;
  thumbnails?: GeneratedImage[];
  thumbnailIds?: string[];
  metadata: EtsyMetadata | null;
  etsyListingId?: string;
}

export enum WorkflowStep {
  PROMPT = 0,
  IMAGE = 1,
  VIDEO = 2,
  THUMBNAILS = 3,
  FINALIZE = 4
}
