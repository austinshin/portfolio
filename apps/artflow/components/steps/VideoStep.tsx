import React from "react";

interface VideoStepProps {
  videoUri: string | null;
  isProcessing: boolean;
  videoPrompt: string;
  setVideoPrompt: (value: string) => void;
  onGenerate: () => void;
  onNext: () => void;
}

export const VideoStep: React.FC<VideoStepProps> = ({
  videoUri,
  isProcessing,
  videoPrompt,
  setVideoPrompt,
  onGenerate,
  onNext
}) => {
  return (
    <div className="p-12 grid md:grid-cols-2 gap-12 items-center min-h-[500px]">
      <div className="aspect-[9/16] bg-slate-900 rounded-[2.5rem] overflow-hidden flex items-center justify-center shadow-inner">
        {videoUri ? (
          <video src={videoUri} controls className="w-full h-full object-cover" autoPlay loop />
        ) : (
          <div className="text-center p-8">
            <p className="text-white/40 font-bold">{isProcessing ? "Veo is painting..." : "Animation Preview"}</p>
          </div>
        )}
      </div>
      <div className="space-y-8">
        <h3 className="text-3xl font-black text-slate-900">Animate with Veo</h3>
        <p className="text-slate-500">
          Describe the process video. Veo creates the motion between your art and its creation.
        </p>
        <textarea
          className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 outline-none focus:border-brand-500 h-32 font-medium"
          value={videoPrompt}
          onChange={(e) => setVideoPrompt(e.target.value)}
          disabled={isProcessing}
        />
        {!videoUri && (
          <button
            onClick={onGenerate}
            disabled={isProcessing}
            className="w-full py-5 bg-brand-600 text-white font-black rounded-2xl shadow-xl disabled:opacity-50"
          >
            {isProcessing ? "Creating Animation..." : "Create Animation"}
          </button>
        )}
        {videoUri && !isProcessing && (
          <div className="space-y-3">
            <button
              onClick={onNext}
              className="w-full py-5 bg-brand-600 text-white font-black rounded-2xl shadow-xl"
            >
              Next: Generate Mockups
            </button>
            <button
              onClick={onGenerate}
              className="w-full py-4 border-2 border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Recreate Animation
            </button>
          </div>
        )}
        {videoUri && isProcessing && (
          <div className="w-full py-5 bg-brand-50 text-brand-600 font-black rounded-2xl text-center animate-pulse">
            Regenerating...
          </div>
        )}
      </div>
    </div>
  );
};
