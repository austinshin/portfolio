import React, { useEffect, useState } from 'react';

// Define local interface for type safety usage
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

interface ApiKeyModalProps {
  onReady: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onReady }) => {
  const [hasKey, setHasKey] = useState(false);
  const [hasAIStudio, setHasAIStudio] = useState(false);
  const [localKey, setLocalKey] = useState("");
  const [rememberKey, setRememberKey] = useState(true);

  // Access window.aistudio via type assertion to avoid global declaration conflicts
  const getAIStudio = (): AIStudio | undefined => {
    return (window as any).aistudio;
  };

  const checkKey = async () => {
    try {
      const aistudio = getAIStudio();
      if (aistudio) {
        setHasAIStudio(true);
      }
      const storedSessionKey = sessionStorage.getItem("session_gemini_api_key");
      const storedLocalKey = localStorage.getItem("local_gemini_api_key");
      const existingKey = storedSessionKey || storedLocalKey;
      if (existingKey) {
        setLocalKey(existingKey);
        setHasKey(true);
        onReady();
        return;
      }
      if (aistudio && await aistudio.hasSelectedApiKey()) {
        setHasKey(true);
        onReady();
      }
    } catch (e) {
      console.error("Error checking API key status", e);
    }
  };

  useEffect(() => {
    checkKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectKey = async () => {
    try {
      const aistudio = getAIStudio();
      if (aistudio) {
        await aistudio.openSelectKey();
        // Assume success after dialog interaction per guidelines
        setHasKey(true);
        onReady();
      }
    } catch (e) {
      console.error("Error selecting key", e);
    }
  };

  const handleSaveLocalKey = () => {
    const trimmed = localKey.trim();
    if (!trimmed) return;
    sessionStorage.setItem("session_gemini_api_key", trimmed);
    if (rememberKey) {
      localStorage.setItem("local_gemini_api_key", trimmed);
    } else {
      localStorage.removeItem("local_gemini_api_key");
    }
    setHasKey(true);
    onReady();
  };

  if (hasKey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">API Key Required</h2>
        <p className="text-slate-600 mb-6">
          To generate images and videos, you need a Gemini API key. Locally, set
          <code className="mx-1 px-1 rounded bg-slate-100">VITE_GEMINI_API_KEY</code>
          in <code className="mx-1 px-1 rounded bg-slate-100">.env.local</code>.
        </p>
        <div className="text-left mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Local API Key</label>
          <input
            type="password"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            placeholder="Paste your Gemini API key"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <div className="mt-2 text-xs text-slate-400">
            Stored in this browser only (localStorage). No server upload.
          </div>
          <label className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <input
              type="checkbox"
              checked={rememberKey}
              onChange={(e) => setRememberKey(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Remember key on this device
          </label>
        </div>
        <button
          onClick={handleSaveLocalKey}
          className="w-full py-3 px-6 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-brand-500/25"
        >
          Use Local Key
        </button>
        {hasAIStudio ? (
          <button
            onClick={handleSelectKey}
            className="mt-3 w-full py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
          >
            Select API Key (AI Studio)
          </button>
        ) : (
          <div className="mt-3 text-sm text-slate-500">
            AI Studio key selector is only available inside AI Studio.
          </div>
        )}
        <div className="mt-4 text-xs text-slate-400">
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-600">
            View Billing Documentation
          </a>
        </div>
      </div>
    </div>
  );
};
