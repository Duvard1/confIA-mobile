import { create } from 'zustand';
import { AnalysisData, CallerType, HistoryEntry } from '@/types/analysis';

interface PendingFile {
  uri: string;
  name: string;
  mimeType?: string;
  sizeBytes?: number;
  durationSeconds?: number;
}

interface AnalysisStore {
  pendingFile: PendingFile | null;
  callerType: CallerType | null;
  description: string;
  audioSource: 'call' | 'whatsapp' | null;

  current: AnalysisData | null;
  history: HistoryEntry[];

  setPendingFile: (file: PendingFile | null) => void;
  setCallerType: (t: CallerType | null) => void;
  setDescription: (d: string) => void;
  setAudioSource: (source: 'call' | 'whatsapp' | null) => void;
  resetUploadForm: () => void;

  setCurrentAnalysis: (data: AnalysisData, fileName: string) => void;
  setHistory: (history: HistoryEntry[]) => void;
}

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  pendingFile: null,
  callerType: null,
  description: '',
  audioSource: null,

  current: null,
  history: [],

  setPendingFile: (file) => set({ pendingFile: file }),
  setCallerType: (t) => set({ callerType: t }),
  setDescription: (d) => set({ description: d }),
  setAudioSource: (source) => set({ audioSource: source }),
  resetUploadForm: () =>
    set({ pendingFile: null, callerType: null, description: '', audioSource: null }),

  setCurrentAnalysis: (data, fileName) => {
    const entry: HistoryEntry = {
      id: data.metadata.analysis_id,
      fileName,
      createdAt: data.metadata.created_at,
      riskScore: data.overall_assessment.risk_score,
      riskLevel: data.overall_assessment.risk_level,
      data,
    };
    set({
      current: data,
      history: [entry, ...get().history.filter((h) => h.id !== entry.id)],
    });
  },
  setHistory: (h) => set({ history: h }),
}));
