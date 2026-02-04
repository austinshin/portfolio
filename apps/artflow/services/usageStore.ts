export type UsageTotals = {
  requests: number;
  promptTokens: number;
  candidatesTokens: number;
  totalTokens: number;
};

export type UsageState = {
  models: Record<string, UsageTotals>;
  videoGenerations: Record<string, number>;
  updatedAt: number;
};

const STORAGE_KEY = "artflow_usage_v1";

const emptyState = (): UsageState => ({
  models: {},
  videoGenerations: {},
  updatedAt: Date.now()
});

const readRaw = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const readUsage = (): UsageState => {
  const raw = readRaw();
  if (!raw) return emptyState();
  try {
    const parsed = JSON.parse(raw) as UsageState;
    return {
      models: parsed.models || {},
      videoGenerations: parsed.videoGenerations || {},
      updatedAt: parsed.updatedAt || Date.now()
    };
  } catch {
    return emptyState();
  }
};

const writeUsage = (state: UsageState): UsageState => {
  if (typeof window === "undefined") return state;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors (private mode, quota, etc.)
  }
  return state;
};

export const recordUsage = (
  model: string,
  usage?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  }
): UsageState => {
  const state = readUsage();
  const key = model || "unknown-model";
  const current = state.models[key] || {
    requests: 0,
    promptTokens: 0,
    candidatesTokens: 0,
    totalTokens: 0
  };

  current.requests += 1;
  current.promptTokens += usage?.promptTokenCount ?? 0;
  current.candidatesTokens += usage?.candidatesTokenCount ?? 0;
  current.totalTokens += usage?.totalTokenCount ?? 0;

  state.models[key] = current;
  state.updatedAt = Date.now();
  return writeUsage(state);
};

export const recordVideoGeneration = (model: string): UsageState => {
  const state = readUsage();
  const key = model || "veo";
  state.videoGenerations[key] = (state.videoGenerations[key] || 0) + 1;
  state.updatedAt = Date.now();
  return writeUsage(state);
};

export const resetUsage = (): UsageState => {
  const state = emptyState();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
  return writeUsage(state);
};
