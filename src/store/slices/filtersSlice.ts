import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState, Severity, KaiStatus } from '../../types/vulnerability';

const initialState: FilterState = {
  searchQuery: '',
  severity: [],
  kaiStatus: [],
  packageName: '',
  cve: '',
  minCvss: 0,
  maxCvss: 10,
  dateRange: {
    start: null,
    end: null,
  },
  excludeInvalidNorisk: false,
  excludeAiInvalidNorisk: false,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSeverity: (state, action: PayloadAction<Severity[]>) => {
      state.severity = action.payload;
    },
    setKaiStatus: (state, action: PayloadAction<KaiStatus[]>) => {
      state.kaiStatus = action.payload;
    },
    setPackageName: (state, action: PayloadAction<string>) => {
      state.packageName = action.payload;
    },
    setCve: (state, action: PayloadAction<string>) => {
      state.cve = action.payload;
    },
    setCvssRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.minCvss = action.payload.min;
      state.maxCvss = action.payload.max;
    },
    setDateRange: (state, action: PayloadAction<{ start: Date | null; end: Date | null }>) => {
      // Convert Date objects to ISO strings for Redux serialization
      state.dateRange = {
        start: action.payload.start ? action.payload.start.toISOString() : null,
        end: action.payload.end ? action.payload.end.toISOString() : null,
      };
    },
    setExcludeInvalidNorisk: (state, action: PayloadAction<boolean>) => {
      state.excludeInvalidNorisk = action.payload;
    },
    setExcludeAiInvalidNorisk: (state, action: PayloadAction<boolean>) => {
      state.excludeAiInvalidNorisk = action.payload;
    },
    resetFilters: () => initialState,
    applyAnalysisFilter: (state) => {
      state.excludeInvalidNorisk = true;
      state.excludeAiInvalidNorisk = false;
    },
    applyAiAnalysisFilter: (state) => {
      state.excludeInvalidNorisk = false;
      state.excludeAiInvalidNorisk = true;
    },
  },
});

export const {
  setSearchQuery,
  setSeverity,
  setKaiStatus,
  setPackageName,
  setCve,
  setCvssRange,
  setDateRange,
  setExcludeInvalidNorisk,
  setExcludeAiInvalidNorisk,
  resetFilters,
  applyAnalysisFilter,
  applyAiAnalysisFilter,
} = filtersSlice.actions;

export default filtersSlice.reducer;

