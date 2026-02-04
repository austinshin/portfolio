import React from "react";
import type { GeneratedImage } from "../../types";

interface ImageStepProps {
  image: GeneratedImage;
  prompt: string;
  setPrompt: (value: string) => void;
  isProcessing: boolean;
  onGenerate: () => void;
  onNext: () => void;
  onRestart: () => void;
  onOpenFullImage: () => void;
}

export const ImageStep: React.FC<ImageStepProps> = ({
  image,
  prompt,
  setPrompt,
  isProcessing,
  onGenerate,
  onNext,
  onRestart,
  onOpenFullImage
}) => {
  return (
    <div className="p-12 flex flex-col md:flex-row gap-12 items-start min-h-[500px]">
      <div className="flex-[2] relative group">
        <div
          onClick={() => !isProcessing && onOpenFullImage()}
          className={`rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-50 transition-all cursor-zoom-in hover:shadow-brand-500/10 ${
            isProcessing ? "blur-md opacity-50 scale-[0.98]" : "blur-0 opacity-100 scale-100"
          }`}
        >
          <img src={`data:${image.mimeType};base64,${image.base64}`} className="w-full h-auto" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none flex items-center justify-center">
            <div className="bg-white/90 px-4 py-2 rounded-full font-bold text-xs text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg uppercase tracking-wider">
              Click to enlarge
            </div>
          </div>
        </div>
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-brand-600 border-t-transparent rounded-full animate-spin shadow-2xl"></div>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-8 min-w-[320px]">
        <div className="space-y-3">
          <h3 className="text-3xl font-black text-slate-900">Art Playground</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            Iterate on your vision using Nano Banana. Change prompts as many times as you like.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <textarea
              className="w-full p-5 bg-slate-50 rounded-[1.5rem] border-2 border-slate-100 outline-none focus:border-brand-500 h-40 text-sm font-semibold leading-relaxed resize-none transition-all focus:bg-white focus:shadow-inner"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Fine-tune your prompt..."
              disabled={isProcessing}
            />
            <div className="absolute -top-3 left-6 bg-white px-3 py-0.5 text-[10px] font-black text-brand-600 uppercase tracking-widest border border-slate-100 rounded-lg shadow-sm">
              PROMPT REFINEMENT
            </div>
          </div>

          <button
            onClick={onGenerate}
            disabled={isProcessing || !prompt.trim()}
            className="w-full py-4 bg-white border-2 border-brand-100 text-brand-600 font-black rounded-2xl hover:bg-brand-50 hover:border-brand-200 transition-all flex items-center justify-center gap-3 shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isProcessing ? "Painting..." : "Regenerate Art"}
          </button>
        </div>

        <div className="pt-6 border-t border-slate-100 space-y-4">
          <button
            onClick={onNext}
            className="w-full py-6 bg-brand-600 text-white font-black text-lg rounded-[2rem] shadow-xl shadow-brand-500/20 hover:scale-[1.02] active:scale-100 transition-all"
          >
            Next: Create Process Video
          </button>
          <button
            onClick={onRestart}
            className="w-full py-3 text-slate-400 font-bold rounded-2xl hover:text-brand-600 hover:bg-brand-50 transition-all text-xs uppercase tracking-[0.2em]"
          >
            Restart Project
          </button>
        </div>
      </div>
    </div>
  );
};
