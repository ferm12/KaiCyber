import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  selectedVulnerabilities: string[];
  comparisonMode: boolean;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  itemsPerPage: number;
  sortBy: {
    field: string;
    direction: 'asc' | 'desc';
  };
  viewMode: 'grid' | 'list';
}

const initialState: UiState = {
  selectedVulnerabilities: [],
  comparisonMode: false,
  sidebarOpen: true,
  theme: 'light',
  itemsPerPage: 50,
  sortBy: {
    field: 'cvss',
    direction: 'desc',
  },
  viewMode: 'list',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleVulnerabilitySelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedVulnerabilities.indexOf(action.payload);
      if (index > -1) {
        state.selectedVulnerabilities.splice(index, 1);
      } else {
        state.selectedVulnerabilities.push(action.payload);
      }
      state.comparisonMode = state.selectedVulnerabilities.length > 0;
    },
    clearSelection: (state) => {
      state.selectedVulnerabilities = [];
      state.comparisonMode = false;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
    setSortBy: (state, action: PayloadAction<{ field: string; direction: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
  },
});

export const {
  toggleVulnerabilitySelection,
  clearSelection,
  setSidebarOpen,
  setTheme,
  setItemsPerPage,
  setSortBy,
  setViewMode,
} = uiSlice.actions;

export default uiSlice.reducer;

