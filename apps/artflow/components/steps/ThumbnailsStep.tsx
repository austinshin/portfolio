import React from "react";
import type { GeneratedImage } from "../../types";

interface ThumbnailsStepProps {
  thumbnails: GeneratedImage[];
  isProcessing: boolean;
  onGenerate: () => void;
  onNext: () => void;
  mockupScenarios: string[];
}

export const ThumbnailsStep: React.FC<ThumbnailsStepProps> = ({
  thumbnails,
  isProcessing,
  onGenerate,
  onNext,
  mockupScenarios
}) => {
  return (
    <div className="p-12 flex flex-col lg:flex-row gap-12 min-h-[500px] relative">
      {isProcessing && thumbnails.length === 0 && (
        <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-12 text-center">
          <h3 className="text-3xl font-black text-slate-900 mb-6">Finalizing Listing...</h3>
          <p className="text-slate-500 font-medium mb-12">
            Gemini is researching SEO tags and writing the perfect product description.
          </p>
          <div className="w-full max-w-md h-4 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200">
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400 animate-shimmer"></div>
          </div>
          <p className="mt-4 text-xs font-bold text-brand-600 uppercase tracking-widest animate-pulse">
            Analyzing Artwork & Context...
          </p>
        </div>
      )}
      <div className="flex-1 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-3xl font-black text-slate-900">Ad Mockups</h3>
            <p className="text-slate-500">Generating contextual shots for advertising.</p>
          </div>
          {thumbnails.length === 0 && !isProcessing && (
            <button onClick={onGenerate} className="py-4 px-8 bg-brand-600 text-white font-black rounded-2xl">
              Generate 4 Mockups
            </button>
          )}
          {thumbnails.length > 0 && !isProcessing && (
            <button
              onClick={onGenerate}
              className="py-2 px-4 border border-slate-200 text-slate-400 font-bold rounded-xl text-xs hover:bg-slate-50 transition-all"
            >
              Regenerate Mockups
            </button>
          )}
        </div>
        {isProcessing && thumbnails.length === 0 && (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold animate-pulse">Creating ad thumbnails...</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-6">
          {thumbnails.map((thumb, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden shadow-lg border-4 border-white transition-transform hover:scale-[1.02]"
            >
              <img
                src={`data:${thumb.mimeType};base64,${thumb.base64}`}
                className="w-full h-auto object-cover aspect-square"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] text-white font-medium line-clamp-2">{mockupScenarios[idx]}</p>
              </div>
            </div>
          ))}
        </div>
        {thumbnails.length > 0 && !isProcessing && (
          <button onClick={onNext} className="w-full py-5 bg-brand-600 text-white font-black rounded-2xl shadow-xl">
            Next: Finalize Listing
          </button>
        )}
      </div>
      <div className="lg:w-80 space-y-6">
        <div className="bg-slate-50 p-6 rounded-[2.5rem] border-2 border-slate-100 space-y-6">
          <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mockup Scenarios
          </h4>
          <ul className="space-y-4">
            {mockupScenarios.map((scenario, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center text-[10px] font-black">
                  {i + 1}
                </span>
                <p className="text-[11px] leading-relaxed text-slate-600 font-medium">{scenario}</p>
              </li>
            ))}
          </ul>
          <div className="pt-4 border-t border-slate-200">
            <p className="text-[10px] text-slate-400 italic">
              Gemini 2.5 uses these prompts to composite your artwork into realistic environments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
