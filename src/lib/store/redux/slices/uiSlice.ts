import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AnalystProfile {
  name: string;
  role: string;
  clearance: string;
  badgeId: string;
}

export interface UIState {
  theme: 'light' | 'dark';
  demoModeNotice: boolean;
  isSearchOpen: boolean;
  isNotificationsOpen: boolean;
  analystProfile: AnalystProfile;
}

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('actip_theme');
    if (saved === 'dark' || saved === 'light') return saved;
  }
  return 'light';
};

const initialState: UIState = {
  theme: 'light',
  demoModeNotice: true,
  isSearchOpen: false,
  isNotificationsOpen: false,
  analystProfile: {
    name: 'Sarah Vance',
    role: 'Tier-3 Threat Intel Lead',
    clearance: 'TOP SECRET // CTI-ORCON',
    badgeId: 'SOC-9042'
  }
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('actip_theme', action.payload);
      }
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('actip_theme', state.theme);
      }
    },
    dismissDemoNotice(state) {
      state.demoModeNotice = false;
    },
    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.isSearchOpen = action.payload;
    },
    setNotificationsOpen(state, action: PayloadAction<boolean>) {
      state.isNotificationsOpen = action.payload;
    },
    setAnalystProfile(state, action: PayloadAction<AnalystProfile>) {
      state.analystProfile = action.payload;
    }
  }
});

export const {
  setTheme,
  toggleTheme,
  dismissDemoNotice,
  setSearchOpen,
  setNotificationsOpen,
  setAnalystProfile
} = uiSlice.actions;

export default uiSlice.reducer;
