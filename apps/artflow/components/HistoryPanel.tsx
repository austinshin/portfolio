import React from "react";
import type { ProjectHistoryItem } from "../types";

interface HistoryPanelProps {
  history: ProjectHistoryItem[];
  currentProjectId: string | null;
  onSelect: (item: ProjectHistoryItem) => void;
  onDelete: (item: ProjectHistoryItem) => void;
  onPurgeCache: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  currentProjectId,
  onSelect,
  onDelete,
  onPurgeCache
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h3 className="font-bold text-slate-800">Project History</h3>
        <button
          onClick={onPurgeCache}
          className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600"
          title="Remove cached images from this device"
        >
          Purge cache
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
        {history.length === 0 ? (
          <p className="text-center text-slate-300 py-10 text-sm">No history yet.</p>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className={`p-2 rounded-2xl border transition-all flex gap-3 items-center ${
                currentProjectId === item.id
                  ? "bg-brand-50 border-brand-200"
                  : "border-transparent hover:bg-slate-50"
              }`}
            >
              <button onClick={() => onSelect(item)} className="flex items-center gap-3 flex-1 text-left">
                {item.image ? (
                  <img
                    src={`data:${item.image.mimeType};base64,${item.image.base64}`}
                    className="w-14 h-14 rounded-xl object-cover shadow-sm bg-white"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200" />
                )}
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-700 truncate">
                    {item.metadata?.title || item.originalPrompt}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </button>
              <button
                onClick={() => onDelete(item)}
                className="text-[10px] font-bold text-slate-400 hover:text-red-500"
                title="Delete project"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
