import React from "react";
import type { EtsyMetadata, GeneratedImage } from "../../types";

interface FinalizeStepProps {
  metadata: EtsyMetadata;
  setMetadata: (value: EtsyMetadata) => void;
  image: GeneratedImage;
  thumbnails: GeneratedImage[];
  isProcessing: boolean;
  onDirectUpload: () => void;
  onExportZip: () => void;
  onOptimizeTags: () => void;
}

export const FinalizeStep: React.FC<FinalizeStepProps> = ({
  metadata,
  setMetadata,
  image,
  thumbnails,
  isProcessing,
  onDirectUpload,
  onExportZip,
  onOptimizeTags
}) => {
  return (
    <div className="p-12 space-y-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Listing Title</label>
            <input
              value={metadata.title}
              onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
              className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-brand-500 outline-none font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
            <textarea
              value={metadata.description}
              onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
              className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-brand-500 outline-none h-48 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">SEO Tags</label>
            <textarea
              value={metadata.tags.join(", ")}
              onChange={(e) =>
                setMetadata({ ...metadata, tags: e.target.value.split(",").map((t) => t.trim()) })
              }
              className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-brand-500 outline-none h-24 resize-none"
            />
            <button
              onClick={onOptimizeTags}
              className="mt-3 text-xs font-bold text-slate-500 hover:text-brand-600"
            >
              Optimize tags
            </button>
          </div>
        </div>
        <div className="lg:w-96 space-y-8">
          <div className="bg-slate-50 p-6 rounded-[2.5rem] border-2 border-slate-100 space-y-4">
            <h4 className="font-black text-slate-800 uppercase text-xs">Bundle Overview</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square rounded-xl overflow-hidden border shadow-sm">
                <img src={`data:${image.mimeType};base64,${image.base64}`} className="w-full h-full object-cover" />
              </div>
              {thumbnails[0] && (
                <div className="aspect-square rounded-xl overflow-hidden border shadow-sm">
                  <img
                    src={`data:${thumbnails[0].mimeType};base64,${thumbnails[0].base64}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              Main art + {thumbnails.length} thumbnails + process video ready.
            </p>
          </div>
          <button
            onClick={onDirectUpload}
            disabled={isProcessing}
            className="w-full py-6 bg-orange-500 text-white font-black text-xl rounded-3xl shadow-lg hover:bg-orange-600 transition-colors"
          >
            {isProcessing ? "Publishing..." : "Publish to Etsy"}
          </button>
          <button
            onClick={onExportZip}
            disabled={isProcessing}
            className="w-full py-5 bg-white border-2 border-slate-100 text-slate-500 font-bold rounded-3xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? "Preparing ZIP..." : "Download Bulk ZIP"}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
