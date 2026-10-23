import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InvestigationResult } from '@/types/investigation';
import { primaryInvestigation } from '@/lib/mock-data/investigations';

export interface InvestigationState {
  activeInvestigation: InvestigationResult;
  isInvestigating: boolean;
  currentStageIndex: number;
  investigationProgress: number; // 0 - 100
}

const initialState: InvestigationState = {
  activeInvestigation: primaryInvestigation,
  isInvestigating: false,
  currentStageIndex: 8,
  investigationProgress: 100
};

export const investigationSlice = createSlice({
  name: 'investigation',
  initialState,
  reducers: {
    setActiveInvestigation(state, action: PayloadAction<InvestigationResult>) {
      state.activeInvestigation = action.payload;
    },
    setInvestigating(state, action: PayloadAction<boolean>) {
      state.isInvestigating = action.payload;
    },
    setCurrentStageIndex(state, action: PayloadAction<number>) {
      state.currentStageIndex = action.payload;
    },
    setInvestigationProgress(state, action: PayloadAction<number>) {
      state.investigationProgress = action.payload;
    },
    updateInvestigationStages(state, action: PayloadAction<InvestigationResult['stages']>) {
      if (state.activeInvestigation) {
        state.activeInvestigation.stages = action.payload;
      }
    },
    pauseInvestigation(state) {
      state.isInvestigating = false;
    },
    resetInvestigation(state) {
      state.isInvestigating = false;
      state.currentStageIndex = primaryInvestigation.stages.length - 1;
      state.investigationProgress = 100;
      state.activeInvestigation = primaryInvestigation;
    }
  }
});

export const {
  setActiveInvestigation,
  setInvestigating,
  setCurrentStageIndex,
  setInvestigationProgress,
  updateInvestigationStages,
  pauseInvestigation,
  resetInvestigation
} = investigationSlice.actions;

export default investigationSlice.reducer;
