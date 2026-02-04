import React from "react";
import type { UsageState, UsageTotals } from "../services/usageStore";
import { IMAGE_MODEL_PRESETS, MODEL_PRICING_PER_1M } from "../config/models";

interface UsagePanelProps {
  usage: UsageState;
  onReset: () => void;
}

const getModelLabel = (modelId: string) => {
  const preset = IMAGE_MODEL_PRESETS.find((item) => item.id === modelId);
  return preset ? preset.label : modelId;
};

const formatUSD = (value: number) => {
  const digits = value < 0.01 ? 4 : 2;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
};

const estimateCosts = (modelId: string, totals: UsageTotals) => {
  const pricing = (MODEL_PRICING_PER_1M as Record<string, { input: number; output: number; outputLabel: string }>)[modelId];
  if (!pricing) return null;
  const inputCost = (totals.promptTokens / 1_000_000) * pricing.input;
  const outputCost = (totals.candidatesTokens / 1_000_000) * pricing.output;
  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
    outputLabel: pricing.outputLabel
  };
};

export const UsagePanel: React.FC<UsagePanelProps> = ({ usage, onReset }) => {
  const modelUsageEntries = Object.entries(usage.models);
  const videoUsageEntries = Object.entries(usage.videoGenerations);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Usage (local)</h3>
        <button
          onClick={onReset}
          className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600"
        >
          Reset
        </button>
      </div>
      {modelUsageEntries.length === 0 && videoUsageEntries.length === 0 ? (
        <p className="text-slate-300 text-sm">No usage yet.</p>
      ) : (
        <div className="space-y-3">
          {modelUsageEntries.map(([modelId, totals]) => (
            <div key={modelId} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <div className="text-xs font-bold text-slate-700">{getModelLabel(modelId)}</div>
              <div className="text-[10px] text-slate-400 truncate">{modelId}</div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                <div>
                  Requests: <span className="font-bold text-slate-700">{totals.requests}</span>
                </div>
                <div>
                  Total tokens: <span className="font-bold text-slate-700">{totals.totalTokens}</span>
                </div>
                <div>
                  Prompt tokens: <span className="font-bold text-slate-700">{totals.promptTokens}</span>
                </div>
                <div>
                  Output tokens: <span className="font-bold text-slate-700">{totals.candidatesTokens}</span>
                </div>
              </div>
              {(() => {
                const costs = estimateCosts(modelId, totals);
                if (!costs) {
                  return <div className="mt-2 text-[10px] text-slate-400">Cost estimate: unavailable</div>;
                }
                return (
                  <div className="mt-2 text-[10px] text-slate-500">
                    Est. cost: <span className="font-bold text-slate-700">{formatUSD(costs.totalCost)}</span>
                    <span className="ml-2 text-slate-400">
                      (input {formatUSD(costs.inputCost)}, output {formatUSD(costs.outputCost)} {costs.outputLabel})
                    </span>
                  </div>
                );
              })()}
            </div>
          ))}
          {videoUsageEntries.map(([modelId, count]) => (
            <div key={modelId} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <div className="text-xs font-bold text-slate-700">Veo generations</div>
              <div className="text-[10px] text-slate-400 truncate">{modelId}</div>
              <div className="mt-2 text-[10px] text-slate-500">
                Count: <span className="font-bold text-slate-700">{count}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-[10px] text-slate-400">
        Estimates use Gemini API list pricing (standard tier). Remaining quota isn’t available from the API.
      </p>
    </div>
  );
};
