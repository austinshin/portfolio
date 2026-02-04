import React from "react";
import type { GeneratedImage } from "../../types";

interface PromptStepProps {
  prompt: string;
  setPrompt: (value: string) => void;
  referenceImage: GeneratedImage | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearReference: () => void;
  onGenerate: () => void;
  onUseSelected: () => void;
  isProcessing: boolean;
  imageModel: string;
  imageModelMode: "preset" | "custom";
  setImageModelMode: (value: "preset" | "custom") => void;
  setImageModel: (value: string) => void;
  imageModelPresets: { id: string; label: string; isCustom?: boolean }[];
  defaultImageModel: string;
  favoriteModelId: string | null;
  onUseFavoriteModel: () => void;
  onToggleFavoriteModel: (modelId: string) => void;
  onAddModelPreset: (name: string, id: string) => void;
  onRemoveModelPreset: (modelId: string) => void;
  promptLibrary: { id: string; name: string; text: string }[];
  onSavePromptTemplate: (name: string) => void;
  onLoadPromptTemplate: (id: string) => void;
  onDeletePromptTemplate: (id: string) => void;
  batchSize: number;
  onBatchSizeChange: (value: number) => void;
  variations: GeneratedImage[];
  selectedVariationIndex: number | null;
  onSelectVariation: (index: number) => void;
  batchProgress: { current: number; total: number } | null;
  onOpenVariation: (index: number) => void;
}

export const PromptStep: React.FC<PromptStepProps> = ({
  prompt,
  setPrompt,
  referenceImage,
  onFileUpload,
  onClearReference,
  onGenerate,
  onUseSelected,
  isProcessing,
  imageModel,
  imageModelMode,
  setImageModelMode,
  setImageModel,
  imageModelPresets,
  defaultImageModel,
  favoriteModelId,
  onUseFavoriteModel,
  onToggleFavoriteModel,
  onAddModelPreset,
  onRemoveModelPreset,
  promptLibrary,
  onSavePromptTemplate,
  onLoadPromptTemplate,
  onDeletePromptTemplate,
  batchSize,
  onBatchSizeChange,
  variations,
  selectedVariationIndex,
  onSelectVariation,
  batchProgress,
  onOpenVariation
}) => {
  const [newPresetName, setNewPresetName] = React.useState("");
  const [newPresetId, setNewPresetId] = React.useState("");
  const [newTemplateName, setNewTemplateName] = React.useState("");

  return (
    <div className="p-12 flex flex-col items-center justify-center min-h-[500px] gap-10">
      <div className="text-center max-w-xl space-y-4">
        <h2 className="text-4xl font-black text-slate-900">Create art</h2>
        <p className="text-slate-500 font-medium">Use Nano Banana for image creation.</p>
      </div>
      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-4">
          <label
            className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2"
            title="Model options are saved model IDs you can select quickly"
          >
            Image Model
          </label>
          <select
            value={imageModelMode === "custom" ? "custom" : imageModel}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "custom") {
                setImageModelMode("custom");
                if (imageModelPresets.some((preset) => preset.id === imageModel)) {
                  setImageModel("");
                }
              } else {
                setImageModelMode("preset");
                setImageModel(value);
              }
            }}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-500"
          >
            {imageModelPresets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label} ({preset.id})
              </option>
            ))}
            <option value="custom">Custom…</option>
          </select>
          {imageModelMode === "custom" && (
            <input
              type="text"
              value={imageModel}
              onChange={(e) => setImageModel(e.target.value)}
              placeholder={defaultImageModel}
              title="Enter a custom model ID"
              className="mt-3 w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-500"
            />
          )}
          <div className="mt-3 flex items-center justify-between gap-3">
            {favoriteModelId ? (
              <button
                onClick={onUseFavoriteModel}
                className="text-xs font-bold text-brand-600 hover:text-brand-700"
                title="Switch to your saved favorite model option"
              >
                Use favorite model
              </button>
            ) : (
              <span className="text-xs text-slate-400">No favorite set</span>
            )}
            <button
              onClick={() => onToggleFavoriteModel(imageModel)}
              className="text-xs font-bold text-slate-500 hover:text-brand-600"
              title="Save the currently selected model option as your favorite"
            >
              {favoriteModelId === imageModel ? "★ Favorite" : "☆ Set favorite"}
            </button>
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4 space-y-2 hidden">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Add Model Option</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="Option name"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                value={newPresetId}
                onChange={(e) => setNewPresetId(e.target.value)}
                placeholder="Model ID"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button
              onClick={() => {
                if (!newPresetName.trim() || !newPresetId.trim()) return;
                onAddModelPreset(newPresetName.trim(), newPresetId.trim());
                setNewPresetName("");
                setNewPresetId("");
              }}
              className="text-xs font-bold text-slate-500 hover:text-brand-600"
              title="Save a custom model option so you can select it later"
            >
              Add model option
            </button>
            {imageModelPresets.some((preset) => preset.isCustom) && (
              <div className="text-[10px] text-slate-400">
                Custom model options:
                {" "}
                {imageModelPresets
                  .filter((preset) => preset.isCustom)
                  .map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => onRemoveModelPreset(preset.id)}
                      className="ml-1 underline hover:text-brand-600"
                      title={`Remove model option "${preset.label}"`}
                    >
                      {preset.label}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
        <div className="bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-4 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Prompt Library</label>
          <div className="flex gap-2">
            <input
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="Template name"
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              onClick={() => {
                if (!newTemplateName.trim()) return;
                onSavePromptTemplate(newTemplateName.trim());
                setNewTemplateName("");
              }}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-brand-600"
            >
              Save
            </button>
          </div>
          {promptLibrary.length === 0 ? (
            <div className="text-xs text-slate-400">No templates yet.</div>
          ) : (
            <div className="space-y-2">
              {promptLibrary.map((template) => (
                <div key={template.id} className="flex items-center justify-between text-xs">
                  <button
                    onClick={() => onLoadPromptTemplate(template.id)}
                    className="text-slate-600 hover:text-brand-600 font-semibold truncate"
                  >
                    {template.name}
                  </button>
                  <button
                    onClick={() => onDeletePromptTemplate(template.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Variations
          </label>
          <div className="flex gap-2">
            {[1, 4, 8].map((count) => (
              <button
                key={count}
                onClick={() => onBatchSizeChange(count)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                  batchSize === count
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                {count}
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Generate multiple options and pick the best.
          </div>
        </div>
        <div className="relative">
          <textarea
            className="w-full p-6 pb-20 rounded-[2rem] border-2 border-slate-100 bg-slate-50 h-48 text-lg font-medium outline-none focus:border-brand-500 transition-colors"
            placeholder="Describe your art..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isProcessing}
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            {referenceImage ? (
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-brand-500 shadow-lg">
                <img
                  src={`data:${referenceImage.mimeType};base64,${referenceImage.base64}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={onClearReference}
                  className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity font-bold"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="w-16 h-16 rounded-2xl border-2 border-slate-200 border-dashed flex items-center justify-center text-slate-400 hover:text-brand-500 hover:border-brand-500 cursor-pointer transition-all bg-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input type="file" className="hidden" accept="image/*" onChange={onFileUpload} />
              </label>
            )}
          </div>
        </div>
        <button
          onClick={onGenerate}
          disabled={!prompt.trim() || isProcessing}
          className="w-full py-6 bg-brand-600 text-white font-black text-xl rounded-[2rem] shadow-2xl transition-all disabled:opacity-50"
        >
          {isProcessing ? "Generating..." : batchSize > 1 ? `Generate ${batchSize} Variations` : "Generate Masterpiece"}
        </button>
        {batchSize > 1 && (
          <div className="text-xs text-slate-400 text-center">
            Variation generation runs sequentially to keep costs predictable.
          </div>
        )}
        {variations.length > 0 && (
          <div className="bg-white border border-slate-100 rounded-[1.5rem] p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Pick the best</div>
            <div className="grid grid-cols-4 gap-3">
              {variations.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => onSelectVariation(index)}
                  className={`rounded-xl overflow-hidden border-2 ${
                    selectedVariationIndex === index ? "border-brand-500" : "border-transparent"
                  }`}
                >
                  <img src={`data:${variant.mimeType};base64,${variant.base64}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs">
              <button
                onClick={() => selectedVariationIndex !== null && onOpenVariation(selectedVariationIndex)}
                className="text-slate-500 hover:text-brand-600"
                disabled={selectedVariationIndex === null}
              >
                View larger
              </button>
              <button
                onClick={() => onOpenVariation(0)}
                className="text-slate-400 hover:text-brand-600"
              >
                Open gallery
              </button>
            </div>
            <button
              onClick={onUseSelected}
              disabled={selectedVariationIndex === null}
              className="w-full py-3 bg-brand-600 text-white font-bold rounded-2xl disabled:opacity-50"
            >
              Use selected variation
            </button>
          </div>
        )}
        {batchProgress && (
          <div className="bg-slate-50 border border-slate-100 rounded-[1.5rem] p-4 space-y-2">
            <div className="text-xs text-slate-500 text-center">
              Generating variation {batchProgress.current} of {batchProgress.total}
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 transition-all"
                style={{ width: `${Math.round((batchProgress.current / batchProgress.total) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
