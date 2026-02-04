import { useState } from "react";

export const useGeneration = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => Promise<void>, fallbackMessage?: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      await fn();
    } catch (e: any) {
      const message = e?.message || fallbackMessage || "Something went wrong.";
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return { isProcessing, error, setError, run };
};
