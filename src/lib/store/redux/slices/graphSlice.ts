import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GraphNodeData } from '@/types/cti';

export interface GraphState {
  selectedGraphNode: GraphNodeData | null;
  graphFilterTypes: string[];
  minConfidenceFilter: number;
}

const DEFAULT_FILTER_TYPES = ['actor', 'malware', 'campaign', 'ip', 'domain', 'cve', 'technique'];

const initialState: GraphState = {
  selectedGraphNode: null,
  graphFilterTypes: DEFAULT_FILTER_TYPES,
  minConfidenceFilter: 0
};

export const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setSelectedGraphNode(state, action: PayloadAction<GraphNodeData | null>) {
      state.selectedGraphNode = action.payload;
    },
    setGraphFilterTypes(state, action: PayloadAction<string[]>) {
      state.graphFilterTypes = action.payload;
    },
    toggleGraphFilterType(state, action: PayloadAction<string>) {
      const type = action.payload;
      if (state.graphFilterTypes.includes(type)) {
        state.graphFilterTypes = state.graphFilterTypes.filter(t => t !== type);
      } else {
        state.graphFilterTypes.push(type);
      }
    },
    setMinConfidenceFilter(state, action: PayloadAction<number>) {
      state.minConfidenceFilter = action.payload;
    },
    resetGraphFilters(state) {
      state.graphFilterTypes = DEFAULT_FILTER_TYPES;
      state.minConfidenceFilter = 0;
      state.selectedGraphNode = null;
    }
  }
});

export const {
  setSelectedGraphNode,
  setGraphFilterTypes,
  toggleGraphFilterType,
  setMinConfidenceFilter,
  resetGraphFilters
} = graphSlice.actions;

export default graphSlice.reducer;
