import { EnnVariables } from '@/@types/enn-variables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SingleAnalysisHistory = {
  id: string;
  date: string;
  title: string;
  image_uri: string;
  status: 'SUCESSO' | 'IMPRECISA';
  enn: number;
  description: string;
  variables: EnnVariables;
  suggestion: string;
};

interface SingleAnalysisState {
  singleAnalyses: SingleAnalysisHistory[];
  addAnalysis: (analysis: SingleAnalysisHistory) => void;
  removeAnalysis: (analysisId: string) => void;
}

export const useSingleAnalysisStore = create<SingleAnalysisState>()(
  persist(
    (set, get) => ({
      singleAnalyses: [],

      addAnalysis: (analysis) => {
        set((state) => ({
          singleAnalyses: [analysis, ...state.singleAnalyses],
        }));
      },
      removeAnalysis: (analysisId) => {
        set((state) => ({
          singleAnalyses: state.singleAnalyses.filter((analysis) => analysis.id !== analysisId),
        }));
      },
    }),
    {
      name: 'scaninus-single-analysis-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      // partialize: (state) => ({ singleAnalyses: state.singleAnalyses }),
    }
  )
);
