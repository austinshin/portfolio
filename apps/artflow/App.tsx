import React, { useState, useEffect, useMemo } from 'react';
import JSZip from "jszip";
import { ApiKeyModal } from './components/ApiKeyModal';
import { StepIndicator } from './components/StepIndicator';
import { HistoryPanel } from './components/HistoryPanel';
import { UsagePanel } from './components/UsagePanel';
import { PromptStep } from './components/steps/PromptStep';
import { ImageStep } from './components/steps/ImageStep';
import { VideoStep } from './components/steps/VideoStep';
import { ThumbnailsStep } from './components/steps/ThumbnailsStep';
import { FinalizeStep } from './components/steps/FinalizeStep';
import { GeneratedImage, EtsyMetadata, WorkflowStep, ProjectHistoryItem, EtsyConfig } from './types';
import { generateArtImage, generateEtsyMetadata, generateThumbnailImages, MOCKUP_SCENARIOS } from './services/geminiService';
import { uploadToEtsy } from './services/etsyService';
import { readUsage, resetUsage, recordVideoGeneration } from './services/usageStore';
import type { UsageState } from './services/usageStore';
import { generateVeoVideo } from './services/videoService';
import { DEFAULT_IMAGE_MODEL, DEFAULT_VIDEO_PROMPT, IMAGE_MODEL_PRESETS, VIDEO_MODEL_ID } from './config/models';
import { clearImageStore, deleteImages, getImage, getImages, saveImage, saveImages } from './services/imageStore';
import { useGeneration } from './hooks/useGeneration';

export default function App() {
  const [isKeyReady, setIsKeyReady] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(WorkflowStep.PROMPT);
  const [showConfig, setShowConfig] = useState(false);
  const [isFullImageModalOpen, setIsFullImageModalOpen] = useState(false);
  
  const [etsyConfig, setEtsyConfig] = useState<EtsyConfig>(() => {
    const saved = localStorage.getItem('etsy_config');
    return saved ? JSON.parse(saved) : { shopId: '', apiKey: '', accessToken: '', shopName: '' };
  });

  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<GeneratedImage | null>(null);
  const [referenceImageId, setReferenceImageId] = useState<string | null>(null);
  const [videoPrompt, setVideoPrompt] = useState(DEFAULT_VIDEO_PROMPT);
  const [imageModel, setImageModel] = useState(() => {
    const saved = localStorage.getItem("image_model");
    return saved || DEFAULT_IMAGE_MODEL;
  });
  const [favoriteModelId, setFavoriteModelId] = useState<string | null>(() => {
    return localStorage.getItem("favorite_model_id");
  });
  const [customModelPresets, setCustomModelPresets] = useState<{ id: string; label: string }[]>(() => {
    const saved = localStorage.getItem("custom_model_presets");
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  const [promptLibrary, setPromptLibrary] = useState<{ id: string; name: string; text: string }[]>(() => {
    const saved = localStorage.getItem("prompt_library");
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  const [usage, setUsage] = useState<UsageState>(() => readUsage());
  const [imageModelMode, setImageModelMode] = useState<"preset" | "custom">(() => {
    const saved = localStorage.getItem("image_model");
    if (!saved) return "preset";
    const baseIds = IMAGE_MODEL_PRESETS.map(preset => preset.id);
    const customIds = customModelPresets.map(preset => preset.id);
    return baseIds.concat(customIds).includes(saved) ? "preset" : "custom";
  });
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [thumbnails, setThumbnails] = useState<GeneratedImage[]>([]);
  const [thumbnailIds, setThumbnailIds] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<EtsyMetadata | null>(null);
  const [batchSize, setBatchSize] = useState(1);
  const [variations, setVariations] = useState<GeneratedImage[]>([]);
  const [variationIds, setVariationIds] = useState<string[]>([]);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number | null>(null);
  const [variationProjectIds, setVariationProjectIds] = useState<string[]>([]);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);
  const [variationModalIndex, setVariationModalIndex] = useState(0);
  
  const [history, setHistory] = useState<ProjectHistoryItem[]>([]);
  
  const { isProcessing, error, setError, run } = useGeneration();

  const unlockedSteps = useMemo(() => {
    const steps = new Set<WorkflowStep>();
    steps.add(WorkflowStep.PROMPT);
    if (prompt.trim()) steps.add(WorkflowStep.IMAGE);
    if (image) {
      steps.add(WorkflowStep.VIDEO);
      steps.add(WorkflowStep.THUMBNAILS);
    }
    if (metadata) steps.add(WorkflowStep.FINALIZE);
    return steps;
  }, [prompt, image, metadata]);

  useEffect(() => {
    localStorage.setItem('etsy_config', JSON.stringify(etsyConfig));
  }, [etsyConfig]);

  useEffect(() => {
    localStorage.setItem("image_model", imageModel);
  }, [imageModel]);

  useEffect(() => {
    if (favoriteModelId) {
      localStorage.setItem("favorite_model_id", favoriteModelId);
    } else {
      localStorage.removeItem("favorite_model_id");
    }
  }, [favoriteModelId]);

  useEffect(() => {
    localStorage.setItem("custom_model_presets", JSON.stringify(customModelPresets));
  }, [customModelPresets]);

  useEffect(() => {
    localStorage.setItem("prompt_library", JSON.stringify(promptLibrary));
  }, [promptLibrary]);

  useEffect(() => {
    return () => {
      if (videoUri) {
        URL.revokeObjectURL(videoUri);
      }
    };
  }, [videoUri]);

  const refreshUsage = () => {
    setUsage(readUsage());
  };

  const evaluateTagWarnings = (tags: string[]) => {
    const warnings: string[] = [];
    if (tags.length > 13) warnings.push("Etsy allows up to 13 tags.");
    if (tags.some((tag) => tag.length > 20)) warnings.push("Tags must be 20 characters or fewer.");
    if (tags.some((tag) => tag.trim().length < 2)) warnings.push("Some tags are too short.");
    return warnings;
  };

  const evaluatePromptWarnings = (text: string) => {
    const warnings: string[] = [];
    if (!text.trim()) warnings.push("Prompt is empty.");
    if (text.trim().length < 10) warnings.push("Prompt is very short; results may be poor.");
    return warnings;
  };

  useEffect(() => {
    const warnings = [
      ...evaluatePromptWarnings(prompt),
      ...(metadata ? evaluateTagWarnings(metadata.tags) : [])
    ];
    setValidationWarnings(warnings);
  }, [prompt, metadata]);

  const handleDeleteProject = async (item: ProjectHistoryItem) => {
    const idsToDelete = [
      item.imageId,
      item.referenceImageId,
      ...(item.thumbnailIds || [])
    ].filter(Boolean) as string[];
    if (idsToDelete.length > 0) {
      await deleteImages(idsToDelete);
    }
    setHistory((prev) => prev.filter((entry) => entry.id !== item.id));
    if (currentProjectId === item.id) {
      reset();
    }
  };

  const handlePurgeCache = async () => {
    await clearImageStore();
    setHistory((prev) =>
      prev.map((item) => ({
        ...item,
        image: undefined,
        referenceImage: undefined,
        thumbnails: undefined,
        imageId: null,
        referenceImageId: null,
        thumbnailIds: []
      }))
    );
  };

  const combinedModelPresets = [
    ...IMAGE_MODEL_PRESETS,
    ...customModelPresets.map((preset) => ({ ...preset, isCustom: true }))
  ];

  const handleAddModelPreset = (name: string, id: string) => {
    if (combinedModelPresets.some((preset) => preset.id === id)) return;
    setCustomModelPresets((prev) => [...prev, { id, label: name }]);
  };

  const handleRemoveModelPreset = (id: string) => {
    setCustomModelPresets((prev) => prev.filter((preset) => preset.id !== id));
    if (imageModel === id) {
      setImageModel(DEFAULT_IMAGE_MODEL);
      setImageModelMode("preset");
    }
    if (favoriteModelId === id) {
      setFavoriteModelId(null);
    }
  };

  const handleSavePromptTemplate = (name: string) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    setPromptLibrary((prev) => [{ id, name, text: prompt }, ...prev]);
  };

  const handleLoadPromptTemplate = (id: string) => {
    const template = promptLibrary.find((item) => item.id === id);
    if (template) setPrompt(template.text);
  };

  const handleDeletePromptTemplate = (id: string) => {
    setPromptLibrary((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleFavoriteModel = (modelId: string) => {
    if (!modelId) return;
    setFavoriteModelId((prev) => (prev === modelId ? null : modelId));
  };

  const handleUseFavoriteModel = () => {
    if (!favoriteModelId) return;
    setImageModel(favoriteModelId);
    setImageModelMode("preset");
  };

  const optimizeTags = (tags: string[]) => {
    const cleaned = tags
      .map((tag) => tag.trim())
      .filter((tag) => tag.length >= 3)
      .map((tag) => (tag.length > 20 ? tag.slice(0, 20) : tag))
      .filter((tag) => tag.length > 0);
    const deduped = Array.from(new Set(cleaned.map((tag) => tag.toLowerCase()))).map((tag) =>
      cleaned.find((t) => t.toLowerCase() === tag) || tag
    );
    return deduped.slice(0, 13);
  };

  const stripHistoryForStorage = (item: ProjectHistoryItem) => ({
    ...item,
    image: undefined,
    referenceImage: undefined,
    thumbnails: undefined,
    videoUri: null
  });

  useEffect(() => {
    const historyToSave = history.map(stripHistoryForStorage);
    try {
      localStorage.setItem('artflow_history', JSON.stringify(historyToSave));
    } catch (e) {
      console.warn("History storage limit reached.");
    }
  }, [history]);

  useEffect(() => {
    const loadHistory = async () => {
      const saved = localStorage.getItem('artflow_history');
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved) as ProjectHistoryItem[];
        const hydrated = await Promise.all(parsed.map(async (item) => {
          let imageId = item.imageId || null;
          let referenceImageId = item.referenceImageId || null;
          let thumbnailIds = item.thumbnailIds || [];

          if (!imageId && item.image) {
            imageId = await saveImage(item.image);
          }
          if (!referenceImageId && item.referenceImage) {
            referenceImageId = await saveImage(item.referenceImage);
          }
          if ((!thumbnailIds || thumbnailIds.length === 0) && item.thumbnails?.length) {
            thumbnailIds = await saveImages(item.thumbnails);
          }

          const image = item.image || (imageId ? await getImage(imageId) : null);
          const referenceImage = item.referenceImage || (referenceImageId ? await getImage(referenceImageId) : null);
          const thumbnails = item.thumbnails || (thumbnailIds.length > 0 ? await getImages(thumbnailIds) : []);

          return {
            ...item,
            image: image || undefined,
            imageId,
            referenceImage: referenceImage || undefined,
            referenceImageId,
            thumbnails,
            thumbnailIds,
            videoUri: null
          };
        }));
        setHistory(hydrated);
      } catch (e) {
        setHistory([]);
      }
    };

    loadHistory();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        const image = { base64: base64Data, mimeType: file.type };
        setReferenceImage(image);
        const id = await saveImage(image);
        setReferenceImageId(id);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt before generating.");
      return;
    }
    await run(async () => {
      if (batchSize > 1) {
        const batchResults: GeneratedImage[] = [];
        setBatchProgress({ current: 0, total: batchSize });
        for (let i = 0; i < batchSize; i++) {
          const result = await generateArtImage(prompt, referenceImage, imageModel);
          batchResults.push(result);
          setBatchProgress({ current: i + 1, total: batchSize });
        }
        const ids = await saveImages(batchResults);
        const projectIds = batchResults.map(() => `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);
        const newItems: ProjectHistoryItem[] = batchResults.map((result, idx) => ({
          id: projectIds[idx],
          timestamp: Date.now(),
          originalPrompt: prompt,
          referenceImage: referenceImage,
          referenceImageId,
          image: result,
          imageId: ids[idx],
          videoUri: null,
          videoPrompt: DEFAULT_VIDEO_PROMPT,
          metadata: null,
          thumbnails: [],
          thumbnailIds: []
        }));
        setHistory((prev) => [...newItems, ...prev]);
        setVariations(batchResults);
        setVariationIds(ids);
        setVariationProjectIds(projectIds);
        setSelectedVariationIndex(0);
        refreshUsage();
        setBatchProgress(null);
        return;
      }

      const result = await generateArtImage(prompt, referenceImage, imageModel);
      setImage(result);
      const newImageId = await saveImage(result);
      setImageId(newImageId);
      refreshUsage();
      const newId = currentProjectId || Date.now().toString();
      if (!currentProjectId) {
        const newItem: ProjectHistoryItem = {
          id: newId, timestamp: Date.now(), originalPrompt: prompt, referenceImage: referenceImage,
          referenceImageId,
          image: result,
          imageId: newImageId,
          videoUri: null,
          videoPrompt: DEFAULT_VIDEO_PROMPT,
          metadata: null,
          thumbnails: [],
          thumbnailIds: []
        };
        setHistory(prev => [newItem, ...prev]);
        setCurrentProjectId(newId);
      } else {
        setHistory(prev => prev.map(item => item.id === newId ? { ...item, image: result, imageId: newImageId, originalPrompt: prompt } : item));
      }
      setCurrentStep(WorkflowStep.IMAGE);
    }, "Failed to generate image");
  };

  const handleUseSelectedVariation = async () => {
    if (selectedVariationIndex === null) return;
    const result = variations[selectedVariationIndex];
    const resultId = variationIds[selectedVariationIndex];
    const projectId = variationProjectIds[selectedVariationIndex] || null;
    if (!result || !resultId) return;

    setImage(result);
    setImageId(resultId);
    setVariations([]);
    setVariationIds([]);
    setSelectedVariationIndex(null);
    setBatchProgress(null);
    setVariationProjectIds([]);

    if (projectId) {
      setCurrentProjectId(projectId);
    }
    setCurrentStep(WorkflowStep.IMAGE);
  };

  const handleGenerateVideo = async () => {
    if (!image) return;
    setVideoUri(null); 
    await run(async () => {
      const result = await generateVeoVideo(videoPrompt, image, VIDEO_MODEL_ID);
      setVideoUri(result.videoUri);
      setVideoBlob(result.videoBlob);
      recordVideoGeneration(VIDEO_MODEL_ID);
      refreshUsage();
      if (currentProjectId) {
        setHistory(prev => prev.map(item => item.id === currentProjectId ? { ...item, videoUri: result.videoUri, videoPrompt: videoPrompt } : item));
      }
    }, "Failed to generate video.");
  };

  const handleGenerateThumbnails = async () => {
    if (!image) return;
    await run(async () => {
      const thumbs = await generateThumbnailImages(image);
      setThumbnails(thumbs);
      const ids = await saveImages(thumbs);
      setThumbnailIds(ids);
      refreshUsage();
      if (currentProjectId) {
        setHistory(prev => prev.map(item => item.id === currentProjectId ? { ...item, thumbnails: thumbs, thumbnailIds: ids } : item));
      }
    }, "Failed to generate thumbnails");
  };

  const handleGenerateMetadata = async () => {
    if (!image) return;
    await run(async () => {
      const data = await generateEtsyMetadata(image, prompt);
      setMetadata(data);
      refreshUsage();
      if (currentProjectId) {
        setHistory(prev => prev.map(item => item.id === currentProjectId ? { ...item, metadata: data } : item));
      }
      setCurrentStep(WorkflowStep.FINALIZE);
    }, "Failed to generate metadata");
  };

  const handleDirectUpload = async () => {
    if (!metadata || !image) return;
    await run(async () => {
      const listingId = await uploadToEtsy(etsyConfig, metadata, image, videoBlob);
      if (currentProjectId) {
        setHistory(prev => prev.map(item => item.id === currentProjectId ? { ...item, etsyListingId: listingId } : item));
      }
      alert(`Listing ID: ${listingId}`);
    }, "Etsy Upload Failed.");
  };

  const handleExportZip = async () => {
    if (!metadata || !image) return;
    await run(async () => {
      const zip = new JSZip();
      const headers = ["TITLE", "DESCRIPTION", "PRICE", "CURRENCY_CODE", "QUANTITY", "TAGS", "MATERIALS", "IMAGE1", "IMAGE2", "IMAGE3", "IMAGE4", "IMAGE5", "IMAGE6", "IMAGE7", "IMAGE8", "IMAGE9", "IMAGE10", "VARIATION 1 TYPE", "VARIATION 1 NAME", "VARIATION 1 VALUES", "VARIATION 2 TYPE", "VARIATION 2 NAME", "VARIATION 2 VALUES", "SKU"];
      const escapeCsv = (value: string | number) => {
        const stringValue = String(value ?? "");
        const escaped = stringValue.replace(/"/g, '""');
        return `"${escaped}"`;
      };
      const row = [
        escapeCsv(metadata.title),
        escapeCsv(metadata.description),
        escapeCsv(metadata.price || "10.00"),
        escapeCsv("USD"),
        escapeCsv(metadata.quantity || 1),
        escapeCsv(metadata.tags.join(",")),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv(""),
        escapeCsv("")
      ];
      const csvContent = headers.join(",") + "\n" + row.join(",");
      zip.file("listing_metadata.csv", csvContent);
      const mainArtData = atob(image.base64);
      const mainArtBytes = new Uint8Array(mainArtData.length);
      for (let i = 0; i < mainArtData.length; i++) mainArtBytes[i] = mainArtData.charCodeAt(i);
      zip.file("main_art.png", mainArtBytes);
      if (thumbnails.length > 0) {
        const thumbFolder = zip.folder("thumbnails");
        for (let i = 0; i < thumbnails.length; i++) {
          const thumb = thumbnails[i];
          const thumbData = atob(thumb.base64);
          const thumbBytes = new Uint8Array(thumbData.length);
          for (let j = 0; j < thumbData.length; j++) thumbBytes[j] = thumbData.charCodeAt(j);
          thumbFolder?.file(`mockup_${i + 1}.png`, thumbBytes);
        }
      }
      if (videoBlob) zip.file("process_video.mp4", videoBlob);
      else if (videoUri) {
        const vResp = await fetch(videoUri);
        const vBlob = await vResp.blob();
        zip.file("process_video.mp4", vBlob);
      }
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `artflow_project_${Date.now()}.zip`;
      link.click();
    }, "Failed to create ZIP.");
  };

  const reset = () => {
    setCurrentProjectId(null);
    setPrompt('');
    setReferenceImage(null);
    setReferenceImageId(null);
    setImage(null);
    setImageId(null);
    setVideoUri(null);
    setVideoBlob(null);
    setThumbnails([]);
    setThumbnailIds([]);
    setMetadata(null);
    setVariations([]);
    setVariationIds([]);
    setSelectedVariationIndex(null);
    setBatchProgress(null);
    setVariationProjectIds([]);
    setCurrentStep(WorkflowStep.PROMPT);
  };

  const loadProject = async (item: ProjectHistoryItem) => {
    setCurrentProjectId(item.id);
    setPrompt(item.originalPrompt);
    setReferenceImageId(item.referenceImageId || null);
    setImageId(item.imageId || null);
    setThumbnailIds(item.thumbnailIds || []);

    const loadedImage = item.image || (item.imageId ? await getImage(item.imageId) : null);
    const loadedReference = item.referenceImage || (item.referenceImageId ? await getImage(item.referenceImageId) : null);
    const loadedThumbnails = item.thumbnails || (item.thumbnailIds ? await getImages(item.thumbnailIds) : []);

    setImage(loadedImage);
    setReferenceImage(loadedReference);
    setVideoUri(item.videoUri);
    setVideoPrompt(item.videoPrompt);
    setThumbnails(loadedThumbnails);
    setVariations([]);
    setVariationIds([]);
    setSelectedVariationIndex(null);
    setVariationProjectIds([]);
    setMetadata(item.metadata);

    if (item.metadata) setCurrentStep(WorkflowStep.FINALIZE);
    else if (loadedThumbnails && loadedThumbnails.length > 0) setCurrentStep(WorkflowStep.THUMBNAILS);
    else if (item.videoUri || item.videoPrompt !== DEFAULT_VIDEO_PROMPT) setCurrentStep(WorkflowStep.VIDEO);
    else setCurrentStep(WorkflowStep.IMAGE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepClick = (step: WorkflowStep) => {
    if (!isProcessing) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetUsage = () => {
    resetUsage();
    refreshUsage();
  };

  return (
    <div className="min-h-screen pb-20 flex flex-col md:flex-row max-w-7xl mx-auto gap-6 p-4">
      <ApiKeyModal onReady={() => setIsKeyReady(true)} />
      
      {/* Configuration Modal */}
      {showConfig && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Etsy Integration</h2>
              <button onClick={() => setShowConfig(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={etsyConfig.shopName} onChange={e => setEtsyConfig({...etsyConfig, shopName: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200" placeholder="Shop Name" />
                <input type="text" value={etsyConfig.shopId} onChange={e => setEtsyConfig({...etsyConfig, shopId: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200" placeholder="Shop ID" />
              </div>
              <input type="password" value={etsyConfig.apiKey} onChange={e => setEtsyConfig({...etsyConfig, apiKey: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200" placeholder="API Key" />
              <textarea value={etsyConfig.accessToken} onChange={e => setEtsyConfig({...etsyConfig, accessToken: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 h-24" placeholder="OAuth Token" />
            </div>
            <button onClick={() => setShowConfig(false)} className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl">Save</button>
          </div>
        </div>
      )}

      {/* Full Image Modal Viewer */}
      {isFullImageModalOpen && image && (
        <div 
          className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          onClick={() => setIsFullImageModalOpen(false)}
        >
          <img 
            src={`data:${image.mimeType};base64,${image.base64}`} 
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            alt="Full size artwork"
          />
          <button className="absolute top-8 right-8 text-white/60 hover:text-white text-4xl transition-colors">✕</button>
        </div>
      )}

      {isVariationModalOpen && variations.length > 0 && (
        <div
          className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
        >
          <button
            onClick={() => setIsVariationModalOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl"
          >
            ✕
          </button>
          <button
            onClick={() =>
              setVariationModalIndex((prev) =>
                prev === 0 ? variations.length - 1 : prev - 1
              )
            }
            className="absolute left-6 text-white/70 hover:text-white text-4xl"
          >
            ‹
          </button>
          <img
            src={`data:${variations[variationModalIndex].mimeType};base64,${variations[variationModalIndex].base64}`}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            alt="Variation preview"
          />
          <button
            onClick={() =>
              setVariationModalIndex((prev) =>
                prev === variations.length - 1 ? 0 : prev + 1
              )
            }
            className="absolute right-6 text-white/70 hover:text-white text-4xl"
          >
            ›
          </button>
        </div>
      )}

      <div className="flex-1 order-1 space-y-6">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 rounded-3xl shadow-sm border border-slate-100 px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3"><div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-black text-xl">A</div><h1 className="text-2xl font-black text-brand-600">ArtFlow</h1></div>
            <div className="flex gap-4 items-center">
               <button onClick={() => setShowConfig(true)} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 transition-all">Setup</button>
               {currentStep > WorkflowStep.PROMPT && <button onClick={reset} className="text-sm font-bold text-slate-400 uppercase tracking-widest">Reset</button>}
            </div>
        </header>

        {isKeyReady && (
          <>
            <StepIndicator currentStep={currentStep} onStepClick={handleStepClick} unlockedSteps={unlockedSteps} />
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden min-h-[500px]">
              {currentStep === WorkflowStep.PROMPT && (
                <PromptStep
                  prompt={prompt}
                  setPrompt={setPrompt}
                  referenceImage={referenceImage}
                  onFileUpload={handleFileUpload}
                  onClearReference={() => {
                    setReferenceImage(null);
                    setReferenceImageId(null);
                  }}
                  onGenerate={handleGenerateImage}
                  onUseSelected={handleUseSelectedVariation}
                  isProcessing={isProcessing}
                  imageModel={imageModel}
                  imageModelMode={imageModelMode}
                  setImageModelMode={setImageModelMode}
                  setImageModel={setImageModel}
                  imageModelPresets={combinedModelPresets}
                  defaultImageModel={DEFAULT_IMAGE_MODEL}
                  favoriteModelId={favoriteModelId}
                  onUseFavoriteModel={handleUseFavoriteModel}
                  onToggleFavoriteModel={handleToggleFavoriteModel}
                  onAddModelPreset={handleAddModelPreset}
                  onRemoveModelPreset={handleRemoveModelPreset}
                  promptLibrary={promptLibrary}
                  onSavePromptTemplate={handleSavePromptTemplate}
                  onLoadPromptTemplate={handleLoadPromptTemplate}
                  onDeletePromptTemplate={handleDeletePromptTemplate}
                  batchSize={batchSize}
                  onBatchSizeChange={(value) => {
                    setBatchSize(value);
                    setVariations([]);
                    setVariationIds([]);
                    setSelectedVariationIndex(null);
                  }}
                  variations={variations}
                  selectedVariationIndex={selectedVariationIndex}
                  onSelectVariation={setSelectedVariationIndex}
                  batchProgress={batchProgress}
                  onOpenVariation={(index) => {
                    setVariationModalIndex(index);
                    setIsVariationModalOpen(true);
                  }}
                />
              )}

              {currentStep === WorkflowStep.IMAGE && image && (
                <ImageStep
                  image={image}
                  prompt={prompt}
                  setPrompt={setPrompt}
                  isProcessing={isProcessing}
                  onGenerate={handleGenerateImage}
                  onNext={() => setCurrentStep(WorkflowStep.VIDEO)}
                  onRestart={() => setCurrentStep(WorkflowStep.PROMPT)}
                  onOpenFullImage={() => setIsFullImageModalOpen(true)}
                />
              )}

              {currentStep === WorkflowStep.VIDEO && (
                <VideoStep
                  videoUri={videoUri}
                  isProcessing={isProcessing}
                  videoPrompt={videoPrompt}
                  setVideoPrompt={setVideoPrompt}
                  onGenerate={handleGenerateVideo}
                  onNext={() => setCurrentStep(WorkflowStep.THUMBNAILS)}
                />
              )}

              {currentStep === WorkflowStep.THUMBNAILS && (
                <ThumbnailsStep
                  thumbnails={thumbnails}
                  isProcessing={isProcessing}
                  onGenerate={handleGenerateThumbnails}
                  onNext={handleGenerateMetadata}
                  mockupScenarios={MOCKUP_SCENARIOS}
                />
              )}

              {currentStep === WorkflowStep.FINALIZE && metadata && image && (
                <FinalizeStep
                  metadata={metadata}
                  setMetadata={setMetadata}
                  image={image}
                  thumbnails={thumbnails}
                  isProcessing={isProcessing}
                  onDirectUpload={handleDirectUpload}
                  onExportZip={handleExportZip}
                  onOptimizeTags={() => {
                    setMetadata({
                      ...metadata,
                      tags: optimizeTags(metadata.tags)
                    });
                  }}
                />
              )}
            </div>
            {error && <div className="bg-red-50 text-red-600 p-6 rounded-[2rem] font-bold border-2 border-red-100 mt-4">{error}</div>}
            {validationWarnings.length > 0 && (
              <div className="bg-amber-50 text-amber-700 p-4 rounded-[1.5rem] border border-amber-100 mt-4 space-y-1 text-sm">
                {validationWarnings.map((warning, index) => (
                  <div key={index}>• {warning}</div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {isKeyReady && (
        <aside className="w-full md:w-64 flex-shrink-0 order-2 self-start">
          <div className="space-y-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1">
            <HistoryPanel
              history={history}
              currentProjectId={currentProjectId}
              onSelect={loadProject}
              onDelete={handleDeleteProject}
              onPurgeCache={handlePurgeCache}
            />
            <UsagePanel usage={usage} onReset={handleResetUsage} />
          </div>
        </aside>
      )}
    </div>
  );
}
